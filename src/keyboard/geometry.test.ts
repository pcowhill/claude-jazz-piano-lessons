import { describe, expect, it } from 'vitest'
import { isWhiteMidi, keyboardLayout, rangeForExample } from './geometry'

describe('keyboard layout', () => {
  it('classifies white and black keys', () => {
    expect(isWhiteMidi(60)).toBe(true) // C4
    expect(isWhiteMidi(61)).toBe(false) // C♯4
    expect(isWhiteMidi(64)).toBe(true) // E4
  })

  it('lays out two octaves C4–C6 with correct counts', () => {
    const layout = keyboardLayout(60, 84)
    expect(layout.whites).toHaveLength(15)
    expect(layout.blacks).toHaveLength(10)
    expect(layout.whites[0].midi).toBe(60)
    expect(layout.whites.at(-1)?.midi).toBe(84)
  })

  it('snaps non-white bounds outward', () => {
    const layout = keyboardLayout(61, 82) // C♯4 … B♭5
    expect(layout.lowMidi).toBe(60) // C4
    expect(layout.highMidi).toBe(83) // B5
  })

  it('places black keys between their neighbors in grouped positions', () => {
    const layout = keyboardLayout(60, 72)
    const cs4 = layout.blacks.find((b) => b.midi === 61)!
    const ds4 = layout.blacks.find((b) => b.midi === 63)!
    const fs4 = layout.blacks.find((b) => b.midi === 66)!
    // C♯ sits between white indexes 0 and 1, leaning left; D♯ leans right.
    expect(cs4.center).toBeGreaterThan(0.5)
    expect(cs4.center).toBeLessThan(1.0)
    expect(ds4.center).toBeGreaterThan(2.0)
    expect(ds4.center).toBeLessThan(2.5)
    // F♯ sits after the E/F boundary (white index 3).
    expect(fs4.center).toBeGreaterThan(3.5)
    expect(fs4.center).toBeLessThan(4.0)
  })

  it('handles ranges that start mid-octave', () => {
    const layout = keyboardLayout(65, 77) // F4..F5
    const gs4 = layout.blacks.find((b) => b.midi === 68)!
    // G♯4's octave C is off the left edge; it sits centered on the G/A
    // boundary (white indexes 1|2 → x = 2).
    expect(gs4.center).toBeCloseTo(2.0)
  })
})

describe('example display range', () => {
  it('spans at least two octaves', () => {
    const { low, high } = rangeForExample(60, 64)
    expect(high - low).toBeGreaterThanOrEqual(24)
  })

  it('covers the requested notes with margin', () => {
    const { low, high } = rangeForExample(40, 79)
    expect(low).toBeLessThanOrEqual(38)
    expect(high).toBeGreaterThanOrEqual(81)
  })

  it('starts on a C for octave labeling', () => {
    const { low } = rangeForExample(50, 70)
    expect(((low % 12) + 12) % 12).toBe(0)
  })
})
