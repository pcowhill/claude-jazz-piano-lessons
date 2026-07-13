import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { BuildExercise } from '../exercises/BuildExercise'
import { Takeaway, SourceChips } from './common'
import { ch, drop2, type ChordShorthand } from './authoring'
import type { ExampleSpec } from '../music/example'

// The nine positions of the C major sixth-diminished ladder: alternating C6
// and B°7 inversions, one per scale step, right hand close position with a
// scale-tone bass an octave below.
const MAJOR_STACKS: { bass: string; treble: string; family: '6' | 'dim' }[] = [
  { bass: 'C3', treble: 'C4 E4 G4 A4', family: '6' },
  { bass: 'D3', treble: 'D4 F4 Ab4 B4', family: 'dim' },
  { bass: 'E3', treble: 'E4 G4 A4 C5', family: '6' },
  { bass: 'F3', treble: 'F4 Ab4 B4 D5', family: 'dim' },
  { bass: 'G3', treble: 'G4 A4 C5 E5', family: '6' },
  { bass: 'Ab3', treble: 'Ab4 B4 D5 F5', family: 'dim' },
  { bass: 'A3', treble: 'A4 C5 E5 G5', family: '6' },
  { bass: 'B3', treble: 'B4 D5 F5 Ab5', family: 'dim' },
  { bass: 'C4', treble: 'C5 E5 G5 A5', family: '6' },
]

const MINOR_STACKS: { bass: string; treble: string; family: '6' | 'dim' }[] = [
  { bass: 'C3', treble: 'C4 Eb4 G4 A4', family: '6' },
  { bass: 'D3', treble: 'D4 F4 Ab4 B4', family: 'dim' },
  { bass: 'Eb3', treble: 'Eb4 G4 A4 C5', family: '6' },
  { bass: 'F3', treble: 'F4 Ab4 B4 D5', family: 'dim' },
  { bass: 'G3', treble: 'G4 A4 C5 Eb5', family: '6' },
  { bass: 'Ab3', treble: 'Ab4 B4 D5 F5', family: 'dim' },
  { bass: 'A3', treble: 'A4 C5 Eb5 G5', family: '6' },
  { bass: 'B3', treble: 'B4 D5 F5 Ab5', family: 'dim' },
  { bass: 'C3', treble: 'C5 Eb5 G5 A5', family: '6' },
]

function stackChord(
  stack: { bass: string; treble: string; family: '6' | 'dim' },
  opts: { beats: number; minor?: boolean; showSymbol?: boolean; roman?: string; note?: string },
): ChordShorthand {
  const isSixth = stack.family === '6'
  return {
    beats: opts.beats,
    sym: opts.showSymbol ? (isSixth ? ['C', opts.minor ? 'm6' : '6'] : ['B', 'dim7']) : null,
    roman: opts.roman,
    func: isSixth ? 'sixth family (stable)' : 'diminished family (moving)',
    bass: stack.bass,
    treble: stack.treble,
    jbass: stack.bass,
    jtreble: drop2(stack.treble),
    note: opts.note,
  }
}

export const majorLadder: ExampleSpec = {
  id: 'l9-major-ladder',
  title: 'The C major sixth-diminished ladder, up and down',
  listen: 'Every step alternates a stable C6 shape with a moving B°7 shape — harmony that climbs a scale without ever leaving home.',
  homeKey: 'C',
  defaultTempo: 92,
  textAlt:
    'The eight-note scale C, D, E, F, G, A flat, A, B harmonized in four-note close position: C6 inversions on C, E, G and A; B diminished seventh inversions on D, F, A flat and B. The ladder climbs from C4 to C5 and descends again, ending on C6. Jazz voicing plays the same stacks in drop-2 spacing.',
  chords: [
    ch(stackChord(MAJOR_STACKS[0], { beats: 1, showSymbol: true, roman: 'I6', note: 'C6 root position: the stable family. Tones C–E–G–A.' })),
    ch(stackChord(MAJOR_STACKS[1], { beats: 1, showSymbol: true, roman: 'vii°7', note: 'B°7 over the passing step D. Tones B–D–F–A♭.' })),
    ch(stackChord(MAJOR_STACKS[2], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[3], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[4], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[5], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[6], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[7], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[8], { beats: 1, showSymbol: true, note: 'Arrival an octave up — still C6.' })),
    ch(stackChord(MAJOR_STACKS[7], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[6], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[5], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[4], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[3], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[2], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[1], { beats: 1 })),
    ch(stackChord(MAJOR_STACKS[0], { beats: 4, showSymbol: true, roman: 'I6' })),
  ],
  analysis: [
    'The eight-note collection C–D–E–F–G–A♭–A–B is the union of C6 (C–E–G–A) and B°7 (B–D–F–A♭). Harmonize each scale step with its own family and every melodic step change becomes a full-chord change — “movement,” in the Barry Harris sense, rather than a static pad.',
    'The diminished stacks are not foreign objects: B°7 is the leading-tone diminished of C, and (Lesson 8) the upper structure of G7(♭9). The dominant is hiding inside the scale, taking every other step.',
  ],
}

