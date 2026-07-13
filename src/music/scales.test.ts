import { describe, expect, it } from 'vitest'
import {
  DIM_COLLECTIONS,
  dimCollectionOf,
  diminishedSeventh,
  halfWholeScale,
  majorSixthDiminished,
  minorSixthDiminished,
  soundingPcs,
  wholeHalfScale,
} from './scales'
import { pc, pcName, pcOf } from './pitch'

const names = (pcs: { letter: string; alter: number }[]) =>
  pcs.map((p) => pcName(p as Parameters<typeof pcName>[0]))

describe('diminished seventh chords', () => {
  it('stacks minor thirds with correct spelling', () => {
    expect(names(diminishedSeventh(pc('B')))).toEqual(['B', 'D', 'F', 'A♭'])
    expect(names(diminishedSeventh(pc('C#')))).toEqual(['C♯', 'E', 'G', 'B♭'])
    expect(names(diminishedSeventh(pc('C')))).toEqual(['C', 'E♭', 'G♭', 'B♭♭'])
  })

  it('is symmetric: transposing by minor thirds preserves the sounding collection', () => {
    const base = soundingPcs(diminishedSeventh(pc('B'))).sort((a, b) => a - b)
    for (const root of ['D', 'F', 'Ab'] as const) {
      const moved = soundingPcs(diminishedSeventh(pc(root))).sort((a, b) => a - b)
      expect(moved).toEqual(base)
    }
  })
})

describe('the three diminished collections', () => {
  it('partitions the twelve pitch classes into three collections', () => {
    const all = DIM_COLLECTIONS.flatMap((c) => c.pcs).sort((a, b) => a - b)
    expect(all).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })

  it('identifies membership regardless of spelling or root', () => {
    // B°7 = B D F A♭ → pcs 11 2 5 8 → collection III (contains D).
    expect(dimCollectionOf([11, 2, 5, 8])?.id).toBe('III')
    // C°7 → collection I.
    expect(dimCollectionOf([0, 3, 6, 9])?.id).toBe('I')
    expect(dimCollectionOf([0, 1])).toBeNull()
  })

  it('B–D–F–A♭ and the four 7(♭9) dominant roots G, B♭, D♭, E share structure', () => {
    // The upper structure of G7(♭9), B♭7(♭9), D♭7(♭9), E7(♭9) is the same
    // sounding collection…
    const upper = dimCollectionOf([pcOf(pc('B')), pcOf(pc('D')), pcOf(pc('F')), pcOf(pc('Ab'))])
    expect(upper?.id).toBe('III')
    // …and the four roots themselves form a different single collection.
    const roots = dimCollectionOf([pcOf(pc('G')), pcOf(pc('Bb')), pcOf(pc('Db')), pcOf(pc('E'))])
    expect(roots?.id).toBe('II')
    // The complete five-note chords are NOT identical: distinct roots.
    const rootSet = new Set([pcOf(pc('G')), pcOf(pc('Bb')), pcOf(pc('Db')), pcOf(pc('E'))])
    expect(rootSet.size).toBe(4)
  })

  it('F, D, B and A♭ (the upper-structure triad roots over F7) form one collection', () => {
    const collection = dimCollectionOf([pcOf(pc('F')), pcOf(pc('D')), pcOf(pc('B')), pcOf(pc('Ab'))])
    expect(collection?.id).toBe('III')
  })
})

describe('octatonic scales', () => {
  it('spells the F half–whole scale per its dominant function', () => {
    expect(names(halfWholeScale(pc('F')))).toEqual(['F', 'G♭', 'A♭', 'A', 'B', 'C', 'D', 'E♭'])
  })

  it('transposes the half–whole template with consistent internal spelling', () => {
    expect(names(halfWholeScale(pc('G')))).toEqual(['G', 'A♭', 'B♭', 'B', 'C♯', 'D', 'E', 'F'])
    expect(names(halfWholeScale(pc('C')))).toEqual(['C', 'D♭', 'E♭', 'E', 'F♯', 'G', 'A', 'B♭'])
  })

  it('alternates half/whole steps from the root (H–W pattern)', () => {
    const scale = halfWholeScale(pc('F'))
    const pcs = soundingPcs(scale)
    const steps = pcs.map((p, i) => (((pcs[(i + 1) % 8] - p) % 12) + 12) % 12)
    expect(steps).toEqual([1, 2, 1, 2, 1, 2, 1, 2])
  })

  it('spells the whole–half scale for diminished-chord function', () => {
    expect(names(wholeHalfScale(pc('B')))).toEqual(['B', 'C♯', 'D', 'E', 'F', 'G', 'A♭', 'B♭'])
    const pcs = soundingPcs(wholeHalfScale(pc('B')))
    const steps = pcs.map((p, i) => (((pcs[(i + 1) % 8] - p) % 12) + 12) % 12)
    expect(steps).toEqual([2, 1, 2, 1, 2, 1, 2, 1])
  })

  it('half–whole on F contains the union of the four upper-structure triads', () => {
    const scale = new Set(soundingPcs(halfWholeScale(pc('F'))))
    const triads = [
      ['F', 'A', 'C'],
      ['D', 'F#', 'A'],
      ['B', 'D#', 'F#'],
      ['Ab', 'C', 'Eb'],
    ]
    for (const triad of triads) {
      for (const note of triad) {
        expect(scale.has(pcOf(pc(note)))).toBe(true)
      }
    }
  })
})

describe('sixth-diminished collections', () => {
  it('C major sixth-diminished = C–D–E–F–G–A♭–A–B = C6 ∪ B°7', () => {
    expect(names(majorSixthDiminished(pc('C')))).toEqual(['C', 'D', 'E', 'F', 'G', 'A♭', 'A', 'B'])
    const c6 = ['C', 'E', 'G', 'A'].map((n) => pcOf(pc(n)))
    const bdim7 = ['B', 'D', 'F', 'Ab'].map((n) => pcOf(pc(n)))
    const union = new Set([...c6, ...bdim7])
    const collection = new Set(soundingPcs(majorSixthDiminished(pc('C'))))
    expect(collection).toEqual(union)
  })

  it('C minor sixth-diminished = C–D–E♭–F–G–A♭–A–B = Cm6 ∪ B°7', () => {
    expect(names(minorSixthDiminished(pc('C')))).toEqual(['C', 'D', 'E♭', 'F', 'G', 'A♭', 'A', 'B'])
    const cm6 = ['C', 'Eb', 'G', 'A'].map((n) => pcOf(pc(n)))
    const bdim7 = ['B', 'D', 'F', 'Ab'].map((n) => pcOf(pc(n)))
    const union = new Set([...cm6, ...bdim7])
    expect(new Set(soundingPcs(minorSixthDiminished(pc('C'))))).toEqual(union)
  })

  it('transposes sixth-diminished collections with spelling intact', () => {
    expect(names(majorSixthDiminished(pc('F')))).toEqual(['F', 'G', 'A', 'B♭', 'C', 'D♭', 'D', 'E'])
    expect(names(minorSixthDiminished(pc('G')))).toEqual(['G', 'A', 'B♭', 'C', 'D', 'E♭', 'E', 'F♯'])
  })
})
