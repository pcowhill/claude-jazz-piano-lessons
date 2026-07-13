// Pure conversion from a rendered example to a measure/stack structure the
// VexFlow view can draw. Kept free of DOM and VexFlow so it is unit-testable.

import type { Pitch } from '../music/pitch'
import type { RenderedExample } from '../music/example'

export interface NoteStack {
  kind: 'chord-treble' | 'chord-bass' | 'melody'
  chordIndex: number
  startBeats: number
  beats: number
  /** Ascending pitches; empty for a rest. */
  pitches: Pitch[]
  rest: boolean
  tieToNext: boolean
  /** Parallel to pitches: emphasized (guide-tone) notes. */
  emph: boolean[]
}

export interface SymbolAnchor {
  chordIndex: number
  startBeats: number
  symbolText: string | null
  roman?: string
}

export interface Measure {
  index: number
  startBeats: number
  beats: number
  trebleStacks: NoteStack[]
  /** Present (non-empty) only when some chord in the measure carries melody. */
  melodyStacks: NoteStack[]
  bassStacks: NoteStack[]
  anchors: SymbolAnchor[]
}

const DURATION_BY_BEATS: Record<string, { duration: string; dots: number }> = {
  '4': { duration: 'w', dots: 0 },
  '3': { duration: 'h', dots: 1 },
  '2': { duration: 'h', dots: 0 },
  '1.5': { duration: 'q', dots: 1 },
  '1': { duration: 'q', dots: 0 },
  '0.75': { duration: '8', dots: 1 },
  '0.5': { duration: '8', dots: 0 },
  '0.25': { duration: '16', dots: 0 },
}

export function durationForBeats(beats: number): { duration: string; dots: number } {
  const entry = DURATION_BY_BEATS[String(beats)]
  if (!entry) throw new Error(`Unsupported duration in beats: ${beats}`)
  return entry
}

function sortPitches(pitches: Pitch[], emph: boolean[]): { pitches: Pitch[]; emph: boolean[] } {
  const paired = pitches.map((p, i) => ({ p, e: emph[i] ?? false }))
  paired.sort((a, b) => a.p.octave * 7 + letterOrder(a.p) - (b.p.octave * 7 + letterOrder(b.p)))
  return { pitches: paired.map((x) => x.p), emph: paired.map((x) => x.e) }
}

function letterOrder(p: Pitch): number {
  return { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }[p.letter]
}

export function buildMeasures(example: RenderedExample): Measure[] {
  const { beatsPerBar } = example
  const measures: Measure[] = []
  const measureCount = Math.ceil(example.totalBeats / beatsPerBar)
  for (let i = 0; i < measureCount; i++) {
    measures.push({
      index: i,
      startBeats: i * beatsPerBar,
      beats: beatsPerBar,
      trebleStacks: [],
      melodyStacks: [],
      bassStacks: [],
      anchors: [],
    })
  }

  for (const chord of example.chords) {
    const measureIndex = Math.floor(chord.startBeats / beatsPerBar)
    const measure = measures[measureIndex]
    const withinBar = chord.startBeats - measure.startBeats
    if (withinBar + chord.beats > beatsPerBar + 1e-6) {
      throw new Error(
        `Chord ${chord.index} of example ${example.spec.id} crosses a barline ` +
          `(starts at beat ${withinBar} of a ${beatsPerBar}-beat bar, lasts ${chord.beats})`,
      )
    }
    if (chord.melody.length > 0) {
      const melodyBeats = chord.melody.reduce((sum, m) => sum + m.beats, 0)
      if (Math.abs(melodyBeats - chord.beats) > 1e-6) {
        throw new Error(
          `Melody of chord ${chord.index} in example ${example.spec.id} covers ` +
            `${melodyBeats} beats but the chord lasts ${chord.beats}`,
        )
      }
    }

    const trebleSorted = sortPitches(
      chord.treble.map((n) => n.pitch),
      chord.treble.map((n) => n.emph ?? false),
    )
    measure.trebleStacks.push({
      kind: 'chord-treble',
      chordIndex: chord.index,
      startBeats: chord.startBeats,
      beats: chord.beats,
      pitches: trebleSorted.pitches,
      rest: chord.treble.length === 0,
      tieToNext: false,
      emph: trebleSorted.emph,
    })

    const bassSorted = sortPitches(
      chord.bass.map((n) => n.pitch),
      chord.bass.map((n) => n.emph ?? false),
    )
    measure.bassStacks.push({
      kind: 'chord-bass',
      chordIndex: chord.index,
      startBeats: chord.startBeats,
      beats: chord.beats,
      pitches: bassSorted.pitches,
      rest: chord.bass.length === 0,
      tieToNext: false,
      emph: bassSorted.emph,
    })

    for (const m of chord.melody) {
      measure.melodyStacks.push({
        kind: 'melody',
        chordIndex: chord.index,
        startBeats: m.startBeats,
        beats: m.beats,
        pitches: m.pitch ? [m.pitch] : [],
        rest: m.rest || !m.pitch,
        tieToNext: m.tieToNext,
        emph: [false],
      })
    }

    measure.anchors.push({
      chordIndex: chord.index,
      startBeats: chord.startBeats,
      symbolText: chord.symbolText,
      roman: chord.roman,
    })
  }

  // Melody voices must fill their measure: pad chords without melody with
  // rests when any other chord in the measure carries melody.
  for (const measure of measures) {
    if (measure.melodyStacks.length === 0) continue
    const covered = new Set(measure.melodyStacks.map((s) => s.startBeats))
    for (const stack of measure.trebleStacks) {
      const hasMelody = measure.melodyStacks.some(
        (m) => m.startBeats >= stack.startBeats && m.startBeats < stack.startBeats + stack.beats,
      )
      if (!hasMelody && !covered.has(stack.startBeats)) {
        measure.melodyStacks.push({
          kind: 'melody',
          chordIndex: stack.chordIndex,
          startBeats: stack.startBeats,
          beats: stack.beats,
          pitches: [],
          rest: true,
          tieToNext: false,
          emph: [],
        })
      }
    }
    measure.melodyStacks.sort((a, b) => a.startBeats - b.startBeats)
  }

  return measures
}

/** True when any measure carries a melody voice. */
export function hasMelody(measures: Measure[]): boolean {
  return measures.some((m) => m.melodyStacks.length > 0)
}
