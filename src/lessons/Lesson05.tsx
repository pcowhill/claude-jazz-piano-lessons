import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'

export const subCompare: ExampleSpec = {
  id: 'l5-sub-compare',
  title: 'Same cadence, two dominants: G7 vs. D♭7',
  listen: 'Switch versions mid-listen: the harmonic pull barely changes, but the bass line trades a leap for a chromatic slide.',
  homeKey: 'C',
  defaultTempo: 76,
  textAlt:
    'Two versions of a cadence to C major 7. Version one: D minor 7, G7, C major 7. Version two: D minor 7, D flat 7, C major 7. The highlighted guide tones F and B (spelled C flat in D flat 7) are the same sounding pair in both dominants.',
  variants: [
    {
      id: 'v7',
      label: 'V7 (G7)',
      chords: [
        ch({
          beats: 4, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant',
          bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4 E4',
        }),
        ch({
          beats: 4, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 B3 E4',
          emph: 'F3 B3',
          note: 'The engine: tritone F–B. F wants E; B wants C.',
        }),
        ch({
          beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
          bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3 D4',
          emph: 'E3 B3',
        }),
      ],
    },
    {
      id: 'subv7',
      label: 'subV7 (D♭7)',
      analysis: [
        'D♭7 is spelled D♭–F–A♭–C♭. Its guide tones F and C♭ are, as sounding pitches, the same pair as G7\'s F and B — one tritone, two owners. What changes is the bass: D→D♭→C, a chromatic slide instead of the fifth-fall D→G→C.',
      ],
      chords: [
        ch({
          beats: 4, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant',
          bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4 E4',
        }),
        ch({
          beats: 4, sym: ['Db', '7'], roman: 'subV7/I', func: 'substitute dominant',
          bass: 'Db3', treble: 'F3 Ab3 Cb4', jbass: 'Db3', jtreble: 'F3 Cb4 Eb4',
          emph: 'F3 Cb4',
          note: 'Same tritone, respelled: C♭ sounds as B in equal temperament. Many charts write this chord\'s function as ♭II7; “subV7/I” names the same idea from the substitution side.',
        }),
        ch({
          beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
          bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3 D4',
          emph: 'E3 B3',
          note: 'F still falls to E. C♭, already sounding the leading tone, is respelled B and simply stays.',
        }),
      ],
    },
  ],
  analysis: [
    'The substitution works because of what the two chords share — the tritone that does the resolving — and because of what improves: chromatic bass motion into the tonic. It is not merely that “they use the same notes”; D♭7 and G7 differ in root, 5th, and 9th. They share exactly the two notes that matter.',
  ],
}

export const chromaticDescent: ExampleSpec = {
  id: 'l5-descent',
  title: 'Original vs. substituted: a longer progression',
  listen: 'Version two replaces every secondary dominant with its tritone twin — listen to the bass melt into a chromatic descent.',
  homeKey: 'C',
  defaultTempo: 88,
  textAlt:
    'An eight-bar progression. Original: C major 7, A7, D minor 7, G7, E minor 7, A7, D minor 7 to G7, C major 7. Substituted: the A7 chords become E flat 7 and the G7 chords become D flat 7, producing a chromatic bass descent E, E flat, D, D flat, C.',
  variants: [
    {
      id: 'orig',
      label: 'Original dominants',
      chords: [
        ch({ beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic', bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3' }),
        ch({
          beats: 4, sym: ['A', '7'], roman: 'V7/ii', func: 'secondary dominant',
          bass: 'A2', treble: 'G3 C#4 E4', jbass: 'A2', jtreble: 'G3 C#4',
          emph: 'G3 C#4', note: 'Guide tones C♯–G: a tritone aimed at D.',
        }),
        ch({ beats: 4, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant', bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4' }),
        ch({
          beats: 4, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 B3',
          emph: 'F3 B3',
        }),
        ch({ beats: 4, sym: ['E', 'm7'], roman: 'iii7', func: 'tonic substitute', bass: 'E3', treble: 'G3 B3 D4', jbass: 'E3', jtreble: 'G3 D4' }),
        ch({
          beats: 4, sym: ['A', '7'], roman: 'V7/ii', func: 'secondary dominant',
          bass: 'A2', treble: 'G3 C#4 E4', jbass: 'A2', jtreble: 'G3 C#4',
        }),
        ch({ beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant', bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4' }),
        ch({ beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant', bass: 'G2', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 B3' }),
        ch({ beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic', bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3 D4' }),
      ],
    },
    {
      id: 'subs',
      label: 'Tritone substitutes',
      analysis: [
        'Bass line, substituted version: C … E♭–D–D♭ … E–E♭–D–D♭–C. Every dominant now approaches its target from a half step above. The guide-tone pairs are sounding-identical to the originals: E♭7 shares G and D♭ (=C♯) with A7; D♭7 shares F and C♭ (=B) with G7.',
      ],
      chords: [
        ch({ beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic', bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3' }),
        ch({
          beats: 4, sym: ['Eb', '7'], roman: 'subV7/ii', func: 'substitute dominant',
          bass: 'Eb3', treble: 'G3 Bb3 Db4', jbass: 'Eb3', jtreble: 'G3 Db4',
          emph: 'G3 Db4', note: 'A7\'s tritone C♯–G reappears spelled D♭–G; the root moves to E♭ so the bass can fall a half step onto D.',
        }),
        ch({ beats: 4, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant', bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4' }),
        ch({
          beats: 4, sym: ['Db', '7'], roman: 'subV7/I', func: 'substitute dominant',
          bass: 'Db3', treble: 'F3 Ab3 Cb4', jbass: 'Db3', jtreble: 'F3 Cb4',
          emph: 'F3 Cb4',
        }),
        ch({ beats: 4, sym: ['E', 'm7'], roman: 'iii7', func: 'tonic substitute', bass: 'E3', treble: 'G3 B3 D4', jbass: 'E3', jtreble: 'G3 D4' }),
        ch({
          beats: 4, sym: ['Eb', '7'], roman: 'subV7/ii', func: 'substitute dominant',
          bass: 'Eb3', treble: 'G3 Bb3 Db4', jbass: 'Eb3', jtreble: 'G3 Db4',
        }),
        ch({ beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant', bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4' }),
        ch({ beats: 2, sym: ['Db', '7'], roman: 'subV7/I', func: 'substitute dominant', bass: 'Db3', treble: 'F3 Ab3 Cb4', jbass: 'Db3', jtreble: 'F3 Cb4', emph: 'F3 Cb4' }),
        ch({ beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic', bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3 D4' }),
      ],
    },
  ],
  analysis: [
    'A related but distinct idea: dominants with a ♭9 share a diminished upper structure, which creates its own web of substitutions (Lesson 8). Tritone substitution proper is the two-chords-one-tritone relationship you hear in this example — keep the two mechanisms separate in your thinking, then enjoy how often they overlap in practice.',
  ],
}