export const minorLadder: ExampleSpec = {
  id: 'l9-minor-ladder',
  title: 'The C minor sixth-diminished ladder',
  listen: 'Same engine, darker fuel: Cm6 shapes alternate with the very same B°7 — only E changes to E♭.',
  homeKey: 'C',
  defaultTempo: 92,
  textAlt:
    'The eight-note collection C, D, E flat, F, G, A flat, A, B harmonized in close position: C minor 6 inversions alternating with B diminished seventh inversions, ascending from C4 to C5 and settling on C minor 6.',
  chords: [
    ch(stackChord(MINOR_STACKS[0], { beats: 1, minor: true, showSymbol: true, roman: 'i6', note: 'Cm6: C–E♭–G–A. Note A natural — the dorian 6th — not A♭.' })),
    ch(stackChord(MINOR_STACKS[1], { beats: 1, minor: true, showSymbol: true, roman: 'vii°7', note: 'The identical B°7 as in the major form.' })),
    ch(stackChord(MINOR_STACKS[2], { beats: 1, minor: true })),
    ch(stackChord(MINOR_STACKS[3], { beats: 1, minor: true })),
    ch(stackChord(MINOR_STACKS[4], { beats: 1, minor: true })),
    ch(stackChord(MINOR_STACKS[5], { beats: 1, minor: true })),
    ch(stackChord(MINOR_STACKS[6], { beats: 1, minor: true })),
    ch(stackChord(MINOR_STACKS[7], { beats: 1, minor: true })),
    ch(stackChord(MINOR_STACKS[8], { beats: 4, minor: true, showSymbol: true, roman: 'i6' })),
  ],
  analysis: [
    'C minor sixth-diminished: C–D–E♭–F–G–A♭–A–B = Cm6 (C–E♭–G–A) ∪ B°7 (B–D–F–A♭). One note of difference from the major form (E♭ for E), and the entire diminished half is untouched — which is why major and minor sixth-diminished playing feel like dialects of one language.',
  ],
}

