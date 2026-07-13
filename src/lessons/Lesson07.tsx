import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'

export const cToEflat: ExampleSpec = {
  id: 'l7-c-to-eb',
  title: 'Sliding from C toward E♭: Fm6 → B♭7(♭9) → E♭',
  listen: 'Three of the four voices never move at the pivot — only C slips down to C♭, and suddenly the music is facing a new tonic.',
  homeKey: 'C',
  defaultTempo: 66,
  textAlt:
    'C major 7, then F minor 6 (F, A flat, C, D), then B flat 7 flat 9 (B flat, D, F, A flat, C flat), resolving to E flat major. D, F, and A flat are common tones across the pivot; C moves to C flat, which sounds as B.',
  chords: [
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7 (C)', func: 'tonic, in C',
      bass: 'C2 G2', treble: 'E3 G3 B3', jbass: 'C2', jtreble: 'E3 B3 D4',
    }),
    ch({
      beats: 4, sym: ['F', 'm6'], roman: 'iv6 (C) — pivot', func: 'pivot chord',
      bass: 'F2', treble: 'F3 Ab3 C4 D4', jbass: 'F2', jtreble: 'Ab3 C4 D4 G4',
      note: 'F–A♭–C–D. Heard from C, this is the borrowed iv6 sigh from Lesson 6. But the same four pitch classes spell Dm7(♭5) — the ii chord of E♭\'s minor-inflected cadence. Both hearings are true; neither label exhausts the sound.',
    }),
    ch({
      beats: 4, sym: ['Bb', '7b9'], roman: 'V7(♭9) of E♭', func: 'dominant of the new key',
      bass: 'Bb2', treble: 'F3 Ab3 Cb4 D4', jbass: 'Bb2', jtreble: 'Ab3 Cb4 D4 F4',
      emph: 'Cb4',
      note: 'B♭–D–F–A♭–C♭. From Fm6, three voices hold (D, F, A♭ are common tones) and one moves: C → C♭. That C♭ sounds as B in equal temperament — the strict ♭9 spelling above B♭.',
    }),
    ch({
      beats: 4, sym: ['Eb', 'maj'], roman: 'I (E♭) — ♭III of C', func: 'new tonic',
      bass: 'Eb2 Bb2', treble: 'G3 Bb3 Eb4', jbass: 'Eb2', jtreble: 'Bb3 Eb4 G4',
      note: 'The dominant discharges: A♭→G, C♭→B♭, D→E♭, F→G. Four half- and whole-step motions, and E♭ feels inevitable.',
    }),
  ],
  analysis: [
    'Watch the pivot arithmetic. Fm6 = F–A♭–C–D. B♭7(♭9) = B♭–D–F–A♭–C♭. Common tones: D, F, A♭ — three anchors that let the ear accept the turn. The only melodic event is C→C♭, a semitone.',
    'C♭ vs. B: as sounding pitches in equal temperament they are the same key on the piano. The spelling C♭ says what the note means here — the ♭9 of B♭7, resolving down to B♭ — while “B” would wrongly suggest a leading tone pulling up to C. Spelling is analysis.',
    'Is Fm6 “really” iv6 of C or ii-material of E♭? The honest answer is both in sequence: it arrives meaning one thing and leaves meaning another. Pivot chords are exactly the chords that support two readings at once.',
  ],
}

