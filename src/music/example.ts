// The single source of truth for every playable example. An ExampleSpec is
// authored once, in a home key, as spelled pitches with structured chord
// symbols; audio scheduling, notation, keyboard highlighting, chord symbols,
// analysis and exercises all derive from the rendered form produced here.

import type { Pitch, PitchClass } from './pitch'
import { midiOf, pitchName, respellExtreme, spokenPitchName } from './pitch'
import { transposePitch, transpositionInterval, type Interval } from './interval'
import {
  formatChordSymbol,
  spokenChordSymbol,
  transposeChordSymbol,
  type ChordSymbolSpec,
} from './chord'
import { keyChoiceById, keySignatureName, resolveTonic } from './key'

export type VoicingMode = 'clear' | 'jazz'

export interface Voicing {
  bass: Pitch[]
  treble: Pitch[]
}

export interface MelodyNoteSpec {
  /** Omitted for rests. */
  pitch?: Pitch
  beats: number
  rest?: boolean
  /** Tie this note to the next melody note (same pitch, one attack). */
  tieToNext?: boolean
}

export interface ChordEventSpec {
  beats: number
  symbol: ChordSymbolSpec | null
  /** Roman-numeral / functional label; key-relative, unchanged by transposition. */
  roman?: string
  /** Coarse function tag shown in the current-chord display: e.g. 'tonic'. */
  func?: string
  clear: Voicing
  /** Defaults to the clear voicing when omitted. */
  jazz?: Voicing
  /** Melody notes stacked above the voicing; beats must sum to the chord's beats. */
  melody?: MelodyNoteSpec[]
  /** Guide tones or other emphasized notes, rendered with accent color. */
  emph?: Pitch[]
  /** One-line note shown in the Analyze panel for this chord. */
  note?: string
}

export interface VariantSpec {
  id: string
  label: string
  chords: ChordEventSpec[]
  /** Optional variant-specific analyze paragraphs. */
  analysis?: string[]
}

export interface ExampleSpec {
  id: string
  title: string
  /** One-sentence listening instruction. */
  listen: string
  /** Tonic name of the authored key, e.g. 'C', 'F'. */
  homeKey: string
  /** Label shown beside the key selector, e.g. 'Key' or 'Dominant root'. */
  keyLabel?: string
  beatsPerBar?: number
  staves?: 'grand' | 'treble'
  defaultTempo?: number
  /** Key-selector id the example starts on; defaults to the home key. */
  initialKeyId?: string
  chords?: ChordEventSpec[]
  variants?: VariantSpec[]
  /** Analyze-panel paragraphs. */
  analysis?: string[]
  /** Plain-language description of the progression for screen readers. */
  textAlt: string
}

export interface RenderedNote {
  pitch: Pitch
  midi: number
  emph?: boolean
}

export interface RenderedMelodyNote {
  pitch: Pitch | null
  midi: number | null
  startBeats: number
  beats: number
  rest: boolean
  tieToNext: boolean
}

export interface RenderedChord {
  index: number
  startBeats: number
  beats: number
  symbol: ChordSymbolSpec | null
  symbolText: string | null
  roman?: string
  func?: string
  bass: RenderedNote[]
  treble: RenderedNote[]
  melody: RenderedMelodyNote[]
  /** Sounding chord midis (bass + treble, no melody). */
  chordMidis: number[]
  note?: string
}

export interface Attack {
  startBeats: number
  beats: number
  midis: number[]
  velocity: number
}

export interface Slice {
  startBeats: number
  chordIndex: number
  /** Everything sounding from this moment (chord + melody note). */
  midis: number[]
}

export interface RenderedExample {
  spec: ExampleSpec
  keyId: string
  variantId: string | null
  tonic: PitchClass
  keySignature: string
  voicing: VoicingMode
  octaveShift: number
  chords: RenderedChord[]
  analysis: string[]
  totalBeats: number
  beatsPerBar: number
  attacks: Attack[]
  slices: Slice[]
  minMidi: number
  maxMidi: number
  /** Contextual spelling for keyboard labels, keyed by midi. */
  nameByMidi: Map<number, string>
  textAlt: string
}

// Practical piano-register bounds used to re-anchor voicings after
// transposition. Bass stays out of the muddy sub-contra range; treble stays
// below the glassy extreme top.
const BASS_MIN = 28 // E1
const BASS_MAX = 57 // A3
const TREBLE_MIN = 50 // D3
const TREBLE_MAX = 86 // D6

