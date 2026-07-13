import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { BuildExercise } from '../exercises/BuildExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'
import { DimCollectionsViz } from './DimCollectionsViz'
import { UpperStructureExplorer } from './UpperStructureExplorer'

export const dominantFamily: ExampleSpec = {
  id: 'l8-dominant-family',
  title: 'One diminished sound, four dominants',
  listen: 'The top four notes of every chord here are the same sounding collection — only the bass, the spelling, and the destination change.',
  homeKey: 'C',
  defaultTempo: 60,
  textAlt:
    'Four dominant seven flat nine chords whose upper structures are the same sounding diminished collection: G7 flat 9 (G under B, D, F, A flat), B flat 7 flat 9 (B flat under D, F, A flat, C flat), D flat 7 flat 9 (D flat under F, A flat, C flat, E double flat), and E7 flat 9 (E under G sharp, B, D, F).',
  chords: [
    ch({
      beats: 4, sym: ['G', '7b9'], func: 'resolves toward C',
      bass: 'G2', treble: 'B3 D4 F4 Ab4',
      jbass: 'G2', jtreble: 'B3 F4 Ab4 D5',
      note: 'G plus B–D–F–A♭: root under a fully diminished seventh built on its major 3rd.',
    }),
    ch({
      beats: 4, sym: ['Bb', '7b9'], func: 'resolves toward E♭',
      bass: 'Bb2', treble: 'D4 F4 Ab4 Cb5',
      jbass: 'Bb2', jtreble: 'D4 Ab4 Cb5 F5',
      note: 'Same sounding upper four notes, respelled for the new root: the ♭9 of B♭ is C♭ (sounds as B).',
    }),
    ch({
      beats: 4, sym: ['Db', '7b9'], func: 'resolves toward G♭',
      bass: 'Db3', treble: 'F4 Ab4 Cb5 Ebb5',
      jbass: 'Db3', jtreble: 'F4 Cb5 Ebb5 Ab5',
      note: 'Strict functional spelling puts E♭♭ (sounds as D) as the ♭9 of D♭ — the price of honesty in a flat-rooted family.',
    }),
    ch({
      beats: 4, sym: ['E', '7b9'], func: 'resolves toward A',
      bass: 'E2', treble: 'G#3 B3 D4 F4',
      jbass: 'E2', jtreble: 'G#3 D4 F4 B4',
      note: 'The sharp-side member: G♯ (sounds as A♭) is now the chord\'s 3rd rather than a tension.',
    }),
  ],
  analysis: [
    'The four upper structures are inversionally and enharmonically equivalent as sounding pitch classes — every one is the B–D–F–A♭ collection. The complete five-note chords are NOT identical: their roots differ, so their functions differ, and each resolves down a fifth to a different tonic (C, E♭, G♭, A — a minor-third cycle).',
    'This is why moving the bass by minor thirds under a held diminished shape audibly “re-aims” the harmony without the upper voices lifting a finger.',
  ],
}

export const passingDim: ExampleSpec = {
  id: 'l8-passing',
  title: 'Chromatic passing diminished chords',
  listen: 'The bass climbs C–C♯–D–D♯–E; each diminished chord is a moving staircase step, not a destination.',
  homeKey: 'C',
  defaultTempo: 76,
  textAlt:
    'C major, C sharp diminished seventh, D minor 7, D sharp diminished seventh, resolving to C major over E. The bass ascends chromatically from C to E.',
  chords: [
    ch({
      beats: 2, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
      bass: 'C3', treble: 'E3 G3 C4', jbass: 'C3', jtreble: 'G3 C4 E4',
    }),
    ch({
      beats: 2, sym: ['C#', 'dim7'], roman: '♯i°7', func: 'passing',
      bass: 'C#3', treble: 'E3 G3 Bb3', jbass: 'C#3', jtreble: 'G3 Bb3 E4',
      emph: 'C#3',
      note: 'C♯–E–G–B♭. Voices barely move from C major; the chromatic bass does the walking.',
    }),
    ch({
      beats: 2, sym: ['D', 'm7'], roman: 'ii7', func: 'arrival',
      bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 A3 C4 E4',
    }),
    ch({
      beats: 2, sym: ['D#', 'dim7'], roman: '♯ii°7', func: 'passing',
      bass: 'D#3', treble: 'F#3 A3 C4', jbass: 'D#3', jtreble: 'F#3 A3 C4 E4',
      emph: 'D#3',
      note: 'D♯–F♯–A–C, pushing the bass onward to E. Note it is spelled with sharps: every tone leans upward or holds.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj', 'E'], roman: 'I⁶', func: 'tonic (1st inversion)',
      bass: 'E3', treble: 'G3 C4 E4', jbass: 'E3', jtreble: 'G3 C4 E4 G4',
      note: 'The staircase lands on tonic harmony with E in the bass — the whole passage was one elaborated tonic-to-tonic gesture.',
    }),
  ],
  analysis: [
    'Passing diminished chords live between diatonic destinations. Analyze the voice leading, not just the label: around each °7, two or three voices hold as common tones while the bass (and often one inner voice) moves by half step. The chord is the shadow the moving line casts.',
  ],
}

