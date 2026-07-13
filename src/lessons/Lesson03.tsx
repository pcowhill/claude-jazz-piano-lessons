import { MusicPanel } from '../components/MusicPanel'
import { ChoiceExercise } from '../exercises/ChoiceExercise'
import { Takeaway, SourceChips } from './common'
import { ch } from './authoring'
import type { ExampleSpec } from '../music/example'

export const layering: ExampleSpec = {
  id: 'l3-layering',
  title: 'Layering a chord: triad → 7th → 9th → 13(♯11)',
  listen: 'Each bar adds one layer of color to the same C major foundation — notice when it stops sounding “plain” and starts sounding “jazz.”',
  homeKey: 'C',
  defaultTempo: 66,
  textAlt:
    'Four whole-note chords on the same root: a C major triad, then C major 7, then C major 9, then C major 13 sharp 11, each adding one extension layer.',
  chords: [
    ch({
      beats: 4, sym: ['C', 'maj'], roman: 'I', func: 'triad',
      bass: 'C2 G2', treble: 'E3 G3 C4', jbass: 'C2', jtreble: 'E3 G3 C4',
      note: 'Root, 3rd, 5th: the postcard version.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj7'], roman: 'Imaj7', func: '+ 7th',
      bass: 'C2 G2', treble: 'E3 G3 B3', jbass: 'C2', jtreble: 'E3 B3 E4',
      note: 'B, a half step below the root, adds shimmer. The 7th is the first “jazz” layer.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj9'], roman: 'Imaj9', func: '+ 9th',
      bass: 'C2 G2', treble: 'E3 G3 B3 D4', jbass: 'C2', jtreble: 'E3 B3 D4',
      note: 'D — the 9th — floats a whole step above the root\'s octave. Extensions are just scale tones placed high enough to glow.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj13#11'], roman: 'Imaj13(♯11)', func: '+ ♯11 & 13',
      bass: 'C2 G2', treble: 'E3 G3 B3 D4 F#4 A4', jbass: 'C2', jtreble: 'E3 B3 D4 F#4 A4',
      emph: 'F#4',
      note: 'F♯ (♯11) and A (13). The natural 11 (F) would sit a flat ninth above the 3rd (E) — harsh on a major chord — so the lydian ♯11 is the conventional choice. The jazz voicing omits the 5th, the usual first omission.',
    }),
  ],
  analysis: [
    'Extensions do not change a chord\'s function; they change its light. Cmaj13(♯11) still does tonic work — it is just wearing more color.',
    'Register matters as much as choice of notes: the same extensions crushed into one octave turn to mud. Keep the foundation (root, guide tones) low-mid and let tensions sit above.',
  ],
}

export const tensions251: ExampleSpec = {
  id: 'l3-tension-251',
  title: 'A tension-rich ii–V–I: Dm11 → G13(♭9) → Cmaj9',
  listen: 'Opens in B♭ — a horn-friendly key — with every chord carrying upper color; the guide tones underneath still do the steering.',
  homeKey: 'C',
  initialKeyId: 'Bb',
  defaultTempo: 72,
  textAlt:
    'A ii–V–I with extended chords: D minor 11, G13 flat 9, C major 9, shown transposed to B flat by default (C minor 11, F13 flat 9, B flat major 9).',
  chords: [
    ch({
      beats: 4, sym: ['D', 'm11'], roman: 'ii11', func: 'predominant',
      bass: 'D2 A2', treble: 'F3 A3 C4 G4',
      jbass: 'D2', jtreble: 'F3 C4 E4 G4',
      emph: 'F3 C4',
      note: 'The 11th (G) is a friendly tension on minor chords — it sits a whole step above the ♭3\'s octave, no rub. Jazz voicing: 3–7–9–11.',
    }),
    ch({
      beats: 4, sym: ['G', '13b9'], roman: 'V13(♭9)', func: 'dominant',
      bass: 'G2 D3', treble: 'F3 Ab3 B3 E4',
      jbass: 'G2', jtreble: 'F3 B3 E4 Ab4',
      emph: 'F3 B3',
      note: 'A♭ (♭9) darkens while E (13) brightens — the two coexist happily; this mixed color is a staple resolving dominant. Note the 5th is omitted.',
    }),
    ch({
      beats: 4, sym: ['C', 'maj9'], roman: 'Imaj9', func: 'tonic',
      bass: 'C2 G2', treble: 'E3 G3 B3 D4',
      jbass: 'C2', jtreble: 'E3 B3 D4 G4',
      emph: 'E3 B3',
      note: 'Resolution with the 9th kept in the sound — arrival does not have to mean plain.',
    }),
  ],
  analysis: [
    'Naming note: “available tensions” is shorthand for what tends to sound stable over a chord in a given style, not a legal code. The natural 11 over a major chord is usually avoided in sustained voicings, yet it appears constantly as a suspension or passing tone. Context — register, duration, what resolves where — decides.',
    'Voice leading through the jazz voicings: F holds, C→B, E holds, G→A♭→G. Total motion: three half steps across three chords.',
  ],
}

