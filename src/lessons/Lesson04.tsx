import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'

const walkUp: ExampleSpec = {
  id: 'l4-walkup',
  title: 'The borrowed dominant: C – G/B – Am – D7/F♯ – G – G7 – C',
  listen: 'Follow the bass: C, B, A, then F♯ pushing into G — the D7/F♯ borrows dominant urgency without ever leaving C for good.',
  homeKey: 'C',
  defaultTempo: 84,
  textAlt:
    'A four-bar phrase in C major: C, G over B, A minor, D7 over F sharp, G, G7, C. The bass walks down C–B–A, then F sharp leads up to G; D7 over F sharp is analyzed as five of five.',
  chords: [
    ch({
      beats: 2, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
      bass: 'C3', treble: 'E3 G3 C4', jbass: 'C3', jtreble: 'G3 C4 E4',
    }),
    ch({
      beats: 2, sym: ['G', 'maj', 'B'], roman: 'V⁶', func: 'dominant (passing)',
      bass: 'B2', treble: 'D3 G3 D4', jbass: 'B2', jtreble: 'G3 D4',
      note: 'First-inversion V: the bass B is just a polite step in the walk from C down to A.',
    }),
    ch({
      beats: 2, sym: ['A', 'm'], roman: 'vi', func: 'tonic substitute',
      bass: 'A2', treble: 'E3 A3 C4', jbass: 'A2', jtreble: 'E3 C4',
    }),
    ch({
      beats: 2, sym: ['D', '7', 'F#'], roman: 'V/V', func: 'secondary dominant',
      bass: 'F#2', treble: 'D3 A3 C4', jbass: 'F#2', jtreble: 'A3 C4 E4',
      emph: 'C4',
      note: 'D7 in first inversion. F♯ — foreign to C major — is the 3rd of D7 and a leading tone aimed at G. C natural, kept from the key, is D7\'s ♭7 and falls to B. Jazz voicing adds the 9th (E).',
    }),
    ch({
      beats: 2, sym: ['G', 'maj'], roman: 'V', func: 'dominant',
      bass: 'G2', treble: 'D3 G3 B3', jbass: 'G2', jtreble: 'B3 D4',
    }),
    ch({
      beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
      bass: 'G2', treble: 'D3 F3 B3', jbass: 'G2', jtreble: 'B3 F4',
      note: 'The added F re-arms the tritone (F–B) so the return to C lands with full weight.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
      bass: 'C3', treble: 'E3 G3 C4', jbass: 'C2 C3', jtreble: 'G3 C4 E4',
    }),
  ],
  analysis: [
    'D7 contains F♯ — not a C-major note. That one accidental turns a diatonic ii-family root (D) into a working dominant whose target is G: F♯ resolves up to G, C resolves down to B. Because the borrowed pull aims at the 5th degree, we label it V/V, “five of five.”',
    'This is tonicization, not modulation: G is treated as a momentary “home” for exactly one chord, then immediately re-cast as the plain V7 of C. The music never stops being in C.',
    'The inversion matters. Writing D7/F♯ puts the leading tone itself in the bass, so the bottom line sings C–B–A–F♯–G: two voices\' worth of direction from a single walking line.',
  ],
}