export const commonToneAndPivot: ExampleSpec = {
  id: 'l8-ctdim',
  title: 'Common-tone °7 — and the same sound re-aimed',
  listen: 'Version 1: the diminished chord decorates a tonic it never leaves. Version 2: one sounding °7 chord is spelled two ways and sent to two different keys.',
  homeKey: 'C',
  defaultTempo: 72,
  textAlt:
    'Version one: C major, F sharp diminished seventh resolving back to C over G, then G7 and C — a common-tone diminished gesture. Version two: C major 7, then the same sounding diminished chord notated first as C sharp diminished seventh resolving to D minor 7, then as E diminished seventh resolving to F major 7.',
  variants: [
    {
      id: 'ct',
      label: 'Common-tone °7',
      chords: [
        ch({
          beats: 2, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
          bass: 'C3', treble: 'E3 G3 C4', jbass: 'C3', jtreble: 'G3 C4 E4',
        }),
        ch({
          beats: 2, sym: ['F#', 'dim7'], roman: '♯iv°7', func: 'common-tone °7',
          bass: 'F#2', treble: 'A3 C4 Eb4', jbass: 'F#2', jtreble: 'A3 C4 Eb4',
          emph: 'C4',
          note: 'F♯–A–C–E♭ shares C with the tonic triad (the “common tone”). F♯ pulls up to G, E♭ resolves to E, A slides to G — decoration, not departure.',
        }),
        ch({
          beats: 2, sym: ['C', 'maj', 'G'], roman: 'I⁶₄', func: 'tonic over 5th',
          bass: 'G2', treble: 'G3 C4 E4', jbass: 'G2', jtreble: 'G3 C4 E4',
        }),
        ch({
          beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2', treble: 'G3 B3 F4', jbass: 'G2', jtreble: 'B3 F4',
        }),
        ch({
          beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
          bass: 'C3', treble: 'G3 C4 E4', jbass: 'C2 C3', jtreble: 'G3 C4 E4',
        }),
      ],
    },
    {
      id: 'reaim',
      label: 'One sound, two futures',
      analysis: [
        'Both middle chords are the sounding collection C♯–E–G–B♭. Spelled C♯°7, it behaves like the A7(♭9) family and discharges into D minor. Respelled E°7 (E–G–B♭–D♭), it behaves like the C7(♭9) family and discharges into F. Notice the two futures — D and F — sit a minor third apart: diminished symmetry is a switchyard for minor-third-related destinations. (Not every minor-third key change involves diminished harmony, but this is one honest route.)',
      ],
      chords: [
        ch({
          beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
          bass: 'C3', treble: 'E3 G3 B3', jbass: 'C3', jtreble: 'E3 G3 B3',
        }),
        ch({
          beats: 4, sym: ['C#', 'dim7'], roman: '♯i°7 (A7♭9 family)', func: 'aimed at ii',
          bass: 'C#3', treble: 'E3 G3 Bb3', jbass: 'C#3', jtreble: 'E3 G3 Bb3',
          emph: 'C#3',
          note: 'C♯ in the bass insists on rising to D.',
        }),
        ch({
          beats: 4, sym: ['D', 'm7'], roman: 'ii7', func: 'first future',
          bass: 'D3', treble: 'F3 A3 C4', jbass: 'D3', jtreble: 'F3 A3 C4',
        }),
        ch({
          beats: 4, sym: ['E', 'dim7'], roman: 'vii°7/IV (C7♭9 family)', func: 'aimed at IV',
          bass: 'E3', treble: 'G3 Bb3 Db4', jbass: 'E3', jtreble: 'G3 Bb3 Db4',
          emph: 'Db4',
          note: 'Same sounding chord as before, now spelled E–G–B♭–D♭: E is a leading tone to F, and D♭ (not C♯!) falls to C.',
        }),
        ch({
          beats: 4, sym: ['F', 'maj7'], roman: 'IVmaj7', func: 'second future',
          bass: 'F2', treble: 'A3 C4 E4', jbass: 'F2', jtreble: 'A3 C4 E4',
        }),
      ],
    },
  ],
  analysis: [
    'A pitch-class collection has no will of its own; a spelled chord does. C♯°7 and E°7 are the same piano keys but different promises — the spelling records which notes are leading tones and which are falling ♭9s.',
  ],
}