export function Lesson05() {
  return (
    <>
      <div className="prose">
        <h3>One tritone, two owners</h3>
        <p>
          Inside G7 the work is done by two notes: B and F, a tritone apart. Spell that same
          sounding pair as C♭ and F and you have the guide tones of D♭7. Every tritone lives
          in exactly two dominant seventh chords, whose roots sit — no coincidence — a
          tritone apart. So wherever G7 could resolve to C, D♭7 can offer the same handshake
          from the other side.
        </p>
        <h3>What actually improves</h3>
        <p>
          The substitution isn't a party trick; it upgrades the bass. Root motion down a
          fifth (D–G–C) becomes a chromatic slide (D–D♭–C), and approach-from-a-half-step is
          one of the strongest gestures a bass line has. Label the chord <code>♭II7</code>
          when you think of it as a scale-degree ("the dominant living on the flat second"),
          or <code>subV7/I</code> when you think of it as standing in for V7 — both names
          describe the same sound, and both are in common use.
        </p>
        <h3>Respelling is part of the deal</h3>
        <p>
          D♭7's seventh is C♭ — the note your ear hears as B. Writing C♭ keeps the chord
          spelled as a dominant seventh (root, 3rd, 5th, ♭7); the Analyze panel notes the
          equal-tempered equivalence. When the resolution comes, the "new" note turns out to
          have been the leading tone all along, just wearing different clothes.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={subCompare} />
        <MusicPanel spec={chromaticDescent} />
        <ChoiceExercise
          title="The shared pair"
          prompt={
            <>
              G7 and D♭7 can both resolve to C. As sounding pitches, which two notes do the
              two chords share?
            </>
          }
          hint="Find each chord's 3rd and 7th, then compare the sounds, not the spellings."
          explanation={
            <p>
              Both chords contain the sounding pair <strong>F and B</strong> — in G7 as ♭7
              and 3rd, in D♭7 as 3rd and ♭7 (spelled C♭). The roles swap but the tritone is
              the same physical object, and it resolves the same way: F→E, B→C. That shared
              engine, plus the chromatic bass D♭→C, is the whole theory of the substitution.
            </p>
          }
          options={[
            { id: 'bf', label: 'B (=C♭) and F', correct: true, why: 'Exactly — each chord\'s 3rd is the other\'s ♭7. One tritone, two owners.' },
            { id: 'gdb', label: 'G and D♭', why: 'Those are the two roots — a tritone apart from each other, but not shared between the chords.' },
            { id: 'dab', label: 'D and A♭', why: 'D is G7\'s 5th and A♭ is D♭7\'s 5th; neither appears in the other chord.' },
            { id: 'ebb', label: 'E and B♭', why: 'Neither chord contains E or B♭ — E is where F resolves, in the C chord that follows.' },
          ]}
          listen={{
            label: 'Hear G7, then D♭7, then C',
            sequence: [
              [43, 53, 59, 62], // G7: G2 F3 B3 D4
              [49, 53, 56, 59], // D♭7: D♭3 F3 A♭3 C♭4
              [48, 52, 55, 59], // Cmaj7: C3 E3 G3 B3
            ],
          }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          To substitute any dominant: keep its 3rd and 7th where they are, move the root a
          tritone, and let the bass approach the target from a half step above. If the
          melody note survives over the new chord, the substitution is usually yours.
        </Takeaway>
        <SourceChips ids={['levine-theory', 'berklee-harmony']} />
      </div>
    </>
  )
}
