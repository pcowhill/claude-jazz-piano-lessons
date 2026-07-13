import { describe, expect, it } from 'vitest'
import {
  canonicalTensionSpelling,
  interval,
  intervalBetweenPcs,
  soundingTensionLabel,
  spelledIntervalLabel,
  transposePc,
  transposePitch,
  transpositionInterval,
} from './interval'
import { midiOf, pc, pcName, pcOf, pitchName, sp } from './pitch'

describe('letter-aware transposition', () => {
  it('transposes by spelled interval, not pitch class', () => {
    // Up a major second: E♭4 → F4
    expect(pitchName(transposePitch(sp('Eb4'), interval(1, 2)))).toBe('F4')
    // Up a minor second from C: D♭ (not C♯)
    expect(pitchName(transposePitch(sp('C4'), interval(1, 1)))).toBe('D♭4')
    // Up an augmented fourth from C: F♯
    expect(pitchName(transposePitch(sp('C4'), interval(3, 6)))).toBe('F♯4')
  })

  it('produces double flats where the function requires them', () => {
    // D♭ (the ♭9 of C7) moved up a minor second (to the key of D♭) → E♭♭.
    expect(pitchName(transposePitch(sp('Db5'), interval(1, 1)))).toBe('E♭♭5')
    // C♭ down a whole step is B♭♭.
    expect(pitchName(transposePitch(sp('Cb5'), interval(-1, -2)))).toBe('B♭♭4')
  })

  it('carries octaves across letter wraps', () => {
    expect(pitchName(transposePitch(sp('B3'), interval(1, 1)))).toBe('C4')
    expect(pitchName(transposePitch(sp('C4'), interval(-1, -1)))).toBe('B3')
    expect(midiOf(transposePitch(sp('A3'), interval(2, 3)))).toBe(60) // A3 + m3 = C4
  })
})

describe('interval measurement', () => {
  it('measures upward pitch-class intervals with letters', () => {
    expect(intervalBetweenPcs(pc('C'), pc('Eb'))).toEqual({ steps: 2, semitones: 3 })
    expect(intervalBetweenPcs(pc('C'), pc('F#'))).toEqual({ steps: 3, semitones: 6 })
    expect(intervalBetweenPcs(pc('C'), pc('Gb'))).toEqual({ steps: 4, semitones: 6 })
  })

  it('normalizes transposition direction to the nearest tonic', () => {
    // C → B♭ should go down a major second, not up a minor seventh.
    expect(transpositionInterval(pc('C'), pc('Bb'))).toEqual({ steps: -1, semitones: -2 })
    // C → E goes up a major third.
    expect(transpositionInterval(pc('C'), pc('E'))).toEqual({ steps: 2, semitones: 4 })
    // C → G♭: six semitones stays upward (diminished fifth).
    expect(transpositionInterval(pc('C'), pc('Gb'))).toEqual({ steps: 4, semitones: 6 })
  })
})

describe('interval labels', () => {
  it('labels chord tones and tensions from spelled roots', () => {
    expect(spelledIntervalLabel(pc('C'), pc('E'))).toBe('3')
    expect(spelledIntervalLabel(pc('C'), pc('Eb'))).toBe('♭3')
    expect(spelledIntervalLabel(pc('C'), pc('Bb'))).toBe('♭7')
    expect(spelledIntervalLabel(pc('G'), pc('Ab'))).toBe('♭9')
    expect(spelledIntervalLabel(pc('G'), pc('E'))).toBe('13')
    expect(spelledIntervalLabel(pc('F'), pc('B'))).toBe('♯11')
    expect(spelledIntervalLabel(pc('Bb'), pc('Cb'))).toBe('♭9')
    expect(spelledIntervalLabel(pc('Db'), pc('Ebb'))).toBe('♭9')
    // Diminished seventh above B: A♭ is a double-flatted 7.
    expect(spelledIntervalLabel(pc('B'), pc('Ab'))).toBe('♭♭7')
  })

  it('labels sounding tensions over a dominant root', () => {
    expect(soundingTensionLabel(pcOf(pc('F')), pcOf(pc('F#')))).toBe('♭9')
    expect(soundingTensionLabel(pcOf(pc('F')), pcOf(pc('D#')))).toBe('♭7')
    expect(soundingTensionLabel(pcOf(pc('F')), pcOf(pc('Ab')))).toBe('♯9')
    expect(soundingTensionLabel(pcOf(pc('F')), pcOf(pc('B')))).toBe('♯11')
    expect(soundingTensionLabel(pcOf(pc('F')), pcOf(pc('D')))).toBe('13')
  })

  it('spells canonical dominant tensions', () => {
    // Over F7, the ♭9 is conventionally G♭ (what F♯ "sounds as").
    expect(pcName(canonicalTensionSpelling(pc('F'), pcOf(pc('F#'))))).toBe('G♭')
    // The ♭7 sounding of D♯ over F is E♭.
    expect(pcName(canonicalTensionSpelling(pc('F'), pcOf(pc('D#'))))).toBe('E♭')
    // The ♯9 of F is spelled A♭ on the flat side.
    expect(pcName(canonicalTensionSpelling(pc('F'), pcOf(pc('Ab'))))).toBe('A♭')
  })
})

describe('transposePc', () => {
  it('keeps pitch-class spelling without octaves', () => {
    expect(pcName(transposePc(pc('Cb'), interval(1, 2)))).toBe('D♭')
    expect(pcName(transposePc(pc('B'), interval(2, 3)))).toBe('D')
  })
})
