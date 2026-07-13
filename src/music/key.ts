// The 12 practical tonic choices offered by every key selector. The
// six-semitone key offers both F♯ and G♭ spellings; the concrete choice is
// made per example by whichever spelling produces the simpler notated result.

import type { Pitch, PitchClass } from './pitch'
import { accidentalText, pc, pcOf } from './pitch'
import { transposePitch, transpositionInterval, type Interval } from './interval'

export interface KeyChoice {
  /** Stable id used in state and tests, e.g. 'Db', 'F#/Gb'. */
  id: string
  /** Selector label with proper glyphs, e.g. 'D♭', 'F♯/G♭'. */
  label: string
  /** Candidate tonic spellings (two only for the six-semitone key). */
  tonics: PitchClass[]
}

export const KEY_CHOICES: readonly KeyChoice[] = [
  { id: 'C', label: 'C', tonics: [pc('C')] },
  { id: 'Db', label: 'D♭', tonics: [pc('Db')] },
  { id: 'D', label: 'D', tonics: [pc('D')] },
  { id: 'Eb', label: 'E♭', tonics: [pc('Eb')] },
  { id: 'E', label: 'E', tonics: [pc('E')] },
  { id: 'F', label: 'F', tonics: [pc('F')] },
  { id: 'F#/Gb', label: 'F♯/G♭', tonics: [pc('Gb'), pc('F#')] },
  { id: 'G', label: 'G', tonics: [pc('G')] },
  { id: 'Ab', label: 'A♭', tonics: [pc('Ab')] },
  { id: 'A', label: 'A', tonics: [pc('A')] },
  { id: 'Bb', label: 'B♭', tonics: [pc('Bb')] },
  { id: 'B', label: 'B', tonics: [pc('B')] },
]

export function keyChoiceById(id: string): KeyChoice {
  const found = KEY_CHOICES.find((k) => k.id === id)
  if (!found) throw new Error(`Unknown key id: ${id}`)
  return found
}

/** Key id whose sounding tonic matches the given tonic pitch class. */
export function keyIdForTonic(tonic: PitchClass): string {
  const target = pcOf(tonic)
  const found = KEY_CHOICES.find((k) => k.tonics.some((t) => pcOf(t) === target))
  if (!found) throw new Error(`No key choice for tonic pc ${target}`)
  return found.id
}

/** Circle-of-fifths position of a tonic: C = 0, G = +1 … F = −1, B♭ = −2 … */
export function fifthsPosition(tonic: PitchClass): number {
  const letterFifths: Record<string, number> = { F: -1, C: 0, G: 1, D: 2, A: 3, E: 4, B: 5 }
  return letterFifths[tonic.letter] + 7 * tonic.alter
}

/**
 * Choose the tonic spelling for a key choice against a set of pitches
 * authored in a home key. For the F♯/G♭ choice, both transpositions are
 * scored (total accidentals, heavily penalizing double accidentals). A
 * clearly cleaner spelling wins; near-ties are decided by the home key's
 * circle-of-fifths side — sharp-side material stays sharp (F♯), everything
 * else takes the flat-side G♭ conventional in jazz contexts.
 */
export function resolveTonic(choice: KeyChoice, homeTonic: PitchClass, pitches: Pitch[]): PitchClass {
  if (choice.tonics.length === 1) return choice.tonics[0]
  const scored = choice.tonics.map((candidate) => {
    const iv = transpositionInterval(homeTonic, candidate)
    let score = 0
    for (const p of pitches) {
      const moved = transposePitch(p, iv)
      const magnitude = Math.abs(moved.alter)
      score += magnitude
      if (magnitude >= 2) score += 8
      if (magnitude > 2) score += 100
    }
    return { candidate, score }
  })
  scored.sort((a, b) => a.score - b.score)
  const [first, second] = scored
  if (second.score - first.score > 2) return first.candidate
  // Near-tie: follow the home key's accidental direction.
  const preferSharp = fifthsPosition(homeTonic) > 0
  const sharpCandidate = choice.tonics.find((t) => t.alter > 0)
  const flatCandidate = choice.tonics.find((t) => t.alter < 0)
  return (preferSharp ? sharpCandidate : flatCandidate) ?? first.candidate
}

/** Major key-signature name for VexFlow, e.g. 'Gb', 'F#', 'Bb', 'C'. */
export function keySignatureName(tonic: PitchClass): string {
  return tonic.letter + (tonic.alter === -1 ? 'b' : tonic.alter === 1 ? '#' : '')
}

/** Display name of a major key, e.g. 'G♭'. */
export function keyDisplayName(tonic: PitchClass): string {
  return tonic.letter + accidentalText(tonic.alter)
}

export type { Interval }