export const octatonicScales: ExampleSpec = {
  id: 'l8-octatonic',
  title: 'Half–whole vs. whole–half: two starting points, one alternation',
  listen: 'Version 1 climbs a half–whole scale over a dominant; version 2 descends a whole–half scale over a °7 chord. Same alternating DNA, different job.',
  homeKey: 'C',
  defaultTempo: 84,
  textAlt:
    'Version one: an ascending G half–whole diminished scale (G, A flat, B flat, B, C sharp, D, E, F) in eighth notes over a G7 flat 9 chord, resolving to C major 7 with the melody landing on E. Version two: a descending whole–half scale on B (B flat, A flat, G, F, E, D, C sharp, B) over a B diminished seventh chord, resolving to C major with the melody rising from B to C.',
  variants: [
    {
      id: 'hw',
      label: 'Half–whole over G7(♭9)',
      chords: [
        ch({
          beats: 4, sym: ['G', '7b9'], roman: 'V7(♭9)', func: 'dominant',
          bass: 'G2', treble: 'Ab3 B3 F4',
          jbass: 'G2', jtreble: 'Ab3 B3 E4 F4',
          mel: [['G4', 0.5], ['Ab4', 0.5], ['Bb4', 0.5], ['B4', 0.5], ['C#5', 0.5], ['D5', 0.5], ['E5', 0.5], ['F5', 0.5]],
          note: 'Scale spelling follows the chord: A♭ is the ♭9, B♭ the ♯9 in its flat-side spelling, C♯ the ♯11 color. The jazz pad adds the 13 (E) — also a scale tone.',
        }),
        ch({
          beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'resolution',
          bass: 'C3', treble: 'G3 B3', jbass: 'C3', jtreble: 'G3 B3 D4',
          mel: [['E5', 4]],
          note: 'The scale\'s top F falls a half step to E — the dominant\'s 7th finding the tonic\'s 3rd.',
        }),
      ],
    },
    {
      id: 'wh',
      label: 'Whole–half over B°7',
      analysis: [
        'Start the same alternation with a whole step instead and you get the whole–half scale — the conventional first choice over a diminished seventh chord itself. One collection, two entry points, two functions. Neither choice is mandatory; context and the line you are singing decide.',
      ],
      chords: [
        ch({
          beats: 4, sym: ['B', 'dim7'], roman: 'vii°7', func: 'diminished seventh',
          bass: 'B2', treble: 'Ab3 D4 F4',
          jbass: 'B2', jtreble: 'Ab3 D4 F4',
          mel: [['Bb5', 0.5], ['Ab5', 0.5], ['G5', 0.5], ['F5', 0.5], ['E5', 0.5], ['D5', 0.5], ['C#5', 0.5], ['B4', 0.5]],
          note: 'B–C♯–D–E–F–G–A♭–B♭ descending: chord tones on the strong eighths, whole-step passing tones between.',
        }),
        ch({
          beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'resolution',
          bass: 'C3', treble: 'G3 C4 E4', jbass: 'C3', jtreble: 'G3 C4 E4',
          mel: [['C5', 4]],
          note: 'The final B rises the half step home.',
        }),
      ],
    },
  ],
  analysis: [
    'Both octatonic scales alternate half and whole steps; the name just records which interval you hear first from the note you call the root. Half–whole fits dominant-7(♭9) harmony (it contains R, 3, 5, ♭7 plus ♭9, ♯9, ♯11, 13); whole–half fits the °7 chord (chord tones fall on its strong steps). Some traditions number or name these scales differently — “diminished scale” alone is ambiguous, which is why this atlas always says which form it means. There is no single universally defined “fully diminished scale.”',
  ],
}

