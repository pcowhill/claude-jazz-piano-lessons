import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'

const oneMelodyTwoHarmonies: ExampleSpec = {
  id: 'l1-one-melody',
  title: 'One melody, two harmonizations',
  listen: 'Keep your ear on the melody — notice how the same notes feel stable or floating as the chords beneath them change.',
  homeKey: 'C',
  textAlt:
    'A three-bar melody (E, G, A, then G, E, D, ending on C) harmonized two ways: first with plain diatonic triads (C, F, C over G, G7, C), then recolored with seventh chords (A minor 7, F major 7, E minor 7, G7 flat 9, C major 7).',
  variants: [
    {
      id: 'diatonic',
      label: 'Diatonic anchor',
      chords: [
        ch({
          beats: 2, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
          bass: 'C2 G2', treble: 'E3 G3 C4', jbass: 'C2', jtreble: 'E3 G3',
          mel: [['E4', 1], ['G4', 1]],
          note: 'Melody E and G are the 3rd and 5th of C — pure chord tones, fully at rest.',
        }),
        ch({
          beats: 2, sym: ['F', 'maj'], roman: 'IV', func: 'predominant',
          bass: 'F2', treble: 'F3 A3 C4', jbass: 'F2 C3', jtreble: 'A3 C4',
          mel: [['A4', 2]],
          note: 'The held A is the 3rd of F. The same letter will mean something different in the other harmonization.',
        }),
        ch({
          beats: 2, sym: ['C', 'maj', 'G'], roman: 'I⁶₄', func: 'tonic (cadential)',
          bass: 'G2', treble: 'E3 G3 C4', jbass: 'G2', jtreble: 'E3 C4',
          mel: [['G4', 1], ['E4', 1]],
          note: 'C/G — the cadential shape: tonic notes over the dominant bass, leaning into G7.',
        }),
        ch({
          beats: 2, sym: ['G', '7'], roman: 'V7', func: 'dominant',
          bass: 'G2 D3', treble: 'F3 B3', jbass: 'G2 F3', jtreble: 'B3',
          mel: [['D4', 2]],
          note: 'Melody D is the 5th of G7; the tension lives below it in the tritone F–B.',
        }),
        ch({
          beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'tonic',
          bass: 'C2 C3', treble: 'E3 G3', jbass: 'C2', jtreble: 'E3 G3',
          mel: [['C4', 4]],
          note: 'The melody itself supplies the final root.',
        }),
      ],
    },
    {
      id: 'recolored',
      label: 'Recolored sevenths',
      analysis: [
        'Same melody, different world. E is now the 5th of Am7 instead of the 3rd of C; the held A becomes the 3rd of Fmaj7; the closing D sits on top of a G7(♭9), where the darkened A♭ underneath makes the same melody note feel more urgent.',
      ],
      chords: [
        ch({
          beats: 2, sym: ['A', 'm7'], roman: 'vi7', func: 'tonic substitute',
          bass: 'A2 E3', treble: 'G3 C4', jbass: 'A2', jtreble: 'G3 C4',
          mel: [['E4', 1], ['G4', 1]],
          note: 'E is now the 5th of Am7 and G is its 7th — the same notes, resting on a darker floor.',
        }),
        ch({
          beats: 2, sym: ['F', 'maj7'], roman: 'IVmaj7', func: 'predominant',
          bass: 'F2', treble: 'A3 C4 E4', jbass: 'F2 C3', jtreble: 'A3 E4',
          mel: [['A4', 2]],
        }),
        ch({
          beats: 2, sym: ['E', 'm7'], roman: 'iii7', func: 'tonic substitute',
          bass: 'E2 B2', treble: 'G3 B3 D4', jbass: 'E2', jtreble: 'G3 D4',
          mel: [['G4', 1], ['E4', 1]],
          note: 'G is the minor 3rd of Em7 here; two bars ago it was the 5th of C.',
        }),
        ch({
          beats: 2, sym: ['G', '7b9'], roman: 'V7(♭9)', func: 'dominant',
          bass: 'G2', treble: 'F3 Ab3 B3', jbass: 'G2 F3', jtreble: 'Ab3 B3',
          mel: [['D4', 2]],
          emph: 'Ab3',
          note: 'The borrowed A♭ (the ♭9) darkens the dominant without touching the melody.',
        }),
        ch({
          beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
          bass: 'C2 G2', treble: 'E3 G3 B3', jbass: 'C2', jtreble: 'E3 B3',
          mel: [['C4', 4]],
          note: 'B, the major 7th, keeps a little shimmer under the final C.',
        }),
      ],
    },
  ],
  analysis: [
    'Melody notes do not have fixed meanings. A note is a chord tone, an extension, or a tension only in relation to the harmony of the moment — reharmonizing is just re-deciding those relationships.',
  ],
}