function chordsOf(spec: ExampleSpec, variantId: string | null): ChordEventSpec[] {
  if (spec.variants && spec.variants.length > 0) {
    const variant = spec.variants.find((v) => v.id === variantId) ?? spec.variants[0]
    return variant.chords
  }
  if (!spec.chords) throw new Error(`Example ${spec.id} has no chords`)
  return spec.chords
}

/** Every pitch in every variant/voicing, used for key-spelling decisions. */
export function allSpecPitches(spec: ExampleSpec): Pitch[] {
  const out: Pitch[] = []
  const collect = (chords: ChordEventSpec[]) => {
    for (const chord of chords) {
      out.push(...chord.clear.bass, ...chord.clear.treble)
      if (chord.jazz) out.push(...chord.jazz.bass, ...chord.jazz.treble)
      for (const m of chord.melody ?? []) if (m.pitch) out.push(m.pitch)
    }
  }
  if (spec.variants) spec.variants.forEach((v) => collect(v.chords))
  if (spec.chords) collect(spec.chords)
  return out
}

export interface RenderOptions {
  keyId: string
  voicing: VoicingMode
  octaveShift: number
  variantId?: string | null
}

function shiftForRange(midis: number[], min: number, max: number): number {
  if (midis.length === 0) return 0
  const lo = Math.min(...midis)
  const hi = Math.max(...midis)
  if (lo < min && hi + 12 <= max + 4) return 12
  if (hi > max && lo - 12 >= min - 4) return -12
  return 0
}

function applyOctave(p: Pitch, semitones: number): Pitch {
  return { ...p, octave: p.octave + semitones / 12 }
}

