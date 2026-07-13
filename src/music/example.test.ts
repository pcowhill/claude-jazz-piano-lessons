import { describe, expect, it } from 'vitest'
import { renderExample, type ExampleSpec } from './example'
import { sym } from './chord'
import { sp, sps } from './pitch'
import { KEY_CHOICES } from './key'

const twoFiveOne: ExampleSpec = {
  id: 'test-251',
  title: 'Test ii–V–I',
  listen: 'Listen to the guide tones.',
  homeKey: 'C',
  textAlt: 'D minor seven, G seven, C major seven.',
  chords: [
    {
      beats: 4,
      symbol: sym('D', 'm7'),
      roman: 'ii7',
      clear: { bass: sps('D2 A2'), treble: sps('F3 A3 C4 E4') },
      jazz: { bass: sps('D2'), treble: sps('F3 C4 E4 A4') },
      melody: [
        { pitch: sp('F4'), beats: 2 },
        { pitch: sp('A4'), beats: 2 },
      ],
    },
    {
      beats: 4,
      symbol: sym('G', '7'),
      roman: 'V7',
      clear: { bass: sps('G2 D3'), treble: sps('F3 B3 D4') },
      jazz: { bass: sps('G2'), treble: sps('F3 B3 E4 A4') },
    },
    {
      beats: 4,
      symbol: sym('C', 'maj7'),
      roman: 'Imaj7',
      clear: { bass: sps('C2 G2'), treble: sps('E3 B3 C4') },
      jazz: { bass: sps('C2'), treble: sps('E3 B3 D4 G4') },
    },
  ],
}

const render = (keyId: string, voicing: 'clear' | 'jazz' = 'clear', octaveShift = 0) =>
  renderExample(twoFiveOne, { keyId, voicing, octaveShift })

describe('transposition across all 12 tonic targets', () => {
  const expectedTwoChord: Record<string, string> = {
    C: 'Dm7',
    Db: 'E♭m7',
    D: 'Em7',
    Eb: 'Fm7',
    E: 'F♯m7',
    F: 'Gm7',
    'F#/Gb': 'A♭m7', // G♭ spelling wins for mostly-natural material
    G: 'Am7',
    Ab: 'B♭m7',
    A: 'Bm7',
    Bb: 'Cm7',
    B: 'C♯m7',
  }

  for (const choice of KEY_CHOICES) {
    it(`renders coherently in ${choice.id}`, () => {
      const rendered = render(choice.id)
      expect(rendered.chords[0].symbolText).toBe(expectedTwoChord[choice.id])
      // Roman numerals are key-relative and must not change.
      expect(rendered.chords.map((c) => c.roman)).toEqual(['ii7', 'V7', 'Imaj7'])
      // Every spelled note stays within double accidentals.
      for (const chord of rendered.chords) {
        for (const note of [...chord.bass, ...chord.treble]) {
          expect(Math.abs(note.pitch.alter)).toBeLessThanOrEqual(2)
        }
      }
      // Voicings stay in a practical register.
      const bassMidis = rendered.chords.flatMap((c) => c.bass.map((n) => n.midi))
      const trebleMidis = rendered.chords.flatMap((c) => c.treble.map((n) => n.midi))
      expect(Math.min(...bassMidis)).toBeGreaterThanOrEqual(28 - 6)
      expect(Math.max(...trebleMidis)).toBeLessThanOrEqual(86 + 6)
    })
  }

  it('keeps chord quality intervals exact in every key', () => {
    for (const choice of KEY_CHOICES) {
      const rendered = render(choice.id)
      // ii7 chord tones relative to its root: m3 structure means root-to-third = 3 semitones.
      const g7 = rendered.chords[1]
      const midis = [...g7.bass, ...g7.treble].map((n) => n.midi % 12)
      const rootPc = g7.bass[0].midi % 12
      const relative = new Set(midis.map((m) => (m - rootPc + 12) % 12))
      expect(relative.has(4)).toBe(true) // major third
      expect(relative.has(10)).toBe(true) // minor seventh
    }
  })
})

describe('register control is independent of key', () => {
  it('shifts every sounding note by octaves without changing symbols', () => {
    const base = render('Eb')
    const up = render('Eb', 'clear', 1)
    const down = render('Eb', 'clear', -1)
    expect(up.chords.map((c) => c.symbolText)).toEqual(base.chords.map((c) => c.symbolText))
    base.chords.forEach((chord, i) => {
      chord.bass.forEach((note, j) => {
        expect(up.chords[i].bass[j].midi).toBe(note.midi + 12)
        expect(down.chords[i].bass[j].midi).toBe(note.midi - 12)
      })
    })
  })

  it('re-registers out-of-range voicings after transposition', () => {
    const lowSpec: ExampleSpec = {
      id: 'test-low',
      title: 'Low',
      listen: '',
      homeKey: 'C',
      textAlt: '',
      chords: [
        {
          beats: 4,
          symbol: sym('F', 'maj'),
          clear: { bass: sps('F1'), treble: sps('A3 C4 F4') },
        },
      ],
    }
    // Down a whole step (to B♭) the authored F1 would hit E♭1 (27), below the
    // E1 floor, so the bass voice comes up an octave.
    const rendered = renderExample(lowSpec, { keyId: 'Bb', voicing: 'clear', octaveShift: 0 })
    expect(rendered.chords[0].bass[0].midi).toBe(39) // E♭2
  })
})

