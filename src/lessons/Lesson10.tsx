import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'
import { ReharmLab } from './ReharmLab'

const beforeAfter: ExampleSpec = {
  id: 'l10-before-after',
  title: 'One melody, before and after',
  listen: 'Learn the plain version first, then switch: every note of the tune survives the renovation.',
  homeKey: 'C',
  defaultTempo: 80,
  textAlt:
    'A five-bar original melody. Plain version: C, F, C over G with G7, G7, C. Reharmonized version: C major 7 to A7, D minor 7 to F minor 6, C over E to D7 over F sharp, G7 to D flat 7, ending on C6 — same melody throughout.',
  variants: [
    {
      id: 'plain',
      label: 'Plain diatonic',
      chords: [
        ch({
          beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
          bass: 'C2 G2', treble: 'E3 G3 C4', jbass: 'C2', jtreble: 'E3 G3 C4',
          mel: [['E4', 2], ['G4', 2]],
        }),
        ch({
          beats: 4, sym: ['F', 'maj'], roman: 'IV', func: 'predominant',
          bass: 'F2', treble: 'F3 A3 C4', jbass: 'F2 C3', jtreble: 'A3 C4',
          mel: [['A4', 2], ['F4', 2]],
        }),
        ch({
          beats: 2, sym: ['C', 'maj', 'E'], roman: 'I⁶', func: 'tonic',
          bass: 'E3', treble: 'G3 C4', jbass: 'E3', jtreble: 'G3 C4',
          mel: [['E4', 2]],
        }),
        ch({
          beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2 D3', treble: 'F3 B3', jbass: 'G2', jtreble: 'F3 B3',
          mel: [['D4', 2]],
        }),
        ch({
          beats: 2, sym: null, roman: undefined, func: 'dominant',
          bass: 'G2 D3', treble: 'F3 B3', jbass: 'G2', jtreble: 'F3 B3',
          mel: [['D4', 2]],
        }),
        ch({
          beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2 B2', treble: 'D4 F3', jbass: 'G2', jtreble: 'F3 D4',
          mel: [['B3', 2]],
          note: 'The chord re-voices under the melody\'s B so no unison collision blurs the line.',
        }),
        ch({
          beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
          bass: 'C2 G2', treble: 'E3 G3', jbass: 'C2', jtreble: 'E3 G3',
          mel: [['C4', 4]],
        }),
      ],
    },
    {
      id: 'reharm',
      label: 'Reharmonized',
      analysis: [
        'The renovation, device by device: A7 (V/ii) borrowed to push into bar 2; the borrowed iv6 (Fm6) darkening the same bar\'s second half; a chromatic bass walk E–F♯–G through C/E and D7/F♯ (V/V); a tritone substitute D♭7 whose 7th is the melody\'s own B respelled (C♭); and a 6th-chord tonic to close. Every device earns its place by how the melody sits on it.',
      ],
      chords: [
        ch({
          beats: 2, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
          bass: 'C2 G2', treble: 'E3 G3 B3', jbass: 'C2', jtreble: 'E3 B3 D4',
          mel: [['E4', 2]],
        }),
        ch({
          beats: 2, sym: ['A', '7'], roman: 'V7/ii', func: 'secondary dominant',
          bass: 'A2', treble: 'G3 C#4 E4', jbass: 'A2', jtreble: 'G3 C#4',
          mel: [['G4', 2]],
          emph: 'C#4',
          note: 'Melody G becomes A7\'s ♭7 — the borrowed dominant hides in plain sight under a diatonic melody note.',
        }),
        ch({
          beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant',
          bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 C4',
          mel: [['A4', 2]],
        }),
        ch({
          beats: 2, sym: ['F', 'm6'], roman: 'iv6', func: 'borrowed',
          bass: 'F2', treble: 'Ab3 C4 D4', jbass: 'F2', jtreble: 'Ab3 C4 D4',
          mel: [['F4', 2]],
          emph: 'Ab3',
          note: 'The melody F is Fm6\'s root; A♭ sighs beneath it.',
        }),
        ch({
          beats: 2, sym: ['C', 'maj', 'E'], roman: 'I⁶', func: 'tonic',
          bass: 'E3', treble: 'G3 C4', jbass: 'E3', jtreble: 'G3 C4',
          mel: [['E4', 2]],
        }),
        ch({
          beats: 2, sym: ['D', '7', 'F#'], roman: 'V7/V', func: 'secondary dominant',
          bass: 'F#2', treble: 'A3 C4', jbass: 'F#2', jtreble: 'A3 C4 E4',
          mel: [['D4', 2]],
          emph: 'F#2',
          note: 'The melody D is the chord\'s root; F♯ walks the bass from E up toward G. The voicing leaves D to the melody.',
        }),
        ch({
          beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 B3',
          mel: [['D4', 2]],
        }),
        ch({
          beats: 2, sym: ['Db', '7'], roman: 'subV7/I', func: 'substitute dominant',
          bass: 'Db3', treble: 'F3 Ab3', jbass: 'Db3', jtreble: 'F3 Ab3',
          mel: [['B3', 2]],
          note: 'The melody\'s B is, over D♭7, the chord\'s ♭7 — properly spelled C♭, sounding the same key. The voicing omits that tone and lets the melody supply it.',
        }),
        ch({
          beats: 4, sym: ['C', '6'], roman: 'I6', func: 'tonic',
          bass: 'C2 G2', treble: 'E3 G3 A3', jbass: 'C2', jtreble: 'E3 G3 A3 D4',
          mel: [['C4', 4]],
          note: 'A sixth-chord tonic (with 9 added in the jazz voicing): color without an unresolved leading tone.',
        }),
      ],
    },
  ],
  analysis: [
    'Harmonic rhythm is part of the reharmonization: the plain version changes chords by the bar; the renovation moves in half-bars, doubling the sense of motion under the identical tune. Speeding up the harmony is as audible a choice as any substitute chord.',
  ],
}

