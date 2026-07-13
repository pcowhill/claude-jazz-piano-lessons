// Compact helpers for authoring lesson examples. Everything resolves to the
// typed music model — no display strings are stored separately from pitches.

import { sps, sp } from '../music/pitch'
import { sym, type ChordKind, type ChordSymbolSpec } from '../music/chord'
import type { ChordEventSpec, MelodyNoteSpec } from '../music/example'

export interface ChordShorthand {
  beats: number
  /** [root, kind, bass?] or null for an unlabeled continuation. */
  sym: [string, ChordKind, string?] | null
  roman?: string
  func?: string
  /** Space-separated bass pitches, e.g. 'C2 G2'. */
  bass: string
  treble: string
  /** Jazz voicing; omitted = same as clear. */
  jbass?: string
  jtreble?: string
  /** Melody entries: ['G4', 1] note, ['r', 1] rest, ['G4', 1, 'tie']. */
  mel?: (readonly [string, number] | readonly [string, number, 'tie'])[]
  /** Space-separated emphasized (guide-tone) pitches. */
  emph?: string
  note?: string
}

export function ch(shorthand: ChordShorthand): ChordEventSpec {
  const symbol: ChordSymbolSpec | null = shorthand.sym
    ? sym(shorthand.sym[0], shorthand.sym[1], shorthand.sym[2])
    : null
  const melody: MelodyNoteSpec[] | undefined = shorthand.mel?.map((entry) => {
    const [pitch, beats, tie] = entry
    if (pitch === 'r') return { beats, rest: true }
    return { pitch: sp(pitch), beats, ...(tie === 'tie' ? { tieToNext: true } : {}) }
  })
  return {
    beats: shorthand.beats,
    symbol,
    roman: shorthand.roman,
    func: shorthand.func,
    clear: { bass: sps(shorthand.bass), treble: sps(shorthand.treble) },
    ...(shorthand.jbass !== undefined || shorthand.jtreble !== undefined
      ? {
          jazz: {
            bass: sps(shorthand.jbass ?? shorthand.bass),
            treble: sps(shorthand.jtreble ?? shorthand.treble),
          },
        }
      : {}),
    ...(melody ? { melody } : {}),
    ...(shorthand.emph ? { emph: sps(shorthand.emph) } : {}),
    ...(shorthand.note ? { note: shorthand.note } : {}),
  }
}

/**
 * Drop-2 a close-position ascending 4-note voicing: the second note from the
 * top moves down an octave. Used for jazz variants of sixth-diminished
 * stacks.
 */
export function drop2(close: string): string {
  const pitches = sps(close)
  if (pitches.length !== 4) throw new Error(`drop2 expects 4 notes: ${close}`)
  const dropped = { ...pitches[2], octave: pitches[2].octave - 1 }
  const rest = [pitches[0], pitches[1], pitches[3]]
  const all = [dropped, ...rest]
  return all
    .map((p) => `${p.letter}${p.alter === -1 ? 'b' : p.alter === 1 ? '#' : p.alter === -2 ? 'bb' : p.alter === 2 ? '##' : ''}${p.octave}`)
    .join(' ')
}