export function renderExample(spec: ExampleSpec, options: RenderOptions): RenderedExample {
  const beatsPerBar = spec.beatsPerBar ?? 4
  const variantId =
    spec.variants && spec.variants.length > 0
      ? ((options.variantId != null && spec.variants.some((v) => v.id === options.variantId)
          ? options.variantId
          : spec.variants[0].id) as string)
      : null
  const chords = chordsOf(spec, variantId)

  const choice = keyChoiceById(options.keyId)
  const homeTonic = keyChoiceById(spec.homeKey).tonics[0]
  const tonic = resolveTonic(choice, homeTonic, allSpecPitches(spec))
  const iv: Interval = transpositionInterval(homeTonic, tonic)

  const movePitch = (p: Pitch): Pitch => respellExtreme(transposePitch(p, iv))

  // First pass: transpose, gather per-voice ranges for register correction.
  interface Working {
    spec: ChordEventSpec
    bass: Pitch[]
    treble: Pitch[]
    melody: { pitch: Pitch | null; beats: number; rest: boolean; tieToNext: boolean }[]
    emph: Pitch[]
  }
  const working: Working[] = chords.map((chord) => {
    const voicing = options.voicing === 'jazz' && chord.jazz ? chord.jazz : chord.clear
    return {
      spec: chord,
      bass: voicing.bass.map(movePitch),
      treble: voicing.treble.map(movePitch),
      melody: (chord.melody ?? []).map((m) => ({
        pitch: m.pitch && !m.rest ? movePitch(m.pitch) : null,
        beats: m.beats,
        rest: m.rest ?? false,
        tieToNext: m.tieToNext ?? false,
      })),
      emph: (chord.emph ?? []).map(movePitch),
    }
  })

  const bassMidis = working.flatMap((w) => w.bass.map(midiOf))
  const trebleMidis = working.flatMap((w) => [
    ...w.treble.map(midiOf),
    ...w.melody.filter((m) => m.pitch).map((m) => midiOf(m.pitch!)),
  ])
  const bassShift = shiftForRange(bassMidis, BASS_MIN, BASS_MAX)
  const trebleShift = shiftForRange(trebleMidis, TREBLE_MIN, TREBLE_MAX)
  const userShift = options.octaveShift * 12

  const nameByMidi = new Map<number, string>()
  const rendered: RenderedChord[] = []
  let cursor = 0
  const emphKey = (p: Pitch) => midiOf(p)

  working.forEach((w, index) => {
    const emphMidis = new Set(w.emph.map((p) => emphKey(p) + trebleShift + userShift))
    const emphBassMidis = new Set(w.emph.map((p) => emphKey(p) + bassShift + userShift))
    const toNote = (p: Pitch, shift: number, emphSet: Set<number>): RenderedNote => {
      const moved = applyOctave(p, shift + userShift)
      const midi = midiOf(moved)
      nameByMidi.set(midi, pitchName(moved))
      return { pitch: moved, midi, ...(emphSet.has(midi) ? { emph: true } : {}) }
    }
    const bass = w.bass.map((p) => toNote(p, bassShift, emphBassMidis))
    const treble = w.treble.map((p) => toNote(p, trebleShift, emphMidis))
    let melodyCursor = cursor
    const melody: RenderedMelodyNote[] = w.melody.map((m) => {
      const startBeats = melodyCursor
      melodyCursor += m.beats
      if (!m.pitch) {
        return { pitch: null, midi: null, startBeats, beats: m.beats, rest: true, tieToNext: false }
      }
      const moved = applyOctave(m.pitch, trebleShift + userShift)
      const midi = midiOf(moved)
      nameByMidi.set(midi, pitchName(moved))
      return { pitch: moved, midi, startBeats, beats: m.beats, rest: false, tieToNext: m.tieToNext }
    })
    const symbol = w.spec.symbol ? transposeChordSymbol(w.spec.symbol, iv) : null
    const chordMidis = [...bass, ...treble].map((n) => n.midi)
    rendered.push({
      index,
      startBeats: cursor,
      beats: w.spec.beats,
      symbol,
      symbolText: symbol ? formatChordSymbol(symbol) : null,
      roman: w.spec.roman,
      func: w.spec.func,
      bass,
      treble,
      melody,
      chordMidis,
      note: w.spec.note,
    })
    cursor += w.spec.beats
  })

  // Attacks: chord voicings at chord starts, melody notes at their own
  // starts. A tied melody note extends the previous attack instead of
  // re-attacking.
  const attacks: Attack[] = []
  for (const chord of rendered) {
    if (chord.chordMidis.length > 0) {
      attacks.push({
        startBeats: chord.startBeats,
        beats: chord.beats,
        midis: chord.chordMidis,
        velocity: 0.78,
      })
    }
    let carried = 0
    for (let i = 0; i < chord.melody.length; i++) {
      const m = chord.melody[i]
      if (m.rest || m.midi == null) {
        carried = 0
        continue
      }
      if (carried > 0) {
        // This note was tied from the previous one; extend that attack.
        const prev = attacks[attacks.length - 1]
        prev.beats += m.beats
        carried = m.tieToNext ? carried : 0
        continue
      }
      attacks.push({ startBeats: m.startBeats, beats: m.beats, midis: [m.midi], velocity: 0.9 })
      if (m.tieToNext) carried = 1
    }
  }
  attacks.sort((a, b) => a.startBeats - b.startBeats)

  // Slices: the highlight timeline. One slice per distinct onset moment.
  const slices: Slice[] = []
  for (const chord of rendered) {
    const onsets = new Set<number>([chord.startBeats])
    for (const m of chord.melody) if (!m.rest) onsets.add(m.startBeats)
    const sorted = [...onsets].sort((a, b) => a - b)
    for (const at of sorted) {
      const soundingMelody = chord.melody.filter(
        (m) => !m.rest && m.midi != null && m.startBeats <= at && at < m.startBeats + m.beats,
      )
      slices.push({
        startBeats: at,
        chordIndex: chord.index,
        midis: [...chord.chordMidis, ...soundingMelody.map((m) => m.midi!)],
      })
    }
  }
  slices.sort((a, b) => a.startBeats - b.startBeats)

  const allMidis = [
    ...rendered.flatMap((c) => c.chordMidis),
    ...rendered.flatMap((c) => c.melody.filter((m) => m.midi != null).map((m) => m.midi!)),
  ]
  const variant = spec.variants?.find((v) => v.id === variantId)
  const analysis = [...(spec.analysis ?? []), ...(variant?.analysis ?? [])]

  return {
    spec,
    keyId: options.keyId,
    variantId,
    tonic,
    keySignature: keySignatureName(tonic),
    voicing: options.voicing,
    octaveShift: options.octaveShift,
    chords: rendered,
    analysis,
    totalBeats: cursor,
    beatsPerBar,
    attacks,
    slices,
    minMidi: allMidis.length ? Math.min(...allMidis) : 60,
    maxMidi: allMidis.length ? Math.max(...allMidis) : 72,
    nameByMidi,
    textAlt: spec.textAlt,
  }
}

/** Chord-tone table for the Analyze panel: spelled name + interval label. */
export interface ToneLabel {
  name: string
  spoken: string
  label: string
}

export function describeProgression(example: RenderedExample): string {
  const parts = example.chords
    .filter((c) => c.symbol)
    .map((c) => spokenChordSymbol(c.symbol!) + (c.roman ? ` (${c.roman})` : ''))
  return parts.join(', ')
}

export function melodySpoken(example: RenderedExample): string {
  const notes = example.chords.flatMap((c) =>
    c.melody.filter((m) => m.pitch != null).map((m) => spokenPitchName(m.pitch!)),
  )
  return notes.join(', ')
}