export function Lesson10() {
  return (
    <>
      <div className="prose">
        <h3>The melody is the client</h3>
        <p>
          Reharmonization is renovation with a tenant in the building: the melody keeps
          living there, so every wall you move must leave its notes supported. The practical
          test for any substitute chord is one question — <em>what does the melody note
          become over it?</em> If the answer is a stable chord tone or a color you can name
          and love (a 9th, a 13th), proceed. If the answer is an accidental ♭9 clash, pick
          another wall.
        </p>
        <h3>The toolkit, assembled</h3>
        <p>
          Everything from the previous lessons is now one kit: <strong>guide tones</strong>
          steer voice leading; <strong>secondary dominants</strong> add push;
          <strong> tritone substitutes</strong> turn bass leaps into chromatic slides;
          <strong> borrowed chords</strong> darken; <strong>passing diminished</strong> chords
          fill stepwise gaps; and <strong>bass-line design</strong> plus
          <strong> harmonic rhythm</strong> decide how all of it breathes. The lab below lets
          you audition each device separately over one melody — the fastest way to learn what
          each one actually contributes.
        </p>
        <h3>The discipline of leaving it alone</h3>
        <p>
          Chromatic harmony is a spending decision. A device you <em>can</em> apply is not a
          device you <em>should</em> apply; each one draws attention, and a passage where
          everything is clever has no place left to point. Reharmonize toward a purpose —
          a darker second phrase, a smoother bass, a fresher cadence — and let at least one
          phrase stay plain so the renovation reads.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={beforeAfter} />
        <ReharmLab />
        <ChoiceExercise
          title="Serve the melody"
          prompt={
            <>
              In the lab, bar 4 holds the melody note F over the dominant. Which substitute
              keeps that F a stable <em>chord tone</em> rather than a tension?
            </>
          }
          hint="Spell each candidate chord and look for F inside it — as a 3rd, 5th, or 7th."
          explanation={
            <p>
              <strong>D♭7</strong>: its 3rd is F, so the held melody note becomes more
              consonant, not less, while the bass gains the chromatic D–D♭–C slide. E7 would
              make F a ♭9 (a real color, but a tense one to hang a held note on); A♭7 makes
              F a 13 — usable, but a floating extension rather than an anchor; B7 turns F
              into a ♯11-type tension with no anchor at all. The melody chooses the winner.
            </p>
          }
          options={[
            { id: 'db7', label: 'D♭7 — F is its 3rd', correct: true, why: 'D♭–F–A♭–C♭: the melody lands on the guide tone itself. Strong and smooth.' },
            { id: 'e7', label: 'E7 — F would be its ♭9', why: 'True but tense: a held melody ♭9 is a bold effect, not a stable support.' },
            { id: 'ab7', label: 'A♭7 — F is its 13', why: 'F does work over A♭7 as a 13th, but as a floating color, not the anchored chord tone the held note wants.' },
            { id: 'b7', label: 'B7 — F fits as a ♯11-ish tension', why: 'F over B7 is an altered-tension sound (E♯/♯11 territory) — the least support of the four for a long note.' },
          ]}
          listen={{ label: 'Hear D♭7 under melody F', midis: [49, 53, 56, 65] }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          Reharmonize in this order: melody note jobs first, bass line second, chord symbols
          last. Add one device at a time, play it against the plain version, and keep only
          what you can defend out loud in one sentence.
        </Takeaway>
        <SourceChips ids={['pease', 'berklee-harmony', 'levine-theory']} />
      </div>
    </>
  )
}