const chain: ExampleSpec = {
  id: 'l4-chain',
  title: 'A chain of dominants: V/vi → V/ii → ii–V–I',
  listen: 'Each dominant hands its resolution the baton; the jazz voicing strips everything to guide-tone rails so you hear the chromatic slide C→C♯→D.',
  homeKey: 'C',
  defaultTempo: 80,
  textAlt:
    'C major 7, E7 over G sharp resolving to A minor 7, then A7 resolving to D minor 7, then G7 to C major 7. Each seventh chord is the dominant of the chord that follows.',
  chords: [
    ch({
      beats: 2, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3',
    }),
    ch({
      beats: 2, sym: ['E', '7', 'G#'], roman: 'V/vi', func: 'secondary dominant',
      bass: 'G#2', treble: 'E3 B3 D4', jbass: 'G#2', jtreble: 'D4 E3',
      emph: 'D4',
      note: 'G♯ (the 3rd, in the bass) aims at A; D (the ♭7) will fall to C. Target: vi.',
    }),
    ch({
      beats: 2, sym: ['A', 'm7'], roman: 'vi7', func: 'resolution → pivot',
      bass: 'A2', treble: 'E3 G3 C4', jbass: 'A2', jtreble: 'G3 C4',
      note: 'Arrival — and immediately a springboard: raise its 3rd and it becomes the next dominant.',
    }),
    ch({
      beats: 2, sym: ['A', '7'], roman: 'V/ii', func: 'secondary dominant',
      bass: 'A2', treble: 'E3 G3 C#4', jbass: 'A2', jtreble: 'G3 C#4',
      emph: 'C#4',
      note: 'One semitone of change (C→C♯) converts vi7 into V/ii. That single raised third is the entire trick.',
    }),
    ch({
      beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant',
      bass: 'D3', treble: 'F3 A3 C4 D4', jbass: 'D3', jtreble: 'F3 C4',
      note: 'C♯ resolved up to D. The chain now feeds the ordinary cadence.',
    }),
    ch({
      beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
      bass: 'G2', treble: 'F3 B3 D4', jbass: 'G2', jtreble: 'F3 B3',
    }),
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 B3 D4',
    }),
  ],
  analysis: [
    'Any chord can be preceded by its own dominant. Chain two or three and you get the classic ragtime/rhythm-changes bridge logic: E7→A7→D7→G7 is nothing but V/vi → V/ii → V/V → V.',
    'What matters is the target, not the spotting. “Major triad plus minor 7th” describes G7, D7, and E7 equally; the analysis only becomes meaningful when you say where each one is pointed and hear the leading tone land.',
  ],
}

export function Lesson04() {
  return (
    <>
      <div className="prose">
        <h3>Renting dominant power</h3>
        <p>
          A key has one native dominant seventh. But any diatonic chord can be
          <em> tonicized</em> — treated as a momentary home — by borrowing a dominant seventh
          aimed straight at it. Write these borrowed chords as <code>V/x</code>: V/V points
          at the 5th degree, V/ii at the 2nd. The accidental that appears (F♯ in D7, C♯ in
          A7) is always the borrowed leading tone, and it tells you the target before you
          play a note.
        </p>
        <h3>Tonicize, don't move in</h3>
        <p>
          Tonicization is a glance; modulation is a move. One secondary dominant resolving
          into its target and straight back into diatonic traffic never threatens the key.
          (Lesson 7 handles what happens when the glance lingers.)
        </p>
        <h3>Why the bass loves them</h3>
        <p>
          Secondary dominants earn their keep in the bass. Inverted, they turn root motion
          into chromatic walking lines — C–B–A–F♯–G in the first example — and the ear
          forgives almost any harmony whose bottom line sings this well. The chord matters
          less than where its leading tone is pointed and which voice gets to carry it.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={walkUp} />
        <MusicPanel spec={chain} />
        <ChoiceExercise
          title="Where is it pointed?"
          prompt={
            <>
              In the walk-up example, the fourth chord is D7/F♯. Which chord is it the
              dominant <em>of</em>?
            </>
          }
          hint="Find the borrowed leading tone (the accidental) and let it resolve up a half step."
          explanation={
            <p>
              D7's third is F♯, a half step below <strong>G</strong> — so D7 is V/V, the
              dominant of the dominant. Hear it: F♯ rises to G, C falls to B, and the G
              chord arrives feeling briefly like home before G7 re-aims everything at C.
            </p>
          }
          options={[
            { id: 'g', label: 'G — it is V/V', correct: true, why: 'F♯ is the leading tone of G; D7 resolves there by half step, then G is re-heard as C\'s dominant.' },
            { id: 'c', label: 'C — it strengthens the tonic directly', why: 'D7 contains F♯ and C-natural pulling toward G and B — its tritone aims at G, not at C.' },
            { id: 'am', label: 'A minor — it is V/vi', why: 'V/vi would be E7 (with G♯ as leading tone). D7\'s leading tone is F♯, pointed at G.' },
            { id: 'f', label: 'F — it is V/IV', why: 'V/IV would be C7 (adding B♭). D7 pulls the opposite direction, up toward G.' },
          ]}
          listen={{ label: 'Hear D7/F♯ resolve to G', midis: [42, 50, 57, 60] }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          Read any accidental on a dominant-quality chord as a signpost: it is the borrowed
          leading tone, and its target sits a half step above. Practice turning vi7 into
          V/ii by raising one finger — the cheapest secondary dominant on the instrument.
        </Takeaway>
        <SourceChips ids={['berklee-harmony', 'terefenko']} />
      </div>
    </>
  )
}
