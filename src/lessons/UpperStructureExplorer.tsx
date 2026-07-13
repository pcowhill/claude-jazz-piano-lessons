// The diminished-dominant upper-structure explorer. A dominant foundation
// (default F7 resolving to B♭) supports four major triads — on the root and
// on the three other members of the root-3rd diminished cycle. The spec for
// the embedded panel is rebuilt from the explorer state, so score, keyboard,
// audio, transposition and voicing all flow through the standard machinery.

import { useMemo, useState } from 'react'
import { MusicPanel } from '../components/MusicPanel'
import { usePlayer } from '../audio/player'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'
import { renderExample, allSpecPitches } from '../music/example'
import { keyChoiceById, resolveTonic } from '../music/key'
import {
  canonicalTensionSpelling,
  soundingTensionLabel,
  transposePc,
  transpositionInterval,
} from '../music/interval'
import { midiOf, pc, pcName, pcOf, type Pitch } from '../music/pitch'
import { halfWholeScale } from '../music/scales'
import './explorer.css'

type TriadId = 'I' | 'VI' | 'sIV' | 'bIII'
type Foundation = 'bass' | 'shell' | 'full'

interface TriadDef {
  id: TriadId
  /** Spelled in the home key of F. */
  notes: [string, string, string]
  kind: 'maj'
  symbolKind: '7' | '13b9' | '7b9#11' | '7#9'
  blurb: string
}

const TRIADS: TriadDef[] = [
  {
    id: 'I', notes: ['F', 'A', 'C'], kind: 'maj', symbolKind: '7',
    blurb: 'supplies root, 3rd and 5th — plain dominant, zero tension',
  },
  {
    id: 'VI', notes: ['D', 'F#', 'A'], kind: 'maj', symbolKind: '13b9',
    blurb: 'supplies 13, ♭9 and 3rd',
  },
  {
    id: 'sIV', notes: ['B', 'D#', 'F#'], kind: 'maj', symbolKind: '7b9#11',
    blurb: 'supplies ♯11, ♭7 and ♭9',
  },
  {
    id: 'bIII', notes: ['Ab', 'C', 'Eb'], kind: 'maj', symbolKind: '7#9',
    blurb: 'supplies ♯9, 5th and ♭7',
  },
]

const FOUNDATIONS: { id: Foundation; label: string; treble: string; describe: string }[] = [
  { id: 'bass', label: 'Bass only', treble: '', describe: 'root alone — the triad floats freely' },
  { id: 'shell', label: 'Guide-tone shell', treble: 'A3 Eb4', describe: 'root + 3rd & ♭7 — the working default' },
  { id: 'full', label: 'Fuller F7', treble: 'A3 C4 Eb4', describe: 'root + 3rd, 5th, ♭7 — thicker, more friction' },
]

/** Rotate a root-position triad into an inversion and set ascending octaves with the bottom near F4. */
function realizeTriad(notes: [string, string, string], inversion: number): Pitch[] {
  const order = [...notes.slice(inversion), ...notes.slice(0, inversion)]
  const pitches: Pitch[] = []
  let previous: Pitch | null = null
  for (const name of order) {
    const base = pc(name)
    let octave = 4
    let candidate: Pitch = { ...base, octave }
    if (!previous) {
      while (midiOf(candidate) < 65) candidate = { ...base, octave: ++octave }
      while (midiOf(candidate) >= 77) candidate = { ...base, octave: --octave }
    } else {
      candidate = { ...base, octave: previous.octave }
      while (midiOf(candidate) <= midiOf(previous)) candidate = { ...candidate, octave: candidate.octave + 1 }
    }
    pitches.push(candidate)
    previous = candidate
  }
  return pitches
}

function bestInversion(notes: [string, string, string], prevMidis: number[] | null): number {
  if (!prevMidis || prevMidis.length === 0) return 0
  let best = 0
  let bestCost = Number.POSITIVE_INFINITY
  for (let inversion = 0; inversion < 3; inversion++) {
    const midis = realizeTriad(notes, inversion).map(midiOf).sort((a, b) => a - b)
    const prev = [...prevMidis].sort((a, b) => a - b)
    const cost = midis.reduce((sum, m, i) => sum + Math.abs(m - (prev[i] ?? m)), 0)
    if (cost < bestCost) {
      bestCost = cost
      best = inversion
    }
  }
  return best
}

const fmt = (p: Pitch) => `${p.letter}${p.alter === -1 ? 'b' : p.alter === 1 ? '#' : p.alter === -2 ? 'bb' : p.alter === 2 ? '##' : ''}${p.octave}`