export const melodyMovement: ExampleSpec = {
  id: 'l9-melody',
  title: 'Harmonizing a line with sixth-diminished movement',
  listen: 'Each melody note gets its full family chord underneath — chord-tone notes get C6, in-between notes get B°7.',
  homeKey: 'C',
  defaultTempo: 84,
  textAlt:
    'An original ascending melodic line — E, F, G, A, then B, A, G, then A, B, C — harmonized so that melody notes belonging to C6 receive C6 shapes and the remaining notes receive B diminished seventh shapes, ending on C6 with C on top.',
  chords: [
    ch({ beats: 1, sym: ['C', '6'], roman: 'I6', func: 'sixth family', bass: 'C3', treble: 'G3 A3 C4', jbass: 'C3', jtreble: 'G3 C4', mel: [['E4', 1]] }),
    ch({ beats: 1, sym: ['B', 'dim7'], roman: 'vii°7', func: 'diminished family', bass: 'B2', treble: 'Ab3 B3 D4', jbass: 'B2', jtreble: 'Ab3 D4', mel: [['F4', 1]], note: 'Melody F is a passing step — the diminished family carries it.' }),
    ch({ beats: 1, sym: ['C', '6'], func: 'sixth family', bass: 'C3', treble: 'A3 C4 E4', jbass: 'C3', jtreble: 'A3 E4', mel: [['G4', 1]] }),
    ch({ beats: 1, sym: null, func: 'sixth family', bass: 'C3', treble: 'C4 E4 G4', jbass: 'C3', jtreble: 'C4 G4', mel: [['A4', 1]], note: 'Two sixth-family steps in a row (G then A are both C6 tones) — consecutive chord tones may share a family.' }),
    ch({ beats: 1, sym: ['B', 'dim7'], func: 'diminished family', bass: 'B2', treble: 'D4 F4 Ab4', jbass: 'B2', jtreble: 'D4 Ab4', mel: [['B4', 1]] }),
    ch({ beats: 1, sym: ['C', '6'], func: 'sixth family', bass: 'C3', treble: 'C4 E4 G4', jbass: 'C3', jtreble: 'C4 G4', mel: [['A4', 1]] }),
    ch({ beats: 2, sym: null, func: 'sixth family', bass: 'C3', treble: 'A3 C4 E4', jbass: 'C3', jtreble: 'A3 E4', mel: [['G4', 2]] }),
    ch({ beats: 1, sym: null, func: 'sixth family', bass: 'C3', treble: 'C4 E4 G4', jbass: 'C3', jtreble: 'C4 G4', mel: [['A4', 1]] }),
    ch({ beats: 1, sym: ['B', 'dim7'], func: 'diminished family', bass: 'B2', treble: 'D4 F4 Ab4', jbass: 'B2', jtreble: 'D4 Ab4', mel: [['B4', 1]] }),
    ch({ beats: 2, sym: ['C', '6'], roman: 'I6', func: 'sixth family', bass: 'C3', treble: 'E4 G4 A4', jbass: 'C3', jtreble: 'E4 A4', mel: [['C5', 2]], note: 'The line lands with C on top of its own C6 — melody note as chord crown.' }),
  ],
  analysis: [
    'The rule of thumb: melody note in C6 → play a C6 shape with the melody on top; melody note in B°7 → play a B°7 shape. Because the two chords interlock through the whole scale, any largely stepwise line harmonizes itself. This is “block chic”: the harmony breathes with the line instead of waiting under it.',
  ],
}

export const staticVsMoving: ExampleSpec = {
  id: 'l9-static-moving',
  title: 'Static pad vs. sixth-diminished motion',
  listen: 'Version 1 sits on one C6 voicing; version 2 spends the same two bars climbing through the family — same harmony, different amounts of life.',
  homeKey: 'C',
  defaultTempo: 80,
  textAlt:
    'Version one: a C6 chord held for two bars. Version two: the same two bars filled with quarter-note motion through C6 and B diminished seventh inversions, arriving on a higher C6.',
  variants: [
    {
      id: 'static',
      label: 'Static C6',
      chords: [
        ch({ beats: 4, sym: ['C', '6'], roman: 'I6', func: 'tonic', bass: 'C2 G2', treble: 'G3 A3 C4 E4', jbass: 'C2', jtreble: 'A3 C4 E4 G4' }),
        ch({ beats: 4, sym: null, func: 'tonic', bass: 'C2 G2', treble: 'G3 A3 C4 E4', jbass: 'C2', jtreble: 'A3 C4 E4 G4' }),
      ],
    },
    {
      id: 'moving',
      label: 'Moving through the family',
      chords: [
        ch(stackChord(MAJOR_STACKS[0], { beats: 1, showSymbol: true, roman: 'I6' })),
        ch(stackChord(MAJOR_STACKS[1], { beats: 1, showSymbol: true, roman: 'vii°7' })),
        ch(stackChord(MAJOR_STACKS[2], { beats: 1 })),
        ch(stackChord(MAJOR_STACKS[3], { beats: 1 })),
        ch(stackChord(MAJOR_STACKS[4], { beats: 4, showSymbol: true, roman: 'I6', note: 'Arrival on the fifth-on-bottom C6 — the pad from version 1, now earned by motion.' })),
      ],
    },
  ],
  analysis: [
    'Both versions express two bars of tonic. The moving version treats “C6” as a small country rather than a single chord: four inversions and their diminished neighbors to travel through. This is the practical payoff of the system — comping that has direction even when the changes don\'t.',
  ],
}

