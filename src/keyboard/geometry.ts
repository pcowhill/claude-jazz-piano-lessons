// Piano keyboard geometry in white-key units. Black keys use realistic
// offsets (grouped 2+3) rather than naive midpoints.

export interface WhiteKey {
  midi: number
  /** 0-based white index from the left edge. */
  index: number
}

export interface BlackKey {
  midi: number
  /** Center x in white-key units from the left edge. */
  center: number
}

export interface KeyboardLayout {
  whites: WhiteKey[]
  blacks: BlackKey[]
  whiteCount: number
  lowMidi: number
  highMidi: number
}

const WHITE_PCS = new Set([0, 2, 4, 5, 7, 9, 11])

export function isWhiteMidi(midi: number): boolean {
  return WHITE_PCS.has(((midi % 12) + 12) % 12)
}

/** Offset of a black key's center from the start of its octave, in white units. */
const BLACK_CENTER_IN_OCTAVE: Record<number, number> = {
  1: 0.95, // C♯ leans left of the C/D boundary
  3: 2.05, // D♯ leans right
  6: 3.92, // F♯ leans left
  8: 5.0, // G♯ centered
  10: 6.08, // A♯ leans right
}

function snapDownToWhite(midi: number): number {
  let m = midi
  while (!isWhiteMidi(m)) m--
  return m
}

function snapUpToWhite(midi: number): number {
  let m = midi
  while (!isWhiteMidi(m)) m++
  return m
}

/** White keys strictly between two white midis (inclusive). */
function whiteIndexFrom(low: number, midi: number): number {
  let count = 0
  for (let m = low; m < midi; m++) {
    if (isWhiteMidi(m)) count++
  }
  return count
}

/**
 * Compute a layout covering [low, high], snapped outward to white keys and
 * clamped to a sensible piano compass (A0–C8).
 */
export function keyboardLayout(low: number, high: number): KeyboardLayout {
  const lowMidi = Math.max(21, snapDownToWhite(Math.min(low, high)))
  const highMidi = Math.min(108, snapUpToWhite(Math.max(low, high)))
  const whites: WhiteKey[] = []
  const blacks: BlackKey[] = []
  for (let midi = lowMidi; midi <= highMidi; midi++) {
    if (isWhiteMidi(midi)) {
      whites.push({ midi, index: whiteIndexFrom(lowMidi, midi) })
    } else {
      const pcNum = ((midi % 12) + 12) % 12
      const octaveStartMidi = midi - pcNum // the C below
      const cIndex = whiteIndexFrom(lowMidi, Math.max(octaveStartMidi, lowMidi))
      // If the layout starts mid-octave the C below may be off the left edge;
      // compute its virtual index instead.
      const virtualCIndex =
        octaveStartMidi >= lowMidi ? cIndex : -whiteIndexFrom(octaveStartMidi, lowMidi)
      blacks.push({ midi, center: virtualCIndex + BLACK_CENTER_IN_OCTAVE[pcNum] })
    }
  }
  return { whites, blacks, whiteCount: whites.length, lowMidi, highMidi }
}

/**
 * Pick a display range for an example: cover [minMidi, maxMidi] with a small
 * margin, at least two octaves, expanded to C boundaries where practical.
 */
export function rangeForExample(minMidi: number, maxMidi: number): { low: number; high: number } {
  let low = minMidi - 2
  let high = maxMidi + 2
  // Expand down/up to the nearest C for tidy octave labeling.
  while (((low % 12) + 12) % 12 !== 0 && low > 21) low--
  while (((high % 12) + 12) % 12 !== 4 && high < 108) high++ // land on an E for a margin above the C
  if (high - low < 24) {
    const deficit = 24 - (high - low)
    low -= Math.floor(deficit / 2)
    high += Math.ceil(deficit / 2)
    while (((low % 12) + 12) % 12 !== 0 && low > 21) low--
  }
  return { low: Math.max(21, low), high: Math.min(108, high) }
}