export function UpperStructureExplorer() {
  const player = usePlayer()
  const [keyId, setKeyId] = useState('F')
  const [triadId, setTriadId] = useState<TriadId>('VI')
  const [foundation, setFoundation] = useState<Foundation>('shell')
  const [arpeggiate, setArpeggiate] = useState(false)
  const [autoVoiceLead, setAutoVoiceLead] = useState(true)
  const [inversion, setInversion] = useState(0)
  const [showScale, setShowScale] = useState(false)

  const triad = TRIADS.find((t) => t.id === triadId)!
  const triadPitches = useMemo(() => realizeTriad(triad.notes, inversion), [triad, inversion])

  const selectTriad = (id: TriadId) => {
    const def = TRIADS.find((t) => t.id === id)!
    if (autoVoiceLead) {
      // The currently displayed triad is the "previous" voicing to lead from.
      setInversion(bestInversion(def.notes, triadPitches.map(midiOf)))
    }
    setTriadId(id)
  }

  const foundationDef = FOUNDATIONS.find((f) => f.id === foundation)!

  const spec: ExampleSpec = useMemo(() => {
    const triadNames = triadPitches.map(fmt).join(' ')
    const spread = [triadPitches[0], triadPitches[2], { ...triadPitches[1], octave: triadPitches[1].octave + 1 }]
    const spreadNames = spread.map(fmt).join(' ')
    const dominantTreble = `${foundationDef.treble} ${arpeggiate ? '' : triadNames}`.trim()
    const dominantJazzTreble = `${foundationDef.treble} ${arpeggiate ? '' : spreadNames}`.trim()
    return {
      id: 'l8-ust-explorer',
      title: 'Upper-structure explorer: one dominant, four triads',
      listen: 'Hold one dominant foundation and stack each triad of the diminished cycle above it.',
      homeKey: 'F',
      keyLabel: 'Dominant root',
      defaultTempo: 66,
      textAlt:
        'A dominant seventh foundation with a selectable major upper-structure triad, resolving to the sixth chord a fourth above: by default F7 with a chosen triad, resolving to B flat 6.',
      chords: [
        ch({
          beats: 4,
          sym: ['F', triad.symbolKind],
          roman: 'V7 (of the I a 4th up)',
          func: 'dominant + upper structure',
          bass: 'F2',
          treble: dominantTreble === '' ? 'A3 Eb4' : dominantTreble,
          jtreble: dominantJazzTreble === '' ? 'A3 Eb4' : dominantJazzTreble,
          jbass: 'F2',
          ...(arpeggiate
            ? {
                mel: [
                  [fmt(triadPitches[0]), 1],
                  [fmt(triadPitches[1]), 1],
                  [fmt(triadPitches[2]), 2],
                ] as [string, number][],
              }
            : {}),
          note: `Upper triad: ${triad.blurb}.`,
        }),
        ch({
          beats: 4,
          sym: ['Bb', '6'],
          roman: 'I6',
          func: 'resolution',
          bass: 'Bb2',
          treble: 'Bb3 D4 F4 G4',
          jbass: 'Bb2',
          jtreble: 'D4 G4 A4 C5',
          note: 'Jazz voicing colors the arrival as a 6/9 shape (adds 9, keeps 6 on top).',
        }),
      ],
      analysis: [
        'The four triad roots — the dominant\'s root, 13, ♯11-as-♭5 partner and ♯9 — reorder into a single fully diminished seventh collection. Over F: F, D, B, A♭ = B–D–F–A♭.',
        'Everything these four triads can play comes from the half–whole diminished scale on the dominant root; over F that is F–G♭–A♭–A–B–C–D–E♭.',
      ],
    }
  }, [triadPitches, triad, foundationDef, arpeggiate])

  // Resolve current root spelling exactly the way the panel will.
  const root = useMemo(() => {
    return resolveTonic(keyChoiceById(keyId), keyChoiceById('F').tonics[0], allSpecPitches(spec))
  }, [keyId, spec])
  const iv = useMemo(() => transpositionInterval(pc('F'), root), [root])
  const rootPcNum = pcOf(root)

  const tensionRows = triad.notes.map((name) => {
    const spelled = transposePc(pc(name), iv)
    const label = soundingTensionLabel(rootPcNum, pcOf(spelled))
    const canonical = canonicalTensionSpelling(root, pcOf(spelled))
    const respelled = pcName(canonical) !== pcName(spelled)
    return { name: pcName(spelled), label, soundsAs: respelled ? pcName(canonical) : null }
  })

  const triadChipLabel = (def: TriadDef) => pcName(transposePc(pc(def.notes[0]), iv))
  const scale = halfWholeScale(root)
  const scalePcs = useMemo(() => new Set(scale.map(pcOf)), [scale])
  const cycleNames = (['I', 'VI', 'sIV', 'bIII'] as TriadId[])
    .map((id) => pcName(transposePc(pc(TRIADS.find((t) => t.id === id)!.notes[0]), iv)))

  const resolveNow = () => {
    const rendered = renderExample(spec, { keyId, voicing: 'clear', octaveShift: 0 })
    const [dom, target] = rendered.chords
    const domMidis = [...dom.chordMidis, ...dom.melody.filter((m) => m.midi != null).map((m) => m.midi!)]
    player.sound(domMidis, 1.5)
    window.setTimeout(() => player.sound(target.chordMidis, 2.0), 1250)
  }

  const showBite = triadId === 'bIII' && foundation === 'full'

  return (
    <MusicPanel spec={spec} keyId={keyId} onKeyChange={setKeyId} scalePcs={showScale ? scalePcs : undefined}>
      <div className="panel__custom explorer">
        <div className="explorer__row">
          <span className="explorer__label" id="ust-triad-label">Upper triad</span>
          <div className="chip-row" role="group" aria-labelledby="ust-triad-label">
            {TRIADS.map((def) => (
              <button
                key={def.id}
                type="button"
                className="chip"
                aria-pressed={triadId === def.id}
                onClick={() => selectTriad(def.id)}
              >
                {triadChipLabel(def)} major
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--small btn--primary" onClick={resolveNow}>
            Resolve to {pcName(transposePc(pc('Bb'), iv))}
          </button>
        </div>

        <div className="explorer__row">
          <label className="field">
            Foundation
            <select value={foundation} onChange={(e) => setFoundation(e.target.value as Foundation)}>
              {FOUNDATIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <div className="seg" role="group" aria-label="Playback style">
            <button type="button" className="seg__option" aria-pressed={!arpeggiate} onClick={() => setArpeggiate(false)}>
              Block
            </button>
            <button type="button" className="seg__option" aria-pressed={arpeggiate} onClick={() => setArpeggiate(true)}>
              Arpeggiated
            </button>
          </div>
          <label className="field field--checkbox">
            <input
              type="checkbox"
              checked={autoVoiceLead}
              onChange={(e) => setAutoVoiceLead(e.target.checked)}
            />
            Smooth voice leading (auto inversion)
          </label>
          <label className="field">
            Inversion
            <select
              value={inversion}
              disabled={autoVoiceLead}
              onChange={(e) => setInversion(Number(e.target.value))}
              aria-label="Manual triad inversion"
            >
              <option value={0}>Root position</option>
              <option value={1}>1st inversion</option>
              <option value={2}>2nd inversion</option>
            </select>
          </label>
          <label className="field field--checkbox">
            <input type="checkbox" checked={showScale} onChange={(e) => setShowScale(e.target.checked)} />
            Mark half–whole scale tones on the keyboard
          </label>
        </div>

        <div className="explorer__tensions" aria-live="off">
          <table className="explorer__table">
            <caption className="sr-only">Interval functions of the selected triad over the dominant root</caption>
            <thead>
              <tr>
                <th scope="col">Triad note</th>
                {tensionRows.map((row) => (
                  <th key={row.name} scope="col">{row.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Function over {pcName(root)}7</th>
                {tensionRows.map((row) => (
                  <td key={row.name}>
                    <strong>{row.label}</strong>
                    {row.soundsAs && <span className="explorer__sounds"> — sounds as {row.soundsAs}</span>}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="explorer__cycle">
            The four triad roots — {cycleNames.join(', ')} — reorder into one fully
            diminished collection; their combined colors all live in the{' '}
            {pcName(root)} half–whole scale: {scale.map(pcName).join('–')}.
          </p>
          {showBite && (
            <p className="explorer__warning">
              Listening note: {triadChipLabel(triad)} major over the <em>full</em> {pcName(root)}7
              foundation puts {tensionRows[0].name} (♯9) directly against the chord's major
              3rd ({pcName(transposePc(pc('A'), iv))}) — an intentionally biting rub.
              Spacing, register and a confident resolution decide whether it sounds rich or
              just crowded; not every dense block voicing succeeds equally.
            </p>
          )}
        </div>
      </div>
    </MusicPanel>
  )
}