export const touristVsMover: ExampleSpec = {
  id: 'l7-tourist',
  title: 'Tonicization vs. modulation: a visit and a move',
  listen: 'Version one glances at ii and comes home; version two cadences into F twice and unpacks its bags.',
  homeKey: 'C',
  defaultTempo: 88,
  textAlt:
    'Two versions. Brief tonicization: C major 7, A7, D minor 7, G7, C major 7 — the A7 briefly tonicizes D minor before the music returns home. Modulation: C major 7, then G minor 7 to C7, F major 7, repeated, ending on F major 7 — two full cadences establish F as a new tonic.',
  variants: [
    {
      id: 'visit',
      label: 'Brief tonicization',
      chords: [
        ch({ beats: 2, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic (C)', bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3' }),
        ch({
          beats: 2, sym: ['A', '7'], roman: 'V7/ii', func: 'secondary dominant',
          bass: 'A2', treble: 'G3 C#4 E4', jbass: 'A2', jtreble: 'G3 C#4',
          emph: 'C#4', note: 'C♯ glances at D minor…',
        }),
        ch({ beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'tonicized, briefly', bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4', note: '…and D minor immediately reverts to its day job: predominant of C.' }),
        ch({ beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant', bass: 'G2', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 B3' }),
        ch({ beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic (C)', bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3 D4' }),
      ],
    },
    {
      id: 'move',
      label: 'Modulation to F',
      analysis: [
        'What makes it a modulation: the new key is confirmed, not just visited. Two ii–V–I cadences into F, the B♭ that erases C major\'s leading-tone claim on B, and — crucially — time. The longer F behaves like home, the more your ear re-files every chord relative to F.',
      ],
      chords: [
        ch({ beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7 (C) → V-ish of F', func: 'pivot region', bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3', note: 'In retrospect this chord is already ambiguous: C is F\'s dominant degree.' }),
        ch({ beats: 2, sym: ['G', 'm7'], roman: 'ii7 (F)', func: 'predominant of F', bass: 'G2', treble: 'Bb3 D4 F4', jbass: 'G2', jtreble: 'Bb3 F4', emph: 'Bb3', note: 'B♭ is the moment C major\'s grip breaks.' }),
        ch({ beats: 2, sym: ['C', '7'], roman: 'V7 (F)', func: 'dominant of F', bass: 'C3', treble: 'Bb3 E4 G4', jbass: 'C3', jtreble: 'Bb3 E4' }),
        ch({ beats: 4, sym: ['F', 'maj7'], roman: 'Imaj7 (F)', func: 'new tonic', bass: 'F2', treble: 'A3 C4 E4', jbass: 'F2', jtreble: 'A3 E4' }),
        ch({ beats: 2, sym: ['G', 'm7'], roman: 'ii7 (F)', func: 'predominant of F', bass: 'G2', treble: 'Bb3 D4 F4', jbass: 'G2', jtreble: 'Bb3 F4' }),
        ch({ beats: 2, sym: ['C', '7'], roman: 'V7 (F)', func: 'dominant of F', bass: 'C3', treble: 'Bb3 E4 G4', jbass: 'C3', jtreble: 'Bb3 E4' }),
        ch({ beats: 4, sym: ['F', 'maj7'], roman: 'Imaj7 (F)', func: 'confirmed tonic', bass: 'F2', treble: 'A3 C4 E4', jbass: 'F2', jtreble: 'A3 C4 E4 G4', note: 'Second confirmation. The move is complete; C major is now a memory.' }),
      ],
    },
  ],
  analysis: [
    'Same raw materials — dominants and their targets — different commitments. Tonicization: one borrowed dominant, immediate return. Modulation: pivot, cadence, confirmation, residence.',
  ],
}

export function Lesson07() {
  return (
    <>
      <div className="prose">
        <h3>A visit or a move</h3>
        <p>
          Tonicization and modulation sit on one slider, and the knob is
          <strong> commitment</strong>. A secondary dominant tonicizes: its target sounds
          like home for a beat, then normal service resumes. Modulation happens when the
          music cadences into the new tonic, repeats the gesture or lingers, and starts
          treating the old key as foreign. There is no bright line — analysts disagree about
          borderline passages, which is itself worth knowing.
        </p>
        <h3>Pivot chords: double agents</h3>
        <p>
          The smoothest moves travel through a chord both keys can claim. Fm6 in C is the
          borrowed iv6; respell its pitch content (F–A♭–C–D = D–F–A♭–C) and it is
          half-diminished ii-material for an E♭ cadence. A pivot doesn't announce the turn —
          it lets the music finish the turn before you notice it began. Direct modulation,
          by contrast, simply jumps and lets the new cadence explain itself.
        </p>
        <h3>Common tones do the driving</h3>
        <p>
          The first example moves from C toward E♭ while holding three of four voices still.
          Gradual reinterpretation — keep most pitches, re-aim one — is how short passages
          drift convincingly between keys without any dramatic gear-change.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={cToEflat} />
        <MusicPanel spec={touristVsMover} />
        <ChoiceExercise
          title="Visit or move?"
          prompt={
            <>
              Play the <em>Modulation to F</em> version. After the final chord: which key is
              home, and what is the evidence?
            </>
          }
          hint="Count the cadences into the candidate key, and notice which accidental keeps recurring."
          explanation={
            <p>
              <strong>F major</strong> is home: two complete ii–V–I cadences (Gm7–C7–Fmaj7)
              land there, the recurring B♭ dissolves C major's leading-tone claim, and the
              music grants F the last word — twice. In the other version, D minor got one
              borrowed dominant and no confirmation: a visit, not a move.
            </p>
          }
          options={[
            { id: 'f', label: 'F major — confirmed by repeated cadence', correct: true, why: 'Two ii–V–Is into F plus the persistent B♭ re-file every chord relative to F.' },
            { id: 'c', label: 'C major — the opening key always remains home', why: 'Keys are not squatters\' rights. Once F is cadenced into and confirmed, C major is history.' },
            { id: 'dm', label: 'D minor', why: 'Nothing cadences into D minor in this version — no A7, no C♯ anywhere.' },
            { id: 'bb', label: 'B♭ major', why: 'B♭ appears as a scale tone of F (its 4th degree), never as a tonic with its own cadence.' },
          ]}
          listen={{
            label: 'Hear the two cadences into F',
            sequence: [
              [43, 58, 62, 65], // Gm7
              [48, 58, 64, 67], // C7
              [41, 57, 60, 64], // Fmaj7
            ],
          }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          To leave a key gracefully: find the chord both keys can claim, move one voice by a
          semitone, and let a full cadence — repeated if you mean it — do the paperwork.
          Spell the moving note for where it is going (C♭ falling to B♭), not where it came
          from.
        </Takeaway>
        <SourceChips ids={['terefenko', 'pease']} />
      </div>
    </>
  )
}
