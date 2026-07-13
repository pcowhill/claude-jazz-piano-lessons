import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'

const borrowedIv: ExampleSpec = {
  id: 'l6-borrowed-iv',
  title: 'IV brightens, iv sighs: F → Fm6 → C',
  listen: 'The whole story is one voice: A falling to A♭, then settling on G.',
  homeKey: 'C',
  defaultTempo: 72,
  textAlt:
    'C major 7 for a bar, then F major 7 moving to F minor 6, resolving to C major 7. The voice A falls to A flat and then to G; D moves up to E.',
  chords: [
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C2 G2', treble: 'E3 G3 B3', jbass: 'C2', jtreble: 'E3 B3 D4',
    }),
    ch({
      beats: 2, sym: ['F', 'maj7'], roman: 'IVmaj7', func: 'predominant',
      bass: 'F2', treble: 'A3 C4 E4', jbass: 'F2', jtreble: 'A3 E4 G4',
      note: 'The diatonic subdominant: bright, open, A natural on top of the stack.',
    }),
    ch({
      beats: 2, sym: ['F', 'm6'], roman: 'iv6', func: 'borrowed predominant',
      bass: 'F2', treble: 'Ab3 C4 D4', jbass: 'F2', jtreble: 'Ab3 D4 G4',
      emph: 'Ab3',
      note: 'Borrowed from C minor: A♭ replaces A. F–A♭–C–D — the added 6th (D) keeps a thread of brightness inside the shadow. Jazz voicing adds the 9th (G).',
    }),
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C2 G2', treble: 'G3 B3 E4', jbass: 'C2', jtreble: 'G3 B3 E4',
      note: 'Resolution by minimal motion: A♭→G (half step), D→E (whole step), C holds.',
    }),
  ],
  analysis: [
    'Why it works: A♭ is a semitone above G, so the borrowed chord manufactures a leading tone downward onto the tonic chord\'s 5th. IV→iv→I turns a plain plagal motion into a two-stage sigh.',
    'This is modal color, not a key change — no cadence establishes C minor, and the tonic that returns is still major.',
  ],
}

const flatSixSeven: ExampleSpec = {
  id: 'l6-flat67',
  title: 'Colors from the parallel minor: ♭VImaj7 and ♭VII7',
  listen: 'Two borrowed chords stride from below back up to the major tonic — dark, cinematic, and entirely inside one key\'s orbit.',
  homeKey: 'C',
  defaultTempo: 80,
  textAlt:
    'C major 7, then A flat major 7, then B flat 7, returning to C major 7 — the flat six and flat seven chords borrowed from C minor.',
  chords: [
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C2 G2', treble: 'E3 G3 B3', jbass: 'C2', jtreble: 'E3 B3',
    }),
    ch({
      beats: 4, sym: ['Ab', 'maj7'], roman: '♭VImaj7', func: 'borrowed',
      bass: 'Ab2', treble: 'G3 C4 Eb4', jbass: 'Ab2', jtreble: 'C4 G4',
      emph: 'Ab2 Eb4',
      note: 'A♭ and E♭ arrive from C natural minor; G and C are common tones with the key. Half the chord is familiar, half borrowed — that is the trick of its warmth.',
    }),
    ch({
      beats: 4, sym: ['Bb', '7'], roman: '♭VII7', func: 'borrowed (backdoor)',
      bass: 'Bb2', treble: 'Ab3 D4 F4', jbass: 'Bb2', jtreble: 'Ab3 D4',
      emph: 'Ab3',
      note: 'Often called the “backdoor” dominant: it approaches I from the flat side. A♭ falls to G; D and F sit a step from the tonic chord\'s E and G.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C2 G2', treble: 'G3 C4 E4', jbass: 'C2', jtreble: 'G3 B3 E4',
    }),
  ],
  analysis: [
    'Both chords come from the same lending library — C natural minor (A♭, B♭, E♭ are its gifts). ♭VI and ♭VII approach the tonic from below, in whole steps, which reads as sturdy and anthemic rather than dominant-tense.',
    'Voice-leading logic beats rule-memorization: find which notes of the borrowed chord are common tones and which resolve by step, and the progression explains itself.',
  ],
}

export function Lesson06() {
  return (
    <>
      <div className="prose">
        <h3>Two keys, one tonic</h3>
        <p>
          C major and C minor share a tonic note but stock different shelves. Modal
          interchange (borrowing) means reaching into the parallel minor for a chord while
          staying in major: minor iv, ♭VImaj7, ♭VII7, ♭IIImaj7, iiø7. The borrowed accidental
          — usually A♭ or E♭ when home is C — is what your ear flags as “suddenly
          bittersweet.”
        </p>
        <h3>Why borrowed chords resolve so well</h3>
        <p>
          The lowered 6th degree (A♭ in C) sits a half step above the 5th (G). Any borrowed
          chord containing it — Fm6, A♭maj7, B♭7 in part — carries a built-in sigh: ♭6→5.
          The rest of the chord is usually common tones with the home key, so the color
          changes while the ground barely moves. That mix of familiar and foreign is the
          entire charm.
        </p>
        <h3>Color, not relocation</h3>
        <p>
          Borrowing never files a change of address. One or two chords visit from C minor,
          then the major tonic returns unchallenged. If the music instead cadences into the
          new tonality and stays, that is modulation — Lesson 7's subject — and the analysis
          (and your ear) should say so.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={borrowedIv} />
        <MusicPanel spec={flatSixSeven} />
        <ChoiceExercise
          title="Spot the borrowed chord"
          prompt={
            <>
              In the first example — Cmaj7, Fmaj7, Fm6, Cmaj7 — which chord is borrowed, and
              from where?
            </>
          }
          hint="Look for the accidental. Which scale owns an A♭ when the tonic is C?"
          explanation={
            <p>
              Fm6 is borrowed from <strong>C natural minor</strong> (the parallel minor),
              whose ♭6 degree supplies the A♭. F lydian would <em>raise</em> notes, not
              lower them; D minor contains no A♭ either. The parallel minor is jazz's
              default lending library because it shares the tonic — the borrowed chord
              changes color without disturbing where home is.
            </p>
          }
          options={[
            { id: 'fm6-cm', label: 'Fm6, from C minor', correct: true, why: 'Right — A♭ is C natural minor\'s ♭6. Same tonic, darker shelf.' },
            { id: 'fmaj7', label: 'Fmaj7, from C minor', why: 'Fmaj7 is fully diatonic to C major (F–A–C–E, no accidentals). Nothing is borrowed yet.' },
            { id: 'fm6-lyd', label: 'Fm6, from F lydian', why: 'F lydian is F–G–A–B–C–D–E — it contains A natural and no A♭. The flat color must come from somewhere darker.' },
            { id: 'fm6-dm', label: 'Fm6, from D minor', why: 'D minor\'s scale has B♭ but A natural — it cannot supply the A♭ that defines Fm6.' },
          ]}
          listen={{
            label: 'Hear F → Fm6 → C',
            sequence: [
              [41, 57, 60, 64], // F: F2 A3 C4 E4
              [41, 56, 60, 62], // Fm6: F2 Ab3 C4 D4
              [36, 55, 59, 64], // Cmaj7: C2 G3 B3 E4
            ],
          }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          When major feels too sunny, borrow: lower the 6th (and sometimes the 3rd or 7th)
          of the key inside one chord and resolve the ♭6 down to 5. If the tonic never has
          to re-prove itself, you borrowed; if it does, you modulated.
        </Takeaway>
        <SourceChips ids={['berklee-harmony', 'levine-theory']} />
      </div>
    </>
  )
}