export function Lesson08() {
  return (
    <>
      <div className="prose">
        <h3>First, the words</h3>
        <p>
          “Fully diminished” conventionally names a <em>chord</em> — the diminished seventh,
          four notes stacked in minor thirds (B–D–F–A♭). The two common octatonic scales are
          the <strong>whole–half</strong> and <strong>half–whole</strong> diminished scales.
          There is no one universally defined “fully diminished scale,” so this lesson never
          uses that phrase without saying which structure it means. With the vocabulary
          straight, the symmetry becomes a playground instead of a swamp.
        </p>
        <h3>A chord that is its own inversions</h3>
        <p>
          Stack minor thirds and the octave divides into four equal parts: invert B°7 and
          you get something spelled like D°7, F°7, or A♭°7 — the same sounding object with a
          different name on the door. Count carefully and twelve-tone equal temperament
          holds exactly <strong>three distinct fully diminished seventh pitch-class
          collections</strong> under transposition. But a <em>collection</em> is not a
          <em> chord</em>: a chord has a spelled root, a function, and a promise about where
          its voices go. The clock diagram below keeps the two ideas separate.
        </p>
        <h3>The dominant connection</h3>
        <p>
          Set a root under a diminished seventh built on its major third and you get a
          dominant 7(♭9): <strong>G7(♭9) = G + B–D–F–A♭</strong>. Because that upper
          structure repeats every minor third, the same sounding four notes serve
          G7(♭9), B♭7(♭9), D♭7(♭9), and E7(♭9). If you have ever noticed at the keyboard
          that G7(♭9), B♭7(♭9) and D♭7(♭9) seem to melt into one another while your right
          hand stays put — this is the machinery. The chords are not “the same chord”:
          different roots, different spellings (C♭ and E♭♭ included), different resolutions.
          They are four doors off one corridor.
        </p>
        <h3>Diminished chords at street level</h3>
        <p>
          In real progressions the °7 mostly does three jobs: a <strong>passing</strong> chord
          walking the bass chromatically between diatonic neighbors; a
          <strong> common-tone</strong> chord decorating a stationary harmony; or a
          <strong> reinterpreted pivot</strong> whose respelling quietly re-aims the music —
          often toward a key a minor third away. The examples below play all three, and the
          explorer at the end lets you shuffle the whole deck over one dominant.
        </p>
      </div>
      <div className="wide">
        <DimCollectionsViz />
        <MusicPanel spec={dominantFamily} />
        <MusicPanel spec={passingDim} />
        <MusicPanel spec={commonToneAndPivot} />
        <MusicPanel spec={octatonicScales} />
        <UpperStructureExplorer />
        <ChoiceExercise
          title="Four doors, one corridor"
          prompt={
            <>
              Listen to the four notes B–D–F–A♭. They can sit as the complete upper structure
              (3–5–♭7–♭9) of exactly four dominant 7(♭9) chords. Which four?
            </>
          }
          hint="Each dominant root lives a major third below one of the four notes — so the roots themselves form a minor-third cycle."
          explanation={
            <p>
              <strong>G7(♭9), B♭7(♭9), D♭7(♭9), and E7(♭9)</strong>. Take any member of
              B–D–F–A♭ and step a major third down: B→G, D→B♭, F→D♭, and A♭ (respelled
              G♯)→E. The four roots (G, B♭, D♭, E) form a minor-third cycle — a different
              diminished collection from the one they carry upstairs. Spelling housekeeping:
              over B♭ the ♭9 is written C♭, and over D♭ it is E♭♭.
            </p>
          }
          options={[
            { id: 'right', label: 'G7(♭9) · B♭7(♭9) · D♭7(♭9) · E7(♭9)', correct: true, why: 'Each root sits a major third below a collection member; the roots themselves cycle in minor thirds.' },
            { id: 'w1', label: 'G7(♭9) · A7(♭9) · B7(♭9) · C♯7(♭9)', why: 'Whole-step roots would need four different diminished collections — these four chords share nothing.' },
            { id: 'w2', label: 'C7(♭9) · E♭7(♭9) · G♭7(♭9) · A7(♭9)', why: 'Right shape, wrong corridor: these four share the D♭–E–G–B♭ collection, not B–D–F–A♭.' },
            { id: 'w3', label: 'B7(♭9) · D7(♭9) · F7(♭9) · A♭7(♭9)', why: 'These roots are the collection members themselves; the roots must sit a major third below the members.' },
          ]}
          listen={{ label: 'Hear B–D–F–A♭', midis: [59, 62, 65, 68] }}
        />
        <BuildExercise
          title="Build the half–whole scale"
          homeKey="G"
          target="G3 Ab3 Bb3 B3 C#4 D4 E4 F4"
          transposable
          keySelectorLabel="Dominant root"
          prompt={(_names, key) => (
            <>
              Select the eight tones of the <strong>{key} half–whole diminished scale</strong> —
              the scale that fits {key}7(♭9). Octaves don't matter; the pitch classes do.
            </>
          )}
          hint="Alternate strictly: half step, whole step, half, whole… starting with a half step up from the root."
          explanation={(names, key) => (
            <p>
              {names.join('–')}. From {key}: half, whole, half, whole… The odd-numbered tones
              spell {key}7 with its ♭9/♯9/♯11/13 colors; the even-numbered tones are the °7
              a half step above the root. One scale, both families of this whole lesson.
            </p>
          )}
        />
      </div>
      <div className="prose">
        <Takeaway>
          Say “collection” when you mean the sound and “chord” when you mean a spelled,
          aimed object — the discipline pays off instantly: any °7 shape you can play is
          simultaneously a passing chord, a common-tone ornament, and the top of four
          dominants. Practice re-aiming one shape at C, E♭, G♭, and A before moving it.
        </Takeaway>
        <SourceChips ids={['levine-theory', 'terefenko', 'berklee-ust']} />
      </div>
    </>
  )
}
