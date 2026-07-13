// The reharmonization lab: four independent devices toggle on and off over a
// fixed eight-bar melody. Each device owns its own slot in the form, and the
// melody was written to remain a stable chord tone over every combination —
// all sixteen states are musically coherent.

import { useMemo, useState } from 'react'
import { MusicPanel } from '../components/MusicPanel'
import { ch } from './authoring'
import type { ChordEventSpec, ExampleSpec } from '../music/example'

export interface ReharmToggles {
  secondaryDominant: boolean
  tritoneSub: boolean
  borrowedIv: boolean
  passingDim: boolean
}

export function buildReharmChords(toggles: ReharmToggles): ChordEventSpec[] {
  const chords: ChordEventSpec[] = []

  // Bar 1 — tonic.
  chords.push(
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 G3 B3 D4',
      mel: [['E4', 2], ['G4', 2]],
    }),
  )

  // Bar 2 — vi7, or V/ii when the secondary dominant is on.
  chords.push(
    toggles.secondaryDominant
      ? ch({
          beats: 4, sym: ['A', '7'], roman: 'V7/ii', func: 'secondary dominant',
          bass: 'A2', treble: 'G3 C#4 E3', jbass: 'A2', jtreble: 'G3 B3 C#4',
          mel: [['A4', 2], ['E4', 2]],
          emph: 'C#4',
          note: 'C♯ converts the resting vi into a dominant aimed at D minor. Melody A and E (root and 5th) are untouched.',
        })
      : ch({
          beats: 4, sym: ['A', 'm7'], roman: 'vi7', func: 'tonic substitute',
          bass: 'A2', treble: 'G3 C4 E3', jbass: 'A2', jtreble: 'G3 B3 C4',
          mel: [['A4', 2], ['E4', 2]],
        }),
  )

  // Bar 3 — ii7.
  chords.push(
    ch({
      beats: 4, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant',
      bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4 E4',
      mel: [['F4', 2], ['A4', 2]],
    }),
  )

  // Bar 4 — V7, or its tritone substitute.
  chords.push(
    toggles.tritoneSub
      ? ch({
          beats: 4, sym: ['Db', '7'], roman: 'subV7/I', func: 'substitute dominant',
          bass: 'Db3', treble: 'F3 Ab3 Cb4', jbass: 'Db3', jtreble: 'F3 Cb4 Eb4',
          mel: [['F4', 4]],
          emph: 'F3 Cb4',
          note: 'The held melody F was G7\'s ♭7; over D♭7 the very same key is the chord\'s 3rd. Bass slides D→D♭→C.',
        })
      : ch({
          beats: 4, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2 D3', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 A3 B3 E4',
          mel: [['F4', 4]],
          note: 'Melody F is the 7th of G7 — maximum lean into the mid-form resolution.',
        }),
  )

  // Bar 5 — tonic, optionally splitting into a passing °7 toward bar 6.
  if (toggles.passingDim) {
    chords.push(
      ch({
        beats: 2, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
        bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 G3 B3',
        mel: [['E4', 2]],
      }),
      ch({
        beats: 2, sym: ['E', 'dim7'], roman: 'vii°7/IV', func: 'passing diminished',
        bass: 'E3', treble: 'G3 Bb3 Db4', jbass: 'E3', jtreble: 'Bb3 Db4',
        mel: [['G4', 2]],
        emph: 'Db4',
        note: 'E°7 (E–G–B♭–D♭) leads the bass from E toward F. Melody G is a chord tone of the diminished chord itself. In the jazz voicing the melody G supplies the chord\'s 3rd.',
      }),
    )
  } else {
    chords.push(
      ch({
        beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
        bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 G3 B3',
        mel: [['E4', 2], ['G4', 2]],
      }),
    )
  }

  // Bar 6 — IV, or the borrowed iv6.
  chords.push(
    toggles.borrowedIv
      ? ch({
          beats: 4, sym: ['F', 'm6'], roman: 'iv6', func: 'borrowed (modal interchange)',
          bass: 'F3', treble: 'Ab3 C4 D4', jbass: 'F3', jtreble: 'Ab3 D4 G4',
          mel: [['C5', 2], ['D5', 2]],
          emph: 'Ab3',
          note: 'A♭ borrowed from C minor. Both melody notes survive: C is the 5th and D the 6th of Fm6.',
        })
      : ch({
          beats: 4, sym: ['F', 'maj'], roman: 'IV', func: 'predominant',
          bass: 'F3', treble: 'A3 C4', jbass: 'F3', jtreble: 'A3 C4 D4',
          mel: [['C5', 2], ['D5', 2]],
          note: 'Melody D over IV adds a passing sixth — bright and diatonic. (Jazz voicing leans into the F6 color.)',
        }),
  )

  // Bar 7 — the closing dominant, always classic V7.
  chords.push(
    ch({
      beats: 4, sym: ['G', '7'], roman: 'V7', func: 'dominant',
      bass: 'G2', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 A3 B3 E4',
      mel: [['B4', 2], ['D5', 2]],
      note: 'The final cadence keeps the plain V7 so each experiment above resolves against the same finish line.',
    }),
  )

  // Bar 8 — home.
  chords.push(
    ch({
      beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
      bass: 'C3 G3', treble: 'E4 G4', jbass: 'C3 G3', jtreble: 'E4 G4',
      mel: [['C5', 4]],
    }),
  )

  return chords
}