const guideTones251: ExampleSpec = {
  id: 'l1-guide-tones',
  title: 'ii–V–I: block chords vs. voice-led shells',
  listen: 'Toggle Clear and Jazz: hear the same progression as stacked blocks, then as two quiet inner lines doing all the work.',
  homeKey: 'C',
  defaultTempo: 76,
  textAlt:
    'D minor 7, G7, C major 7, one chord per bar. The clear voicing stacks each chord in root position; the jazz voicing keeps only bass plus the guide tones, so C falls to B while F holds, then F falls to E while B holds.',
  chords: [
    ch({
      beats: 4, sym: ['D', 'm7'], roman: 'ii7', func: 'predominant',
      bass: 'D2 A2', treble: 'F3 A3 C4',
      jbass: 'D2', jtreble: 'F3 C4',
      emph: 'F3 C4',
      note: 'Guide tones: F (the 3rd) and C (the 7th).',
    }),
    ch({
      beats: 4, sym: ['G', '7'], roman: 'V7', func: 'dominant',
      bass: 'G2 D3', treble: 'G3 B3 D4 F4',
      jbass: 'G2', jtreble: 'F3 B3',
      emph: 'F3 F4 B3',
      note: 'C fell a half step to B; F simply stayed. Two voices moved a total of one semitone.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: 'tonic',
      bass: 'C2 G2', treble: 'E3 G3 B3',
      jbass: 'C2', jtreble: 'E3 B3',
      emph: 'E3 B3',
      note: 'Now F falls to E and B stays. The whole cadence is carried by half-step sighs.',
    }),
  ],
  analysis: [
    'The highlighted notes are the guide tones — each chord\'s 3rd and 7th. They define the chord quality, and in a ii–V–I they resolve by half step or common tone: C→B into G7, then F→E into Cmaj7.',
    'Root-position blocks are honest but clumsy: every voice leaps. The shell voicing moves almost nothing, which is why it sounds calmer even though the harmony is identical. Smooth inner lines usually matter more than root-position completeness — the bass can imply the rest.',
  ],
}

export function Lesson01() {
  return (
    <>
      <div className="prose">
        <h3>One note, many meanings</h3>
        <p>
          Play a lone E above a C major chord and it glows — it is the chord's 3rd. Put the
          same E above an A minor seventh chord and it cools into the 5th; above F major 7 it
          turns into a floating major 7th. Nothing about the E changed. Harmony is the lens,
          and jazz players spend their lives adjusting that lens under melodies.
        </p>
        <p>
          It helps to sort a melody note's possible jobs: <strong>chord tones</strong> (root,
          3rd, 5th, 7th) sit inside the sound; <strong>extensions</strong> (9ths, 11ths,
          13ths) float above it; <strong>suspensions</strong> hold over from the previous
          chord and want to settle; <strong>approach and passing tones</strong> are moving
          connective tissue, dissonant only for a moment. The first example below keeps one
          original melody fixed and swaps the harmony underneath it — listen for how each
          note's job changes.
        </p>
        <h3>Voices move; chords follow</h3>
        <p>
          Between two chords, each voice has a little journey. When voices move opposite
          directions it is <em>contrary</em> motion; when one holds while another moves,
          <em> oblique</em>; when they travel the same direction, <em>similar</em>. Contrary
          and oblique motion make progressions feel inevitable rather than shoved, which is
          why pianists obsess over inner voices more than over playing every chord from its
          root.
        </p>
        <h3>Guide tones: the two-note engine</h3>
        <p>
          A chord's 3rd and 7th — the <strong>guide tones</strong> — carry its identity. In a
          ii–V–I they form a chain of half-step resolutions and common tones. The second
          example strips a ii–V–I down to bass plus guide tones so you can hear the engine
          without the bodywork.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={oneMelodyTwoHarmonies} />
        <MusicPanel spec={guideTones251} />
        <ChoiceExercise
          title="What is that A doing?"
          prompt={
            <>
              In the <em>Diatonic anchor</em> harmonization, bar 1 holds melody note A over an
              F major chord. In the <em>Recolored</em> version the same A sits over Fmaj7.
              What is A's job in both cases?
            </>
          }
          hint="Spell the F major triad: F–A–C. Where does A land?"
          explanation={
            <p>
              A is the <strong>3rd of F</strong> in both harmonizations — a full chord tone,
              which is why that long note feels so settled. If the chord under it were C
              instead, the same A would be a 13th: a pretty extension, but floating rather
              than anchored. One letter, two completely different amounts of gravity.
            </p>
          }
          options={[
            { id: 'ct', label: 'A chord tone — the 3rd of F', correct: true, why: 'Right: F–A–C. The melody sits inside the chord, which is why it feels at rest.' },
            { id: 'ext', label: 'An extension — the 13th', why: 'A would be the 13th over C, but the chord here is F, and F–A–C makes A its 3rd.' },
            { id: 'pass', label: 'A passing tone', why: 'Passing tones move quickly between chord tones; this A is held and consonant.' },
            { id: 'sus', label: 'A suspension waiting to resolve', why: 'Nothing is held over from the previous chord — A arrives together with F and belongs to it.' },
          ]}
          listen={{ label: 'Hear F major with A on top', midis: [41, 57, 60, 65, 69] }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          Before reaching for a bigger chord, ask what each melody note is <em>doing</em> —
          chord tone, extension, or motion — and move the fewest voices possible to change
          the answer. Guide tones (3rds and 7ths) are the two-note summary of any progression.
        </Takeaway>
        <SourceChips ids={['levine-piano', 'terefenko']} />
      </div>
    </>
  )
}
