// Spelled-pitch model. Spelling (letter + alteration) is the source of truth;
// MIDI numbers are always derived. The octave belongs to the letter (scientific
// pitch notation), so C♭4 sounds as MIDI 59 and B♯3 sounds as MIDI 60.

export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

export const LETTERS: readonly Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const LETTER_PC: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const LETTER_INDEX: Record<Letter, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

/** A pitch class with a definite spelling, e.g. { letter: 'E', alter: -1 } for E♭. */
export interface PitchClass {
  letter: Letter
  /** Chromatic alteration: -2 (double flat) … +2 (double sharp). */
  alter: number
}

/** A spelled pitch in a definite octave. */
export interface Pitch extends PitchClass {
  octave: number
}

export function letterIndex(letter: Letter): number {
  return LETTER_INDEX[letter]
}

export function letterAt(index: number): Letter {
  return LETTERS[((index % 7) + 7) % 7]
}

/** Sounding pitch class 0–11 (C = 0). */
export function pcOf(p: PitchClass): number {
  return (((LETTER_PC[p.letter] + p.alter) % 12) + 12) % 12
}

/** Sounding MIDI number; middle C (C4) = 60. */
export function midiOf(p: Pitch): number {
  return 12 * (p.octave + 1) + LETTER_PC[p.letter] + p.alter
}

const PITCH_RE = /^([A-Ga-g])(bb|##|b|#|x|♭♭|♯♯|♭|♯|𝄪|𝄫)?(-?\d+)?$/

function parseAlter(token: string | undefined): number {
  switch (token) {
    case undefined:
      return 0
    case 'b':
    case '♭':
      return -1
    case 'bb':
    case '♭♭':
    case '𝄫':
      return -2
    case '#':
    case '♯':
      return 1
    case '##':
    case '♯♯':
    case 'x':
    case '𝄪':
      return 2
    default:
      throw new Error(`Unknown accidental: ${token}`)
  }
}

/** Parse 'Eb' / 'F#' / 'Cbb' into a spelled pitch class. */
export function pc(text: string): PitchClass {
  const m = PITCH_RE.exec(text.trim())
  if (!m || m[3] !== undefined) throw new Error(`Invalid pitch class: ${text}`)
  return { letter: m[1].toUpperCase() as Letter, alter: parseAlter(m[2]) }
}

/** Parse 'Eb4' / 'F#3' / 'Cb5' into a spelled pitch. */
export function sp(text: string): Pitch {
  const m = PITCH_RE.exec(text.trim())
  if (!m || m[3] === undefined) throw new Error(`Invalid pitch: ${text}`)
  return {
    letter: m[1].toUpperCase() as Letter,
    alter: parseAlter(m[2]),
    octave: parseInt(m[3], 10),
  }
}

/** Parse a space-separated list of pitches: 'C2 E3 G3'. */
export function sps(text: string): Pitch[] {
  const trimmed = text.trim()
  if (trimmed === '') return []
  return trimmed.split(/\s+/).map(sp)
}

/** Unicode accidental text: '', '♭', '♯', '♭♭', '♯♯'. */
export function accidentalText(alter: number): string {
  switch (alter) {
    case 0:
      return ''
    case -1:
      return '♭'
    case 1:
      return '♯'
    case -2:
      return '♭♭'
    case 2:
      return '♯♯'
    default:
      throw new Error(`Unsupported alteration: ${alter}`)
  }
}

/** VexFlow accidental code: 'b', 'bb', '#', '##', 'n'. */
export function vexAccidental(alter: number): string | null {
  switch (alter) {
    case 0:
      return null
    case -1:
      return 'b'
    case 1:
      return '#'
    case -2:
      return 'bb'
    case 2:
      return '##'
    default:
      throw new Error(`Unsupported alteration: ${alter}`)
  }
}

/** Display name of a pitch class, e.g. 'E♭'. */
export function pcName(p: PitchClass): string {
  return p.letter + accidentalText(p.alter)
}

/** Display name of a pitch, e.g. 'E♭4'. */
export function pitchName(p: Pitch): string {
  return pcName(p) + String(p.octave)
}

const ALTER_WORD: Record<number, string> = {
  [-2]: '-double-flat',
  [-1]: '-flat',
  0: '',
  1: '-sharp',
  2: '-double-sharp',
}

/** Spoken name for accessibility, e.g. 'E-flat 4'. */
export function spokenPitchName(p: Pitch): string {
  return `${p.letter}${ALTER_WORD[p.alter] ?? ''} ${p.octave}`
}

export function samePc(a: PitchClass, b: PitchClass): boolean {
  return a.letter === b.letter && a.alter === b.alter
}

/**
 * Default spelling for a bare MIDI number when no harmonic context applies
 * (free keyboard play). Black keys are given flat names, the common default
 * in jazz contexts.
 */
export function defaultSpelling(midi: number): Pitch {
  const pcNum = ((midi % 12) + 12) % 12
  const octave = Math.floor(midi / 12) - 1
  const names: Record<number, { letter: Letter; alter: number }> = {
    0: { letter: 'C', alter: 0 },
    1: { letter: 'D', alter: -1 },
    2: { letter: 'D', alter: 0 },
    3: { letter: 'E', alter: -1 },
    4: { letter: 'E', alter: 0 },
    5: { letter: 'F', alter: 0 },
    6: { letter: 'G', alter: -1 },
    7: { letter: 'G', alter: 0 },
    8: { letter: 'A', alter: -1 },
    9: { letter: 'A', alter: 0 },
    10: { letter: 'B', alter: -1 },
    11: { letter: 'B', alter: 0 },
  }
  return { ...names[pcNum], octave }
}

/**
 * If a transposition produced a spelling beyond double accidentals, respell
 * enharmonically with the smallest usable alteration (preferring flats).
 * Curated content never needs this; it is a safety net.
 */
export function respellExtreme(p: Pitch): Pitch {
  if (Math.abs(p.alter) <= 2) return p
  const target = midiOf(p)
  for (const maxAlter of [0, 1, 2]) {
    for (const alter of alterCandidates(maxAlter)) {
      for (const letter of LETTERS) {
        for (const octave of [p.octave - 1, p.octave, p.octave + 1]) {
          const candidate = { letter, alter, octave }
          if (midiOf(candidate) === target) return candidate
        }
      }
    }
  }
  return defaultSpellingAt(target)
}

function alterCandidates(maxAlter: number): number[] {
  return maxAlter === 0 ? [0] : [-maxAlter, maxAlter]
}

function defaultSpellingAt(midi: number): Pitch {
  return defaultSpelling(midi)
}
