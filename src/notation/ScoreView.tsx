// VexFlow score renderer. The score derives entirely from the rendered
// example (the same data that drives audio and the keyboard), draws to SVG,
// recolors to currentColor for theme support, and exposes per-event SVG
// groups so playback highlighting is a class toggle — no re-render per beat.

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accidental,
  Barline,
  Beam,
  Dot,
  Formatter,
  Renderer,
  Stave,
  StaveConnector,
  StaveNote,
  StaveTie,
  Voice,
} from 'vexflow'
import type { RenderedExample, Slice } from '../music/example'
import type { Pitch } from '../music/pitch'
import { vexAccidental } from '../music/pitch'
import { buildMeasures, durationForBeats, hasMelody, type NoteStack } from './scoreModel'
import './notation.css'

export interface ScoreViewProps {
  example: RenderedExample
  currentSlice: Slice | null
  /** Hide the roman/function row when global analysis visibility is off. */
  showAnalysis: boolean
  /** Available width in px; the score scrolls horizontally if it needs more. */
  width: number
}

interface OverlayItem {
  chordIndex: number
  x: number
  symbolText: string | null
  roman?: string
}

const TREBLE_Y = 30
const BASS_Y = 136
const GRAND_HEIGHT = 248
const TREBLE_ONLY_HEIGHT = 150
const SYMBOL_ROW = 30
const ROMAN_ROW = 26

function vexKey(p: Pitch): string {
  const acc = vexAccidental(p.alter)
  return `${p.letter.toLowerCase()}${acc ?? ''}/${p.octave}`
}

function makeNote(
  stack: NoteStack,
  clef: 'treble' | 'bass',
  stemDirection?: number,
): StaveNote {
  const { duration, dots } = durationForBeats(stack.beats)
  if (stack.rest) {
    const restKey = clef === 'treble' ? 'b/4' : 'd/3'
    const rest = new StaveNote({ keys: [restKey], duration: `${duration}r`, clef })
    for (let i = 0; i < dots; i++) Dot.buildAndAttach([rest], { all: true })
    return rest
  }
  const note = new StaveNote({
    keys: stack.pitches.map(vexKey),
    duration,
    clef,
    ...(stemDirection !== undefined ? { stem_direction: stemDirection } : {}),
  })
  for (let i = 0; i < dots; i++) Dot.buildAndAttach([note], { all: true })
  return note
}

