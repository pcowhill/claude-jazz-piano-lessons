import { describe, expect, it } from 'vitest'
import { formatChordSymbol, spokenChordSymbol, sym, transposeChordSymbol } from './chord'
import { interval } from './interval'

describe('chord symbol formatting', () => {
  it('formats common jazz symbols', () => {
    expect(formatChordSymbol(sym('C', 'maj7'))).toBe('Cmaj7')
    expect(formatChordSymbol(sym('D', 'm7'))).toBe('Dm7')
    expect(formatChordSymbol(sym('G', '13b9'))).toBe('G13(♭9)')
    expect(formatChordSymbol(sym('Db', '7b9'))).toBe('D♭7(♭9)')
    expect(formatChordSymbol(sym('B', 'dim7'))).toBe('B°7')
    expect(formatChordSymbol(sym('B', 'm7b5'))).toBe('Bm7(♭5)')
    expect(formatChordSymbol(sym('F', 'm6'))).toBe('Fm6')
    expect(formatChordSymbol(sym('C', '69'))).toBe('C6/9')
    expect(formatChordSymbol(sym('G', 'maj'))).toBe('G')
  })

  it('formats slash chords', () => {
    expect(formatChordSymbol(sym('D', '7', 'F#'))).toBe('D7/F♯')
    expect(formatChordSymbol(sym('G', 'maj', 'B'))).toBe('G/B')
  })

  it('transposes root and bass with letter-aware intervals', () => {
    // D7/F♯ up a minor third → F7/A.
    const up = transposeChordSymbol(sym('D', '7', 'F#'), interval(2, 3))
    expect(formatChordSymbol(up)).toBe('F7/A')
    // D♭7(♭9) up a whole step → E♭7(♭9).
    const whole = transposeChordSymbol(sym('Db', '7b9'), interval(1, 2))
    expect(formatChordSymbol(whole)).toBe('E♭7(♭9)')
  })

  it('speaks symbols for screen readers', () => {
    expect(spokenChordSymbol(sym('D', '7', 'F#'))).toBe('D 7 over F-sharp')
    expect(spokenChordSymbol(sym('Bb', '7b9'))).toBe('B-flat seven flat nine')
  })
})