export function Lesson09() {
  return (
    <>
      <div className="prose">
        <h3>A scale with a chord built in</h3>
        <p>
          This lesson presents material associated with <strong>Barry Harris's pedagogical
          tradition</strong>. The sonorities are old — sixth chords and diminished sevenths
          are everywhere from Bach to bebop, and Harris did not claim to have invented them —
          but his teaching organized them into an unusually playable system, and some of the
          vocabulary here (“sixth-diminished,” “movement”) is specific to that lineage rather
          than universal theory-textbook language.
        </p>
        <p>
          The core object: take C6 (C–E–G–A) and interleave it with B°7 (B–D–F–A♭). Their
          union is an eight-note scale — C–D–E–F–G–A♭–A–B — in which <em>every other note is
          a chord tone</em>. Harmonize each step with its own family and the scale plays
          chords: stable shape, moving shape, stable, moving, all the way up.
        </p>
        <h3>Movement, not chord-hitting</h3>
        <p>
          The point is rhythmic-harmonic life. A held C6 states the tonic once; the ladder
          states it continuously while actually going somewhere. Because the in-between
          chord is the leading-tone diminished — which Lesson 8 unmasked as the top of
          G7(♭9) — the alternation quietly whispers tonic–dominant–tonic–dominant under
          every scale step. Same diminished object, different lens: Lesson 8 treats it as a
          symmetric pivot; this system treats it as the connective tissue inside one key.
        </p>
        <h3>Major and minor forms</h3>
        <p>
          Swap E for E♭ and the system turns minor: Cm6 (C–E♭–G–A, dorian A natural) still
          interlocks with the identical B°7. One accidental separates the two dialects,
          which is why players drill them as a pair.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={majorLadder} />
        <MusicPanel spec={minorLadder} />
        <MusicPanel spec={melodyMovement} />
        <MusicPanel spec={staticVsMoving} />
        <BuildExercise
          title="Supply the neighbor"
          homeKey="C"
          target="D4 F4 Ab4 B4"
          transposable
          prompt={(names, key) => (
            <>
              In {key} major sixth-diminished playing, the scale step just above the root is
              harmonized by the diminished family. Build that four-note chord in the position
              with <strong>{names[0]}</strong> on the bottom.
            </>
          )}
          hint="It is the leading-tone diminished seventh — start on the scale step above the root and stack the collection's minor thirds from there."
          explanation={(names, key) => (
            <p>
              {names.join('–')}: the leading-tone °7 of {key}, voiced with the passing scale
              step on the bottom. Between any two sixth-chord inversions, this family fills
              the gap — each of its tones sits a step from a sixth-chord tone, so every
              voice resolves by step in either direction.
            </p>
          )}
        />
        <ChoiceExercise
          title="Which family?"
          prompt={
            <>
              Listen to the four notes E–G–A–C. In C major sixth-diminished playing, which
              family does this sonority belong to?
            </>
          }
          hint="Reduce it to pitch classes and compare with C6 (C–E–G–A) and B°7 (B–D–F–A♭)."
          explanation={
            <p>
              E–G–A–C is <strong>C6 in first inversion</strong> — the sixth (stable) family.
              The voice-leading tell: each of its notes sits one scale step away from a
              member of B°7 (E↔F or D, G↔A♭, A↔B, C↔B or D), so wherever you are in one
              family, the other is one step of every finger away. That interlock is the whole
              system.
            </p>
          }
          options={[
            { id: 'sixth', label: 'Sixth family — an inversion of C6', correct: true, why: 'Pitch classes C–E–G–A: the stable family, here with E on the bottom.' },
            { id: 'dim', label: 'Diminished family — an inversion of B°7', why: 'B°7 is B–D–F–A♭, and E–G–A–C shares no tones with it — every note here belongs to C6.' },
            { id: 'neither', label: 'Neither — it leaves the collection', why: 'All four notes belong to the eight-note collection, and specifically to its sixth-chord half.' },
          ]}
          listen={{ label: 'Hear E–G–A–C', midis: [64, 67, 69, 72] }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          Practice the ladder hands-separately in C major and C minor: sixth shape, diminished
          shape, alternating up the eight-note scale. When a melody moves by step, harmonize
          it by family membership and the “what chord goes here?” question answers itself.
        </Takeaway>
        <SourceChips ids={['kingstone', 'levine-piano']} />
      </div>
    </>
  )
}
