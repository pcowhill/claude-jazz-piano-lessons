// Diatonic-letter-aware intervals. An interval is a (letter-step, semitone)
// pair, so transposition preserves spelling function: the ♭9 of C7 (D♭)
// transposed up a minor second lands on E♭♭, not D.

import type { Pitch, PitchClass } from './pitch'
import { LETTERS, letterAt, letterIndex, midiOf, pcOf } from './pitch'

export interface Interval {
  /** Signed letter steps (0 = unison, 1 = some kind of second, …). */
  steps: number
  /** Signed sounding semitones. */
  semitones: number
}

export function interval(steps: number, semitones: number): Interval {
  return { steps, semitones }
}

const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/** Transpose a spelled pitch by a letter-aware interval. */
export function transposePitch(p: Pitch, iv: Interval): Pitch {
  const total = letterIndex(p.letter) + iv.steps
  const letter = letterAt(total)
  const octave = p.octave + Math.floor(total / 7)
  const targetMidi = midiOf(p) + iv.semitones
  const naturalMidi = 12 * (octave + 1) + LETTER_PC[letter]
  return { letter, octave, alter: targetMidi - naturalMidi }
}

/** Transpose a spelled pitch class by a letter-aware interval. */
export function transposePc(p: PitchClass, iv: Interval): PitchClass {
  const anchored: Pitch = { ...p, octave: 4 }
  const moved = transposePitch(anchored, iv)
  return { letter: moved.letter, alter: moved.alter }
}

/**
 * The upward interval (0–6 steps, 0–11 semitones) from one spelled pitch
 * class to another.
 */
export function intervalBetweenPcs(from: PitchClass, to: PitchClass): Interval {
  const steps = (((letterIndex(to.letter) - letterIndex(from.letter)) % 7) + 7) % 7
  const semitones = (((pcOf(to) - pcOf(from)) % 12) + 12) % 12
  return { steps, semitones }
}

/**
 * The transposition interval between two tonics, normalized to the nearest
 * direction (within ±6 semitones) so voicings drift as little as possible
 * before register correction.
 */
export function transpositionInterval(from: PitchClass, to: PitchClass): Interval {
  const up = intervalBetweenPcs(from, to)
  if (up.semitones > 6) {
    return { steps: up.steps - 7, semitones: up.semitones - 12 }
  }
  return up
}

const MAJOR_SCALE_SEMITONES = [0, 2, 4, 5, 7, 9, 11]

/**
 * Interval label of a spelled note relative to a spelled root, using
 * chord-tension vocabulary: R, ♭9, 9, ♯9, 3, ♭3, 11, ♯11, 5, ♭5, ♯5, ♭13,
 * 13, ♭7, 7, ♭♭7 (diminished seventh), etc. Degrees 2, 4 and 6 are named as
 * tensions (9, 11, 13); use for chord-tone annotation.
 */
export function spelledIntervalLabel(root: PitchClass, note: PitchClass): string {
  const iv = intervalBetweenPcs(root, note)
  const degree = iv.steps // 0..6
  const expected = MAJOR_SCALE_SEMITONES[degree]
  let diff = iv.semitones - expected
  if (diff > 6) diff -= 12
  if (diff < -6) diff += 12
  const names: Record<number, string> = { 0: 'R', 1: '9', 2: '3', 3: '11', 4: '5', 5: '13', 6: '7' }
  const base = names[degree]
  if (base === undefined) throw new Error(`Bad degree ${degree}`)
  if (diff === 0) return base
  const prefix = diff > 0 ? '♯'.repeat(diff) : '♭'.repeat(-diff)
  return prefix + base
}

/**
 * Sounding-pitch-class tension label over a dominant root: 0 → R, 1 → ♭9,
 * 3 → ♯9, 6 → ♯11, 8 → ♭13, 10 → ♭7 … Used when explaining what a spelled
 * note *sounds like* against a dominant chord.
 */
export function soundingTensionLabel(rootPcNum: number, notePcNum: number): string {
  const offset = (((notePcNum - rootPcNum) % 12) + 12) % 12
  const table: Record<number, string> = {
    0: 'R',
    1: '♭9',
    2: '9',
    3: '♯9',
    4: '3',
    5: '11',
    6: '♯11',
    7: '5',
    8: '♭13',
    9: '13',
    10: '♭7',
    11: 'maj7',
  }
  return table[offset]
}

/** Conventional dominant-context spelling of each tension above a root. */
const TENSION_INTERVAL: Record<number, Interval> = {
  0: interval(0, 0), // R
  1: interval(1, 1), // ♭9
  2: interval(1, 2), // 9
  3: interval(2, 3), // ♯9 spelled as ♭3 in flat-side jazz practice? No — ♯9 = raised second... see note below
  4: interval(2, 4), // 3
  5: interval(3, 5), // 11
  6: interval(3, 6), // ♯11
  7: interval(4, 7), // 5
  8: interval(5, 8), // ♭13
  9: interval(5, 9), // 13
  10: interval(6, 10), // ♭7
  11: interval(6, 11), // maj7
}
// Note on offset 3: the tension is named ♯9, but on flat-rooted dominants the
// practical spelling is often the minor third above the root (e.g. A♭ over F7
// rather than G♯). We spell it as a third-letter so F7 gets A♭; the *label*
// stays ♯9 via soundingTensionLabel.

/** The conventionally spelled pitch class for a sounding tension over a dominant root. */
export function canonicalTensionSpelling(root: PitchClass, soundingPcNum: number): PitchClass {
  const offset = (((soundingPcNum - pcOf(root)) % 12) + 12) % 12
  const iv = TENSION_INTERVAL[offset]
  const spelled = transposePc(root, iv)
  if (Math.abs(spelled.alter) > 2) {
    // Fall back to the flat default for extreme roots.
    const target = soundingPcNum
    for (const letter of LETTERS) {
      for (const alter of [0, -1, 1, -2, 2]) {
        const candidate = { letter, alter }
        if (pcOf(candidate) === target) return candidate
      }
    }
  }
  return spelled
}