const DEVICES: { key: keyof ReharmToggles; label: string; describe: string }[] = [
  { key: 'secondaryDominant', label: 'Secondary dominant', describe: 'bar 2: Am7 → A7 (V/ii)' },
  { key: 'tritoneSub', label: 'Tritone substitution', describe: 'bar 4: G7 → D♭7 (subV7/I)' },
  { key: 'borrowedIv', label: 'Borrowed iv6', describe: 'bar 6: F → Fm6 (from C minor)' },
  { key: 'passingDim', label: 'Passing °7', describe: 'bar 5: Cmaj7 → Cmaj7 + E°7 (into bar 6)' },
]

export function ReharmLab() {
  const [toggles, setToggles] = useState<ReharmToggles>({
    secondaryDominant: false,
    tritoneSub: false,
    borrowedIv: false,
    passingDim: false,
  })

  const spec: ExampleSpec = useMemo(
    () => ({
      id: 'l10-reharm-lab',
      title: 'Reharmonization lab',
      listen: 'Switch devices on and off between plays — the melody never changes; the ground under it does.',
      homeKey: 'C',
      defaultTempo: 88,
      chords: buildReharmChords(toggles),
      textAlt:
        'An eight-bar original melody over a diatonic frame (C major 7, A minor 7, D minor 7, G7, C major 7, F, G7, C). Four toggles independently substitute A7 for A minor 7, D flat 7 for the mid-form G7, F minor 6 for F, and insert an E diminished seventh passing chord — in any combination.',
      analysis: [
        'Each device occupies its own slot, so the sixteen combinations are all coherent — that is a design decision, not luck. Reharmonization starts from the melody: every substitute here was chosen because the melody note above it remains a stable chord tone.',
        'Restraint is a device too: with everything switched on, the passage is busier but not automatically better. Chromatic harmony spends the listener\'s attention; budget it.',
      ],
    }),
    [toggles],
  )

  return (
    <MusicPanel spec={spec}>
      <div className="panel__custom" role="group" aria-label="Reharmonization devices">
        {DEVICES.map((device) => (
          <label key={device.key} className="field field--checkbox" title={device.describe}>
            <input
              type="checkbox"
              checked={toggles[device.key]}
              onChange={(e) => setToggles((prev) => ({ ...prev, [device.key]: e.target.checked }))}
            />
            <span>
              <strong>{device.label}</strong>
              <span className="reharm-describe"> — {device.describe}</span>
            </span>
          </label>
        ))}
      </div>
    </MusicPanel>
  )
}
