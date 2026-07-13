import { describe, expect, it } from 'vitest'
import { beatsToSeconds, beatsToTicks, ticksNotation } from './timing'

describe('playback timing conversion', () => {
  it('converts beats to seconds at a tempo', () => {
    expect(beatsToSeconds(4, 120)).toBe(2)
    expect(beatsToSeconds(1, 60)).toBe(1)
    expect(beatsToSeconds(2, 96)).toBeCloseTo(1.25)
  })

  it('converts beats to transport ticks', () => {
    expect(beatsToTicks(1, 192)).toBe(192)
    expect(beatsToTicks(2.5, 192)).toBe(480)
    expect(beatsToTicks(0, 192)).toBe(0)
  })

  it('renders Tone.js tick notation', () => {
    expect(ticksNotation(2.5, 192)).toBe('480i')
    expect(ticksNotation(4, 192)).toBe('768i')
  })
})
