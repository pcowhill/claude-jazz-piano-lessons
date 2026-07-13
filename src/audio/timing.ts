// Pure timing math shared by the playback coordinator and tests.

/** Seconds occupied by `beats` quarter-note beats at `bpm`. */
export function beatsToSeconds(beats: number, bpm: number): number {
  return (beats * 60) / bpm
}

/** Transport ticks for a beat position (quarter note = ppq ticks). */
export function beatsToTicks(beats: number, ppq: number): number {
  return Math.round(beats * ppq)
}

/** Tone.js tick-notation string, e.g. '384i'. */
export function ticksNotation(beats: number, ppq: number): string {
  return `${beatsToTicks(beats, ppq)}i`
}
