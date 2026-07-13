import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'

const diatonicLadder: ExampleSpec = {
  id: 'l2-ladder',
  title: 'The diatonic seventh-chord ladder',
  listen: 'Hear how each chord leans somewhere: some feel like home, some like a doorway, some like a raised eyebrow.',
  homeKey: 'C',
  defaultTempo: 88,
  textAlt:
    'The seven diatonic seventh chords of a major key played in order up the scale — C major 7, D minor 7, E minor 7, F major 7, G7, A minor 7, B minor 7 flat 5 — closing back on C major 7.',
  chords: [
    ch({ beats: 2, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic', bass: 'C2', treble: 'E3 G3 B3', jtreble: 'E3 B3', jbass: 'C2' }),
    ch({ beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant', bass: 'D2', treble: 'F3 A3 C4', jtreble: 'F3 C4', jbass: 'D2' }),
    ch({ beats: 2, sym: ['E', 'm7'], roman: 'iii7', func: 'tonic substitute', bass: 'E2', treble: 'G3 B3 D4', jtreble: 'G3 D4', jbass: 'E2' }),
    ch({ beats: 2, sym: ['F', 'maj7'], roman: 'IVmaj7', func: 'predominant', bass: 'F2', treble: 'A3 C4 E4', jtreble: 'A3 E4', jbass: 'F2' }),
    ch({ beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant', bass: 'G2', treble: 'B3 D4 F4', jtreble: 'B3 F4', jbass: 'G2', note: 'The only diatonic chord with a tritone (B–F) — that is what makes it the engine of the key.' }),
    ch({ beats: 2, sym: ['A', 'm7'], roman: 'vi7', func: 'tonic substitute', bass: 'A2', treble: 'C4 E4 G4', jtreble: 'C4 G4', jbass: 'A2' }),
    ch({ beats: 2, sym: ['B', 'm7b5'], roman: 'viiø7', func: 'dominant (fragile)', bass: 'B2', treble: 'D4 F4 A4', jtreble: 'D4 F4 A4', jbass: 'B2', note: 'Half-diminished: a minor seventh chord with a flatted 5th. It shares three notes with G7 and usually behaves like dominant function without the root.' }),
    ch({ beats: 2, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic', bass: 'C3', treble: 'E4 G4 B4', jtreble: 'E4 B4', jbass: 'C3' }),
  ],
  analysis: [
    'One key signature, seven chords, three broad jobs. Tonic (I, and more loosely iii and vi) is rest. Predominant (ii, IV) is departure. Dominant (V7, and viiø7 as its rootless shadow) is the pull home, powered by the tritone between the 4th and 7th scale degrees.',
  ],
}

const oneSixTwoFive: ExampleSpec = {
  id: 'l2-1625',
  title: 'I–vi–ii–V–I: the turnaround',
  listen: 'Feel the loop: rest, soft shadow, departure, pull, rest — then flip to Jazz voicing and hear the same loop glide.',
  homeKey: 'C',
  defaultTempo: 92,
  textAlt:
    'C major 7 to A minor 7 in bar one, D minor 7 to G7 in bar two, resolving to C major 7. Clear voicing stacks each chord; jazz voicing uses rootless right-hand shapes with added 9ths and 13ths over single bass notes.',
  chords: [
    ch({
      beats: 2, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C2 G2', treble: 'E3 G3 B3',
      jbass: 'C2', jtreble: 'E3 G3 B3 D4',
      note: 'Jazz voicing adds the 9th (D) — a standard diatonic enrichment that does not change the chord symbol.',
    }),
    ch({
      beats: 2, sym: ['A', 'm7'], roman: 'vi7', func: 'tonic substitute',
      bass: 'A2 E3', treble: 'G3 C4 E4',
      jbass: 'A2', jtreble: 'G3 B3 C4 E4',
      note: 'Shares two notes with Cmaj7 — the ground barely moves. Jazz voicing adds the 9th (B).',
    }),
    ch({
      beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant',
      bass: 'D2 A2', treble: 'F3 A3 C4',
      jbass: 'D2', jtreble: 'F3 A3 C4 E4',
      emph: 'F3 C4',
      note: 'The classic rootless shape: 3–5–7–9 (F–A–C–E). The bass supplies D.',
    }),
    ch({
      beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
      bass: 'G2 D3', treble: 'F3 B3 D4',
      jbass: 'G2', jtreble: 'F3 A3 B3 E4',
      emph: 'F3 B3',
      note: 'Rootless 7–9–3–13 (F–A–B–E). From Dm: only C moved, down a half step to B.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C2 G2', treble: 'E3 G3 B3',
      jbass: 'C2', jtreble: 'E3 G3 B3 D4',
      emph: 'E3 B3',
    }),
  ],
  analysis: [
    'Functional analysis is one useful lens, not the only one. Hearing Am7 as “tonic substitute” explains why bar 1 feels static; but you can also just hear a bass line walking C–A–D–G–C in falling fifths and thirds. Both descriptions are true; use whichever one helps you play.',
    'In the jazz voicings, watch how little the right hand travels: Dm7 and G7 differ by one semitone (C→B). That economy is the whole craft of comping.',
  ],
}

export function Lesson02() {
  return (
    <>
      <div className="prose">
        <h3>Seven chords, one family</h3>
        <p>
          Stack every other scale note on each degree of C major and you get the seven
          diatonic seventh chords. They share one accidental-free gene pool, which is why any
          path through them sounds coherent — but they are not interchangeable. Each has a
          gravitational job.
        </p>
        <h3>Tonic, predominant, dominant</h3>
        <p>
          <strong>Tonic</strong> function (Imaj7, with vi7 and iii7 as softer stand-ins) is
          arrival. <strong>Predominant</strong> function (ii7, IVmaj7) leans away from home,
          setting up motion. <strong>Dominant</strong> function (V7, with viiø7 as its
          rootless cousin) contains the key's only tritone — the 4th and 7th degrees, F and B
          in C major — and that tritone wants to close: F slides to E, B rises to C.
        </p>
        <h3>The progressions that run the music</h3>
        <p>
          The <strong>ii–V–I</strong> is jazz's basic sentence: departure, pull, arrival. Put
          a vi in front — <strong>I–vi–ii–V</strong> — and it becomes a loop you can cycle
          endlessly, which is exactly what tunes do at turnarounds. Learn the sound in every
          key; the theory labels are just a memory aid for what your ear already tracks.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={diatonicLadder} />
        <MusicPanel spec={oneSixTwoFive} />
        <ChoiceExercise
          title="Name the function"
          prompt={
            <>
              In the turnaround example, listen to the second bar's first chord (Dm7 in C).
              What functional job is it doing?
            </>
          }
          hint="Ask where the music is in its sentence: at rest, leaving home, or pulling toward home?"
          explanation={
            <p>
              Dm7 is the <strong>predominant</strong>: it moves the music away from tonic and
              hands off to G7, whose tritone does the pulling. It shares two notes (F, A)
              with the other predominant, IVmaj7 — the two chords are close cousins, and many
              tunes swap one for the other.
            </p>
          }
          options={[
            { id: 'pd', label: 'Predominant — sets up the dominant', correct: true, why: 'Yes. ii7 is the classic departure chord; its whole purpose is to make G7 inevitable.' },
            { id: 'd', label: 'Dominant — it pulls to C', why: 'The pull to C comes from G7 and its B–F tritone. Dm7 has no tritone; it prepares rather than resolves.' },
            { id: 't', label: 'Tonic — it feels like home', why: 'Home is Cmaj7 (with Am7 as a shadow). Dm7 clearly leans forward — play it and stop: the music feels unfinished.' },
            { id: 'pass', label: 'A passing chord with no function', why: 'It is doing real work: in a ii–V–I the ii is the departure half of the cadence, not filler.' },
          ]}
          listen={{ label: 'Hear Dm7 → G7 → Cmaj7', midis: [38, 53, 57, 60, 64] }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          Hear every diatonic chord as tonic, predominant, or dominant before you worry about
          anything chromatic. When a progression confuses you, find the tritone — if there
          isn't one, nothing is pulling yet.
        </Takeaway>
        <SourceChips ids={['terefenko', 'levine-theory']} />
      </div>
    </>
  )
}
