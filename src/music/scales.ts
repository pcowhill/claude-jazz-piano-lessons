// Scale and collection constructors for the diminished-systems and
// sixth-diminished lessons. Each collection is authored once with its
// conventional spelling and transposed with letter-aware intervals so the
// internal spelling logic survives transposition.

import type { PitchClass } from './pitch'
import { pc, pcOf } from './pitch'
import { transposePc, transpositionInterval } from './interval'

function transposeSet(template: PitchClass[], templateRoot: PitchClass, root: PitchClass): PitchClass[] {
  const iv = transpositionInterval(templateRoot, root)
  return template.map((p) => transposePc(p, iv))
}

/**
 * Half–whole diminished scale from a dominant root. Template (on F):
 * F–G♭–A♭–A–B–C–D–E♭. Octatonic spelling conventions vary; this one keeps
 * the dominant chord tones (R, 3, 5, ♭7) natural-letter-consistent and
 * spells the tensions ♭9, ♯9 (as the flat-side minor third), ♯11.
 */
export function halfWholeScale(root: PitchClass): PitchClass[] {
  const template = [pc('F'), pc('Gb'), pc('Ab'), pc('A'), pc('B'), pc('C'), pc('D'), pc('Eb')]
  return transposeSet(template, pc('F'), root)
}

/**
 * Whole–half diminished scale from a diminished-chord root. Template (on B):
 * B–C♯–D–E–F–G–A♭–B♭.
 */
export function wholeHalfScale(root: PitchClass): PitchClass[] {
  const template = [pc('B'), pc('C#'), pc('D'), pc('E'), pc('F'), pc('G'), pc('Ab'), pc('Bb')]
  return transposeSet(template, pc('B'), root)
}

/** Fully diminished seventh chord spelled in minor thirds up from a root. */
export function diminishedSeventh(root: PitchClass): PitchClass[] {
  const minorThird = { steps: 2, semitones: 3 }
  const result = [root]
  for (let i = 0; i < 3; i++) {
    result.push(transposePc(result[i], minorThird))
  }
  return result
}

/**
 * The three fully diminished seventh pitch-class collections of 12-TET under
 * chromatic transposition. Representative spellings are given from C, C♯ and
 * D; every named °7 chord is an inversion/respelling of one of these three
 * sounding collections.
 */
export interface DimCollection {
  id: 'I' | 'II' | 'III'
  /** Sounding pitch classes, ascending from the representative root. */
  pcs: number[]
  /** A representative spelled form. */
  spelled: PitchClass[]
  /** Commonly seen enharmonic note names within the collection. */
  memberNames: string[]
}

export const DIM_COLLECTIONS: readonly DimCollection[] = [
  {
    id: 'I',
    pcs: [0, 3, 6, 9],
    spelled: [pc('C'), pc('Eb'), pc('Gb'), pc('Bbb')],
    memberNames: ['C', 'E♭/D♯', 'G♭/F♯', 'B♭♭/A'],
  },
  {
    id: 'II',
    pcs: [1, 4, 7, 10],
    spelled: [pc('C#'), pc('E'), pc('G'), pc('Bb')],
    memberNames: ['C♯/D♭', 'E', 'G', 'B♭/A♯'],
  },
  {
    id: 'III',
    pcs: [2, 5, 8, 11],
    spelled: [pc('D'), pc('F'), pc('Ab'), pc('Cb')],
    memberNames: ['D', 'F', 'A♭/G♯', 'C♭/B'],
  },
]

/** Which of the three collections a sounding pitch class set belongs to. */
export function dimCollectionOf(pcs: number[]): DimCollection | null {
  for (const collection of DIM_COLLECTIONS) {
    const target = new Set(collection.pcs)
    if (pcs.every((p) => target.has(((p % 12) + 12) % 12))) return collection
  }
  return null
}

/**
 * Major sixth-diminished collection (Barry Harris–associated): the union of
 * the tonic major sixth chord and the diminished seventh chord on the leading
 * tone. Template on C: C–D–E–F–G–A♭–A–B = C6 (C E G A) ∪ B°7 (B D F A♭).
 */
export function majorSixthDiminished(tonic: PitchClass): PitchClass[] {
  const template = [pc('C'), pc('D'), pc('E'), pc('F'), pc('G'), pc('Ab'), pc('A'), pc('B')]
  return transposeSet(template, pc('C'), tonic)
}

/**
 * Minor sixth-diminished collection. Template on C:
 * C–D–E♭–F–G–A♭–A–B = Cm6 (C E♭ G A) ∪ B°7 (B D F A♭).
 */
export function minorSixthDiminished(tonic: PitchClass): PitchClass[] {
  const template = [pc('C'), pc('D'), pc('Eb'), pc('F'), pc('G'), pc('Ab'), pc('A'), pc('B')]
  return transposeSet(template, pc('C'), tonic)
}

/** Sounding pitch classes of a spelled collection. */
export function soundingPcs(spelled: PitchClass[]): number[] {
  return spelled.map(pcOf)
}
