import { describe, expect, it } from 'vitest'
import { KEY_CHOICES, keyChoiceById, keyIdForTonic, keySignatureName, resolveTonic } from './key'
import { pc, pcName, sps } from './pitch'

describe('key choices', () => {
  it('offers exactly the 12 practical tonic choices', () => {
    expect(KEY_CHOICES.map((k) => k.id)).toEqual([
      'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#/Gb', 'G', 'Ab', 'A', 'Bb', 'B',
    ])
    expect(keyChoiceById('F#/Gb').label).toBe('F♯/G♭')
  })

  it('maps sounding tonics back to key ids', () => {
    expect(keyIdForTonic(pc('C#'))).toBe('Db')
    expect(keyIdForTonic(pc('Gb'))).toBe('F#/Gb')
  })

  it('resolves the six-semitone key to the cleaner spelling', () => {
    // Mostly-natural material favors G♭ (6 flats) over F♯ (7 accidentals incl. E♯).
    const naturals = sps('C4 D4 E4 F4 G4 A4 B4')
    expect(pcName(resolveTonic(keyChoiceById('F#/Gb'), pc('C'), naturals))).toBe('G♭')
    // Sharp-heavy source material tips the choice to F♯: from G, the pitch F♯
    // maps to C♯ under F♯ (score 1+1) but to D♭ with a G♭♭?—no: from G to G♭
    // is down a half step, F♯→F natural; craft a genuinely sharp case instead:
    // B major material (5 sharps) from home key B.
    const sharps = sps('B3 C#4 D#4 E4 F#4 G#4 A#4')
    expect(pcName(resolveTonic(keyChoiceById('F#/Gb'), pc('B'), sharps))).toBe('F♯')
  })

  it('produces VexFlow key-signature names', () => {
    expect(keySignatureName(pc('Gb'))).toBe('Gb')
    expect(keySignatureName(pc('F#'))).toBe('F#')
    expect(keySignatureName(pc('C'))).toBe('C')
  })
})