describe('voicing modes', () => {
  it('selects clear vs jazz voicings from the same spec', () => {
    const clear = render('C', 'clear')
    const jazz = render('C', 'jazz')
    expect(clear.chords[1].treble.map((n) => n.midi)).not.toEqual(
      jazz.chords[1].treble.map((n) => n.midi),
    )
    // Symbols and analysis stay identical across voicing changes.
    expect(clear.chords.map((c) => c.symbolText)).toEqual(jazz.chords.map((c) => c.symbolText))
  })

  it('falls back to clear when a chord has no jazz voicing', () => {
    const spec: ExampleSpec = {
      ...twoFiveOne,
      id: 'test-fallback',
      chords: [{ beats: 4, symbol: sym('C', 'maj'), clear: { bass: sps('C2'), treble: sps('E3 G3') } }],
    }
    const rendered = renderExample(spec, { keyId: 'C', voicing: 'jazz', octaveShift: 0 })
    expect(rendered.chords[0].treble.map((n) => n.midi)).toEqual([52, 55])
  })
})

describe('playback event derivation', () => {
  it('produces chord and melody attacks at correct beat offsets', () => {
    const rendered = render('C')
    const starts = rendered.attacks.map((a) => a.startBeats)
    expect(starts).toEqual([0, 0, 2, 4, 8])
    const chordAttack = rendered.attacks.find((a) => a.midis.length > 1)
    expect(chordAttack?.beats).toBe(4)
  })

  it('produces highlight slices at every onset with sounding midis', () => {
    const rendered = render('C')
    expect(rendered.slices.map((s) => s.startBeats)).toEqual([0, 2, 4, 8])
    // The beat-2 slice keeps the chord sounding and swaps the melody note.
    const slice = rendered.slices[1]
    expect(slice.chordIndex).toBe(0)
    expect(slice.midis).toContain(69) // A4 melody
    expect(slice.midis).toContain(38) // D2 bass still held
  })

  it('merges tied melody notes into one attack while keeping slices', () => {
    const tied: ExampleSpec = {
      id: 'test-tie',
      title: 'Tie',
      listen: '',
      homeKey: 'C',
      textAlt: '',
      chords: [
        {
          beats: 4,
          symbol: sym('C', 'maj'),
          clear: { bass: sps('C2'), treble: sps('E3 G3') },
          melody: [
            { pitch: sp('G4'), beats: 2, tieToNext: true },
            { pitch: sp('G4'), beats: 2 },
          ],
        },
      ],
    }
    const rendered = renderExample(tied, { keyId: 'C', voicing: 'clear', octaveShift: 0 })
    const melodyAttacks = rendered.attacks.filter((a) => a.midis.length === 1)
    expect(melodyAttacks).toHaveLength(1)
    expect(melodyAttacks[0].beats).toBe(4)
    expect(rendered.slices).toHaveLength(2)
  })

  it('computes totals and ranges', () => {
    const rendered = render('C')
    expect(rendered.totalBeats).toBe(12)
    expect(rendered.minMidi).toBe(36) // C2
    expect(rendered.maxMidi).toBe(69) // A4 melody
  })
})

describe('contextual note names for the keyboard', () => {
  it('labels midis with the spelling of the current key', () => {
    const rendered = render('Db')
    // The ii chord of D♭ is E♭m7; its third G♭ must be labeled G♭, not F♯.
    const values = [...rendered.nameByMidi.values()]
    expect(values.some((v) => v.startsWith('G♭'))).toBe(true)
    expect(values.some((v) => v.startsWith('F♯'))).toBe(false)
  })
})

describe('variants', () => {
  it('renders the requested variant and keeps ids stable', () => {
    const spec: ExampleSpec = {
      id: 'test-variants',
      title: 'Variants',
      listen: '',
      homeKey: 'C',
      textAlt: '',
      variants: [
        {
          id: 'a',
          label: 'A',
          chords: [{ beats: 4, symbol: sym('G', '7'), clear: { bass: sps('G2'), treble: sps('F3 B3') } }],
        },
        {
          id: 'b',
          label: 'B',
          chords: [{ beats: 4, symbol: sym('Db', '7'), clear: { bass: sps('Db2'), treble: sps('F3 Cb4') } }],
        },
      ],
    }
    const a = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0, variantId: 'a' })
    const b = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0, variantId: 'b' })
    expect(a.chords[0].symbolText).toBe('G7')
    expect(b.chords[0].symbolText).toBe('D♭7')
    // Unknown variant falls back to the first.
    const fallback = renderExample(spec, { keyId: 'C', voicing: 'clear', octaveShift: 0, variantId: 'zz' })
    expect(fallback.variantId).toBe('a')
  })
})