/** Replace VexFlow's literal colors with currentColor so CSS themes apply. */
function recolorSvg(svg: SVGElement): void {
  svg.querySelectorAll<SVGElement>('[fill]').forEach((el) => {
    if (el.getAttribute('fill') !== 'none') el.setAttribute('fill', 'currentColor')
  })
  svg.querySelectorAll<SVGElement>('[stroke]').forEach((el) => {
    if (el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', 'currentColor')
  })
}

export function ScoreView({ example, currentSlice, showAnalysis, width }: ScoreViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chordElsRef = useRef<Map<number, SVGElement[]>>(new Map())
  const melodyElsRef = useRef<Map<number, SVGElement>>(new Map())
  const [overlay, setOverlay] = useState<OverlayItem[]>([])
  const [renderError, setRenderError] = useState<string | null>(null)

  const measures = useMemo(() => buildMeasures(example), [example])
  const grand = (example.spec.staves ?? 'grand') === 'grand'
  const melodic = hasMelody(measures)
  const height = grand ? GRAND_HEIGHT : TREBLE_ONLY_HEIGHT

  useEffect(() => {
    const container = containerRef.current
    if (!container || width <= 0) return
    container.innerHTML = ''
    chordElsRef.current = new Map()
    melodyElsRef.current = new Map()

    try {
      // ----- measure widths -----
      const sigAccidentals = Math.min(7, countKeySignatureAccidentals(example.keySignature))
      const firstExtra = 74 + sigAccidentals * 10 + 26 // clef + signature + time signature
      const widths = measures.map((m) => {
        const units = Math.max(
          m.trebleStacks.length + (melodic ? m.melodyStacks.length : 0) * 0.6,
          m.bassStacks.length,
          1,
        )
        return 34 + units * 58
      })
      let total = widths.reduce((a, b) => a + b, 0) + firstExtra
      const available = Math.max(width - 4, 320)
      if (total < available * 0.72) {
        // Stretch modest scores to breathe.
        const scale = Math.min(1.45, (available * 0.94) / total)
        widths.forEach((_, i) => (widths[i] = widths[i] * scale))
        total = widths.reduce((a, b) => a + b, 0) + firstExtra
      } else if (total > available) {
        const minWidths = measures.map((m) => {
          const units = Math.max(m.trebleStacks.length, m.bassStacks.length, 1)
          return 30 + units * 34
        })
        const minTotal = minWidths.reduce((a, b) => a + b, 0) + firstExtra
        if (minTotal < available) {
          const scale = (available - firstExtra) / (total - firstExtra)
          widths.forEach((w, i) => (widths[i] = Math.max(minWidths[i], w * scale)))
        } else {
          widths.forEach((_, i) => (widths[i] = minWidths[i]))
        }
        total = widths.reduce((a, b) => a + b, 0) + firstExtra
      }

      const svgWidth = Math.ceil(total + 6)
      const renderer = new Renderer(container, Renderer.Backends.SVG)
      renderer.resize(svgWidth, height)
      const ctx = renderer.getContext()

      const overlayItems: OverlayItem[] = []
      const pendingTies: {
        from: StaveNote
        fromMeasure: number
        toStart: number
      }[] = []
      const melodyNoteByStart = new Map<number, StaveNote>()

      let x = 2
      measures.forEach((measure, mi) => {
        const isFirst = mi === 0
        const isLast = mi === measures.length - 1
        const staveWidth = widths[mi] + (isFirst ? firstExtra : 0)

        const treble = new Stave(x, TREBLE_Y, staveWidth)
        if (isFirst) {
          treble.addClef('treble').addKeySignature(example.keySignature).addTimeSignature('4/4')
        }
        if (isLast) treble.setEndBarType(Barline.type.END)
        treble.setContext(ctx).draw()

        let bass: Stave | null = null
        if (grand) {
          bass = new Stave(x, BASS_Y, staveWidth)
          if (isFirst) {
            bass.addClef('bass').addKeySignature(example.keySignature).addTimeSignature('4/4')
          }
          if (isLast) bass.setEndBarType(Barline.type.END)
          bass.setContext(ctx).draw()
          if (isFirst) {
            new StaveConnector(treble, bass).setType('brace').setContext(ctx).draw()
          }
          new StaveConnector(treble, bass).setType('singleLeft').setContext(ctx).draw()
          if (isLast) {
            new StaveConnector(treble, bass).setType('boldDoubleRight').setContext(ctx).draw()
          }
        }

        // ----- voices -----
        const chordStemDown = melodic && measure.melodyStacks.length > 0
        const trebleChordNotes = measure.trebleStacks.map((stack) =>
          makeNote(stack, 'treble', chordStemDown ? -1 : undefined),
        )
        const melodyNotes = measure.melodyStacks.map((stack) => makeNote(stack, 'treble', 1))
        const bassNotes = grand ? measure.bassStacks.map((stack) => makeNote(stack, 'bass')) : []

        const voices: Voice[] = []
        const trebleVoices: Voice[] = []
        const trebleChordVoice = new Voice({ num_beats: measure.beats, beat_value: 4 })
        trebleChordVoice.addTickables(trebleChordNotes)
        trebleVoices.push(trebleChordVoice)
        voices.push(trebleChordVoice)

        let melodyVoice: Voice | null = null
        if (measure.melodyStacks.length > 0) {
          melodyVoice = new Voice({ num_beats: measure.beats, beat_value: 4 })
          melodyVoice.addTickables(melodyNotes)
          trebleVoices.push(melodyVoice)
          voices.push(melodyVoice)
        }

        let bassVoice: Voice | null = null
        if (bass) {
          bassVoice = new Voice({ num_beats: measure.beats, beat_value: 4 })
          bassVoice.addTickables(bassNotes)
          voices.push(bassVoice)
        }

        Accidental.applyAccidentals(voices, example.keySignature)

        const beams = melodyVoice
          ? Beam.generateBeams(
              melodyNotes.filter((n) => !n.isRest()),
              { maintain_stem_directions: true, beam_rests: false },
            )
          : []

        const formatter = new Formatter()
        formatter.joinVoices(trebleVoices)
        if (bassVoice) formatter.joinVoices([bassVoice])
        formatter.formatToStave(voices, treble)

        trebleChordVoice.draw(ctx, treble)
        melodyVoice?.draw(ctx, treble)
        if (bassVoice && bass) bassVoice.draw(ctx, bass)
        beams.forEach((beam) => beam.setContext(ctx).draw())

        // ----- collect highlight targets + overlay anchors -----
        measure.trebleStacks.forEach((stack, i) => {
          const el = trebleChordNotes[i].getSVGElement()
          if (el) {
            const list = chordElsRef.current.get(stack.chordIndex) ?? []
            list.push(el)
            chordElsRef.current.set(stack.chordIndex, list)
          }
        })
        measure.bassStacks.forEach((stack, i) => {
          const el = bassNotes[i]?.getSVGElement()
          if (el) {
            const list = chordElsRef.current.get(stack.chordIndex) ?? []
            list.push(el)
            chordElsRef.current.set(stack.chordIndex, list)
          }
        })
        measure.melodyStacks.forEach((stack, i) => {
          if (stack.rest) return
          const note = melodyNotes[i]
          const el = note.getSVGElement()
          if (el) melodyElsRef.current.set(stack.startBeats, el)
          melodyNoteByStart.set(stack.startBeats, note)
          if (stack.tieToNext) {
            pendingTies.push({ from: note, fromMeasure: mi, toStart: stack.startBeats + stack.beats })
          }
        })

        // Guide-tone emphasis: mark individual noteheads.
        measure.trebleStacks.forEach((stack, i) => {
          markEmphasis(trebleChordNotes[i], stack)
        })
        measure.bassStacks.forEach((stack, i) => {
          if (bassNotes[i]) markEmphasis(bassNotes[i], stack)
        })

        for (const anchor of measure.anchors) {
          const stackIndex = measure.trebleStacks.findIndex((s) => s.chordIndex === anchor.chordIndex)
          const anchorNote =
            stackIndex >= 0 && !measure.trebleStacks[stackIndex].rest
              ? trebleChordNotes[stackIndex]
              : (bassNotes[measure.bassStacks.findIndex((s) => s.chordIndex === anchor.chordIndex)] ??
                trebleChordNotes[stackIndex] ??
                melodyNoteByStart.get(anchor.startBeats))
          const anchorX = anchorNote ? anchorNote.getAbsoluteX() : x + 8
          overlayItems.push({
            chordIndex: anchor.chordIndex,
            x: anchorX,
            symbolText: anchor.symbolText,
            roman: anchor.roman,
          })
        }

        x += staveWidth
      })

      // Ties (within and across measures).
      for (const tie of pendingTies) {
        const to = melodyNoteByStart.get(tie.toStart)
        if (!to) continue
        new StaveTie({ first_note: tie.from, last_note: to, first_indices: [0], last_indices: [0] })
          .setContext(ctx)
          .draw()
      }

      const svg = container.querySelector('svg')
      if (svg) {
        recolorSvg(svg)
        svg.setAttribute('role', 'img')
        svg.setAttribute('aria-label', `Notation: ${example.spec.title}`)
      }
      setOverlay(overlayItems)
      setRenderError(null)
    } catch (error) {
      console.error(`Score render failed for ${example.spec.id}`, error)
      setRenderError('The notation for this example could not be rendered.')
    }
  }, [example, measures, grand, melodic, width, height])

  // Playback highlighting: class toggles only.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.querySelectorAll('.jpta-current').forEach((el) => el.classList.remove('jpta-current'))
    if (!currentSlice) return
    const els = chordElsRef.current.get(currentSlice.chordIndex) ?? []
    els.forEach((el) => el.classList.add('jpta-current'))
    const melodyEl = melodyElsRef.current.get(currentSlice.startBeats)
    melodyEl?.classList.add('jpta-current')
  }, [currentSlice, overlay])

  if (renderError) {
    return (
      <div className="score score--error" role="note">
        {renderError}
      </div>
    )
  }

  return (
    <div className="score">
      <div className="score__scroll">
        <div
          className="score__inner"
          style={{ paddingTop: SYMBOL_ROW, paddingBottom: showAnalysis ? ROMAN_ROW : 6 }}
        >
          <div className="score__svg" ref={containerRef} />
          <div className="score__overlay score__overlay--symbols" aria-hidden="true">
            {overlay.map(
              (item) =>
                item.symbolText && (
                  <span
                    key={`sym-${item.chordIndex}`}
                    className="score__symbol"
                    data-chord-index={item.chordIndex}
                    data-current={
                      currentSlice?.chordIndex === item.chordIndex ? 'true' : undefined
                    }
                    style={{ left: item.x - 6 }}
                  >
                    {item.symbolText}
                  </span>
                ),
            )}
          </div>
          {showAnalysis && (
            <div className="score__overlay score__overlay--romans" aria-hidden="true">
              {overlay.map(
                (item) =>
                  item.roman && (
                    <span
                      key={`rom-${item.chordIndex}`}
                      className="score__roman"
                      data-current={
                        currentSlice?.chordIndex === item.chordIndex ? 'true' : undefined
                      }
                      style={{ left: item.x - 6 }}
                    >
                      {item.roman}
                    </span>
                  ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function markEmphasis(note: StaveNote, stack: NoteStack): void {
  if (!stack.emph.some(Boolean) || stack.rest) return
  stack.emph.forEach((isEmph, pitchIndex) => {
    if (!isEmph) return
    const heads = (note as unknown as { noteHeads?: { getSVGElement?: () => SVGElement | undefined }[] })
      .noteHeads
    const head = heads?.[pitchIndex]
    const el = head?.getSVGElement?.()
    if (el) el.classList.add('jpta-emph')
  })
}

function countKeySignatureAccidentals(keySignature: string): number {
  const counts: Record<string, number> = {
    C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, 'C#': 7,
    F: 1, Bb: 2, Eb: 3, Ab: 4, Db: 5, Gb: 6, Cb: 7,
  }
  return counts[keySignature] ?? 4
}
