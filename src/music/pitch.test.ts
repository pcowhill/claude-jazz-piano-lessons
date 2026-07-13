import { describe, expect, it } from 'vitest'
import {
  accidentalText,
  defaultSpelling,
  midiOf,
  pc,
  pcName,
  pcOf,
  pitchName,
  respellExtreme,
  sp,
  spokenPitchName,
  sps,
  vexAccidental,
} from './pitch'

describe('pitch parsing', () => {
  it('parses naturals, flats, sharps and doubles', () => {
    expect(sp('C4')).toEqual({ letter: 'C', alter: 0, octave: 4 })
    expect(sp('Eb3')).toEqual({ letter: 'E', alter: -1, octave: 3 })
    expect(sp('F#2')).toEqual({ letter: 'F', alter: 1, octave: 2 })
    expect(sp('Cbb5')).toEqual({ letter: 'C', alter: -2, octave: 5 })
    expect(sp('G##1')).toEqual({ letter: 'G', alter: 2, octave: 1 })
    expect(sp('Gx1')).toEqual({ letter: 'G', alter: 2, octave: 1 })
    expect(pc('Bb')).toEqual({ letter: 'B', alter: -1 })
  })

  it('parses unicode accidentals', () => {
    expect(sp('E♭4')).toEqual({ letter: 'E', alter: -1, octave: 4 })
    expect(pc('F♯')).toEqual({ letter: 'F', alter: 1 })
  })

  it('rejects malformed input', () => {
    expect(() => sp('H4')).toThrow()
    expect(() => sp('C')).toThrow()
    expect(() => pc('Cb4')).toThrow()
  })

  it('parses pitch lists', () => {
    expect(sps('C2 E3 G3').map(pitchName)).toEqual(['C2', 'E3', 'G3'])
    expect(sps('')).toEqual([])
  })
})

describe('midi derivation from spelling', () => {
  it('computes midi with the octave anchored to the letter', () => {
    expect(midiOf(sp('C4'))).toBe(60)
    expect(midiOf(sp('A4'))).toBe(69)
    expect(midiOf(sp('Cb4'))).toBe(59) // sounds as B3
    expect(midiOf(sp('B#3'))).toBe(60) // sounds as C4
    expect(midiOf(sp('Ebb4'))).toBe(62) // sounds as D4
    expect(midiOf(sp('Fx2'))).toBe(43) // sounds as G2
  })

  it('computes sounding pitch classes', () => {
    expect(pcOf(pc('Cb'))).toBe(11)
    expect(pcOf(pc('B#'))).toBe(0)
    expect(pcOf(pc('Ebb'))).toBe(2)
  })
})

describe('formatting', () => {
  it('formats names with unicode accidentals', () => {
    expect(pcName(pc('Eb'))).toBe('E♭')
    expect(pcName(pc('F#'))).toBe('F♯')
    expect(pcName(pc('Ebb'))).toBe('E♭♭')
    expect(pitchName(sp('Cb4'))).toBe('C♭4')
    expect(accidentalText(2)).toBe('♯♯')
  })

  it('produces VexFlow accidental codes', () => {
    expect(vexAccidental(-2)).toBe('bb')
    expect(vexAccidental(0)).toBeNull()
    expect(vexAccidental(2)).toBe('##')
  })

  it('produces spoken names for accessibility', () => {
    expect(spokenPitchName(sp('Ebb4'))).toBe('E-double-flat 4')
    expect(spokenPitchName(sp('C4'))).toBe('C 4')
  })
})

describe('default spelling for free play', () => {
  it('prefers flat names for black keys', () => {
    expect(pitchName(defaultSpelling(61))).toBe('D♭4')
    expect(pitchName(defaultSpelling(70))).toBe('B♭4')
    expect(pitchName(defaultSpelling(60))).toBe('C4')
  })
})

describe('respellExtreme safety net', () => {
  it('leaves double accidentals untouched', () => {
    expect(respellExtreme(sp('Ebb4'))).toEqual(sp('Ebb4'))
  })
  it('respells beyond-double alterations to the same sounding pitch', () => {
    const triple = { letter: 'E' as const, alter: -3, octave: 4 }
    const fixed = respellExtreme(triple)
    expect(midiOf(fixed)).toBe(midiOf(triple))
    expect(Math.abs(fixed.alter)).toBeLessThanOrEqual(2)
  })
})
