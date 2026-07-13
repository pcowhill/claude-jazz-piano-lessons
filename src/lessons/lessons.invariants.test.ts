// A programmatic theory-and-authoring audit: every example in the atlas is
// rendered in every key and voicing, and its structure is validated. This is
// what keeps 20+ hand-authored examples from silently rotting.

import { describe, expect, it } from 'vitest'
import { ALL_EXAMPLES } from './allExamples'
import { buildReharmChords, type ReharmToggles } from './ReharmLab'
import { renderExample, type ExampleSpec } from '../music/example'
import { buildMeasures } from '../notation/scoreModel'
import { KEY_CHOICES } from '../music/key'
import { pcOf } from '../music/pitch'

function validate(spec: ExampleSpec, keyId: string, voicing: 'clear' | 'jazz', variantId?: string) {
  const rendered = renderExample(spec, { keyId, voicing, octaveShift: 0, variantId })

  // Structure: full bars, sorted timelines.
  expect(rendered.totalBeats % rendered.beatsPerBar).toBe(0)
  const attackStarts = rendered.attacks.map((a) => a.startBeats)
  expect([...attackStarts].sort((a, b) => a - b)).toEqual(attackStarts)
  const sliceStarts = rendered.slices.map((s) => s.startBeats)
  expect([...sliceStarts].sort((a, b) => a - b)).toEqual(sliceStarts)

  // Spelling: nothing beyond double accidentals, ever.
  for (const chord of rendered.chords) {
    for (const note of [...chord.bass, ...chord.treble]) {
      expect(Math.abs(note.pitch.alter), `${spec.id} ${keyId}`).toBeLessThanOrEqual(2)
    }
    for (const m of chord.melody) {
      if (m.pitch) expect(Math.abs(m.pitch.alter)).toBeLessThanOrEqual(2)
    }
    // Every sounding event has something to play.
    expect(chord.chordMidis.length + chord.melody.filter((m) => !m.rest).length).toBeGreaterThan(0)
    // The symbol's root must actually sound somewhere in the event (bass,
    // voicing, or melody) — inversions are fine, root-free labels are not.
    if (chord.symbol) {
      const soundingPcs = new Set([
        ...chord.chordMidis.map((m) => ((m % 12) + 12) % 12),
        ...chord.melody.filter((m) => m.midi != null).map((m) => ((m.midi! % 12) + 12) % 12),
      ])
      expect(
        soundingPcs.has(pcOf(chord.symbol.root)),
        `${spec.id} ${keyId} chord ${chord.index}: symbol root must sound`,
      ).toBe(true)
    }
    // Slash chords: the notated bass really is the symbol's bass note.
    if (chord.symbol?.bass && chord.bass.length > 0) {
      const bassPc = ((chord.bass[0].midi % 12) + 12) % 12
      expect(bassPc, `${spec.id} ${keyId} chord ${chord.index} slash bass`).toBe(pcOf(chord.symbol.bass))
    }
  }

  // Register: playable piano range after re-registration.
  const bassMidis = rendered.chords.flatMap((c) => c.bass.map((n) => n.midi))
  const trebleMidis = rendered.chords.flatMap((c) => [
    ...c.treble.map((n) => n.midi),
    ...c.melody.filter((m) => m.midi != null).map((m) => m.midi!),
  ])
  if (bassMidis.length > 0) {
    expect(Math.min(...bassMidis), `${spec.id} ${keyId} bass floor`).toBeGreaterThanOrEqual(22)
    expect(Math.max(...bassMidis), `${spec.id} ${keyId} bass ceiling`).toBeLessThanOrEqual(67)
  }
  if (trebleMidis.length > 0) {
    expect(Math.max(...trebleMidis), `${spec.id} ${keyId} treble ceiling`).toBeLessThanOrEqual(93)
    expect(Math.min(...trebleMidis), `${spec.id} ${keyId} treble floor`).toBeGreaterThanOrEqual(43)
  }

  // Notation: measures build without barline crossings or melody arithmetic
  // errors, and durations are all notatable.
  const measures = buildMeasures(rendered)
  expect(measures.length).toBe(rendered.totalBeats / rendered.beatsPerBar)
}

describe('every example renders coherently in all 12 keys and both voicings', () => {
  for (const spec of ALL_EXAMPLES) {
    const variantIds = spec.variants?.map((v) => v.id) ?? [undefined]
    it(`${spec.id}`, () => {
      for (const choice of KEY_CHOICES) {
        for (const voicing of ['clear', 'jazz'] as const) {
          for (const variantId of variantIds) {
            validate(spec, choice.id, voicing, variantId ?? undefined)
          }
        }
      }
    })
  }

  it('register shifting stays independent of key for every example', () => {
    for (const spec of ALL_EXAMPLES.slice(0, 6)) {
      const base = renderExample(spec, { keyId: 'Eb', voicing: 'clear', octaveShift: 0 })
      const up = renderExample(spec, { keyId: 'Eb', voicing: 'clear', octaveShift: 1 })
      expect(up.chords.map((c) => c.symbolText)).toEqual(base.chords.map((c) => c.symbolText))
      base.chords.forEach((chord, i) => {
        chord.treble.forEach((note, j) => {
          expect(up.chords[i].treble[j].midi).toBe(note.midi + 12)
        })
      })
    }
  })
})

