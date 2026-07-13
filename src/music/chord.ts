// Structured chord symbols. The root and bass are spelled pitch classes so a
// symbol transposes with the same letter-aware math as the notes it labels.

import type { PitchClass } from './pitch'
import { pc as parsePc, pcName } from './pitch'
import { transposePc, type Interval } from './interval'

export type ChordKind =
  | 'maj' // plain major triad — empty suffix
  | 'm'
  | 'dim'
  | 'aug'
  | '6'
  | 'm6'
  | '69'
  | 'maj7'
  | 'maj9'
  | 'maj13'
  | 'add9'
  | 'm7'
  | 'm9'
  | 'm11'
  | 'mmaj7'
  | '7'
  | '9'
  | '13'
  | '7sus4'
  | '9sus4'
  | '7b9'
  | '7#9'
  | '7#11'
  | '7b13'
  | '13b9'
  | '7alt'
  | 'dim7'
  | 'm7b5'

const KIND_TEXT: Record<ChordKind, string> = {
  maj: '',
  m: 'm',
  dim: '°',
  aug: '+',
  '6': '6',
  m6: 'm6',
  '69': '6/9',
  maj7: 'maj7',
  maj9: 'maj9',
  maj13: 'maj13',
  add9: 'add9',
  m7: 'm7',
  m9: 'm9',
  m11: 'm11',
  mmaj7: 'm(maj7)',
  '7': '7',
  '9': '9',
  '13': '13',
  '7sus4': '7sus4',
  '9sus4': '9sus4',
  '7b9': '7(♭9)',
  '7#9': '7(♯9)',
  '7#11': '7(♯11)',
  '7b13': '7(♭13)',
  '13b9': '13(♭9)',
  '7alt': '7alt',
  dim7: '°7',
  m7b5: 'm7(♭5)',
}

export interface ChordSymbolSpec {
  root: PitchClass
  kind: ChordKind
  /** Bass note when different from the root (slash chord). */
  bass?: PitchClass
}

/** Author helper: sym('D', '7', 'F#') → D7/F♯. */
export function sym(root: string | PitchClass, kind: ChordKind, bass?: string | PitchClass): ChordSymbolSpec {
  const toPc = (v: string | PitchClass): PitchClass => (typeof v === 'string' ? parsePc(v) : v)
  return {
    root: toPc(root),
    kind,
    ...(bass !== undefined ? { bass: toPc(bass) } : {}),
  }
}

export function formatChordSymbol(spec: ChordSymbolSpec): string {
  const rootText = pcName(spec.root)
  const kindText = KIND_TEXT[spec.kind]
  const bassText = spec.bass ? `/${pcName(spec.bass)}` : ''
  return `${rootText}${kindText}${bassText}`
}

export function transposeChordSymbol(spec: ChordSymbolSpec, iv: Interval): ChordSymbolSpec {
  return {
    root: transposePc(spec.root, iv),
    kind: spec.kind,
    ...(spec.bass ? { bass: transposePc(spec.bass, iv) } : {}),
  }
}

/** Spoken version for accessibility/text-alt: 'D7 over F-sharp'. */
export function spokenChordSymbol(spec: ChordSymbolSpec): string {
  const spell = (p: PitchClass): string => {
    const alterWord =
      p.alter === -2 ? '-double-flat' : p.alter === -1 ? '-flat' : p.alter === 1 ? '-sharp' : p.alter === 2 ? '-double-sharp' : ''
    return `${p.letter}${alterWord}`
  }
  const kindSpoken: Partial<Record<ChordKind, string>> = {
    maj: ' major',
    m: ' minor',
    dim7: ' diminished seventh',
    m7b5: ' minor seven flat five',
    '7b9': ' seven flat nine',
    '13b9': ' thirteen flat nine',
  }
  const kind = kindSpoken[spec.kind] ?? ` ${KIND_TEXT[spec.kind]}`
  const bass = spec.bass ? ` over ${spell(spec.bass)}` : ''
  return `${spell(spec.root)}${kind}${bass}`
}