export function Lesson03() {
  return (
    <>
      <div className="prose">
        <h3>Sevenths are the floor, not the ceiling</h3>
        <p>
          Four seventh-chord qualities do most of jazz's heavy lifting: major 7, dominant 7,
          minor 7, and the diminished pair (m7♭5 and °7). Above that floor live the
          <strong> extensions</strong> — 9ths, 11ths, 13ths — which are simply the other
          scale tones, placed an octave up where they color the chord instead of cluttering
          it.
        </p>
        <h3>Natural and altered tensions</h3>
        <p>
          On a dominant chord the tensions come in two moods. Natural tensions (9, 13) keep
          the chord bright; <strong>altered</strong> tensions (♭9, ♯9, ♯11, ♭13) bend notes a
          half step to sharpen the pull toward the resolution. G13(♭9) resolving to C carries
          both moods at once — bright 13 above, dark ♭9 inside — and the mixture is
          idiomatic, not a contradiction.
        </p>
        <h3>What pianists actually leave out</h3>
        <p>
          Real voicings are as much subtraction as addition. The 5th goes first (it adds mass,
          not identity); the root goes next when a bass player — or your left hand — already
          owns it. What stays: the guide tones and whichever tensions you actually want to
          hear. Keep dense color above the foundation and the sound stays clear even when the
          symbol looks crowded.
        </p>
      </div>
      <div className="wide">
        <MusicPanel spec={layering} />
        <MusicPanel spec={tensions251} />
        <ChoiceExercise
          title="Find the ♭9"
          prompt={
            <>
              Listen to the G13(♭9) voicing (in C for this question). One note supplies the
              ♭9. Which is it?
            </>
          }
          hint="The ♭9 is a half step above the root's octave. The root is G."
          explanation={
            <p>
              A♭ — a half step above G — is the ♭9. E is the 13th (bright), F the ♭7, B the
              3rd. One semitone of difference (A♭ vs. A) flips the chord from sunny G13 to
              the darker G13(♭9); that tiny hinge is most of what “altered dominant” means.
            </p>
          }
          options={[
            { id: 'ab', label: 'A♭', correct: true, why: 'Yes — a half step above the root G, tucked inside the voicing where it darkens everything around it.' },
            { id: 'a', label: 'A', why: 'A natural would be the plain 9th. This chord bends that note down: A♭.' },
            { id: 'e', label: 'E', why: 'E is the 13th — the bright top of the voicing, not the dark inner note.' },
            { id: 'f', label: 'F', why: 'F is the ♭7 — a core chord tone that defines dominant quality, not a tension.' },
          ]}
          listen={{ label: 'Hear G13(♭9)', midis: [43, 50, 53, 56, 59, 64] }}
        />
      </div>
      <div className="prose">
        <Takeaway>
          Build voicings from the guide tones outward: add the tensions you want to hear,
          omit the 5th (and often the root), and keep color above the foundation. Treat
          “available tensions” as strong defaults you are allowed to overrule with your ears.
        </Takeaway>
        <SourceChips ids={['levine-theory', 'berklee-harmony', 'levine-piano']} />
      </div>
    </>
  )
}