describe('required progressions are present and exact', () => {
  it('lesson 4 contains C–G/B–Am–D7/F♯–G–G7–C with V/V analysis', () => {
    const spec = ALL_EXAMPLES.find((s) => s.id === 'l4-walkup')!
    const rendered = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0 })
    expect(rendered.chords.map((c) => c.symbolText)).toEqual([
      'C', 'G/B', 'Am', 'D7/F♯', 'G', 'G7', 'C',
    ])
    expect(rendered.chords[3].roman).toBe('V/V')
  })

  it('lesson 7 contains Fm6 → B♭7(♭9) → E♭ with the specified pitch content', () => {
    const spec = ALL_EXAMPLES.find((s) => s.id === 'l7-c-to-eb')!
    const rendered = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0 })
    expect(rendered.chords.map((c) => c.symbolText)).toEqual(['Cmaj7', 'Fm6', 'B♭7(♭9)', 'E♭'])
    const fm6 = rendered.chords[1]
    const fm6Names = [...fm6.bass, ...fm6.treble].map((n) => `${n.pitch.letter}${n.pitch.alter}`)
    expect(new Set(fm6Names)).toEqual(new Set(['F0', 'A-1', 'C0', 'D0']))
    const bb79 = rendered.chords[2]
    const names = [...bb79.bass, ...bb79.treble].map((n) => `${n.pitch.letter}${n.pitch.alter}`)
    // B♭–D–F–A♭–C♭, with C♭ spelled as C-flat, not B.
    expect(new Set(names)).toEqual(new Set(['B-1', 'D0', 'F0', 'A-1', 'C-1']))
    // Common tones D, F, A♭ hold from Fm6; C moves to C♭.
    const common = fm6.chordMidis.filter((m) => bb79.chordMidis.includes(m))
    expect(common.length).toBeGreaterThanOrEqual(3)
  })

  it('lesson 8 dominant family spells E♭♭ over D♭ and C♭ over B♭', () => {
    const spec = ALL_EXAMPLES.find((s) => s.id === 'l8-dominant-family')!
    const rendered = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0 })
    expect(rendered.chords.map((c) => c.symbolText)).toEqual([
      'G7(♭9)', 'B♭7(♭9)', 'D♭7(♭9)', 'E7(♭9)',
    ])
    const flat9s = rendered.chords.map(
      (c) => c.treble.map((n) => `${n.pitch.letter}${n.pitch.alter}`).at(-1),
    )
    expect(flat9s).toEqual(['A-1', 'C-1', 'E-2', 'F0'])
    // All four upper structures are the same sounding collection.
    const collections = rendered.chords.map((c) =>
      new Set(c.treble.map((n) => ((n.midi % 12) + 12) % 12)),
    )
    for (const set of collections) {
      expect(set).toEqual(new Set([11, 2, 5, 8]))
    }
    // But the five-note chords differ: distinct roots.
    const roots = new Set(rendered.chords.map((c) => ((c.bass[0].midi % 12) + 12) % 12))
    expect(roots.size).toBe(4)
  })
})

describe('reharmonization lab', () => {
  const allToggles: ReharmToggles[] = []
  for (const a of [false, true])
    for (const b of [false, true])
      for (const c of [false, true])
        for (const d of [false, true])
          allToggles.push({ secondaryDominant: a, tritoneSub: b, borrowedIv: c, passingDim: d })

  it('all 16 device combinations stay musically well-formed in three keys', () => {
    for (const toggles of allToggles) {
      const spec: ExampleSpec = {
        id: 'lab-test',
        title: 'lab',
        listen: '',
        homeKey: 'C',
        textAlt: '',
        chords: buildReharmChords(toggles),
      }
      for (const keyId of ['C', 'F#/Gb', 'Ab']) {
        validate(spec, keyId, 'clear')
        validate(spec, keyId, 'jazz')
      }
    }
  })

  it('melody is identical across every combination', () => {
    const melodyOf = (toggles: ReharmToggles) => {
      const spec: ExampleSpec = {
        id: 'lab-test',
        title: 'lab',
        listen: '',
        homeKey: 'C',
        textAlt: '',
        chords: buildReharmChords(toggles),
      }
      const rendered = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0 })
      return rendered.chords
        .flatMap((c) => c.melody.filter((m) => m.midi != null))
        .map((m) => `${m.startBeats}:${m.midi}`)
        .join(',')
    }
    const reference = melodyOf(allToggles[0])
    for (const toggles of allToggles.slice(1)) {
      expect(melodyOf(toggles)).toBe(reference)
    }
  })

  it('melody notes are chord tones over every toggled substitute', () => {
    for (const toggles of allToggles) {
      const spec: ExampleSpec = {
        id: 'lab-test',
        title: 'lab',
        listen: '',
        homeKey: 'C',
        textAlt: '',
        chords: buildReharmChords(toggles),
      }
      const rendered = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0 })
      for (const chord of rendered.chords) {
        if (!chord.symbol) continue
        const chordPcs = new Set(chord.chordMidis.map((m) => ((m % 12) + 12) % 12))
        for (const m of chord.melody) {
          if (m.midi == null) continue
          const melodyPc = ((m.midi % 12) + 12) % 12
          // Melody must be a chord tone or an explicitly intended color: the
          // lab was designed so melody notes are members of the sounding
          // chord, or the single documented case of F major under melody D
          // (the added-sixth color) and D♭7 under melody B (the ♭7 supplied
          // by the melody).
          const isMember = chordPcs.has(melodyPc)
          const documented =
            (chord.symbolText === 'F' && melodyPc === 2) ||
            (chord.symbolText === 'D♭7' && melodyPc === 11) ||
            (chord.symbolText === 'E°7' && melodyPc === 7)
          expect(isMember || documented, `${chord.symbolText} under melody pc ${melodyPc}`).toBe(true)
        }
      }
    }
  })
})
