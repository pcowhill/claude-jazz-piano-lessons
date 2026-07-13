// Reusable piano keyboard. Every visible key is a real button with an
// accessible name; pointer presses play notes (free play), and an optional
// toggle mode turns the keyboard into a note-selection surface for exercises.
// Focus uses a roving tabindex so the keyboard adds one tab stop, not fifty.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { keyboardLayout } from './geometry'
import { defaultSpelling, pitchName, spokenPitchName } from '../music/pitch'
import { useMeasure } from '../components/useMeasure'
import './keyboard.css'

export interface PianoKeyboardProps {
  low: number
  high: number
  /** Currently sounding notes (scored playback or app-driven highlights). */
  activeMidis?: ReadonlySet<number>
  /** Persistently selected notes (exercise build mode). */
  selectedMidis?: ReadonlySet<number>
  /** Pitch classes to mark as scale tones (dot markers). */
  scalePcs?: ReadonlySet<number>
  /** 'c' shows octave labels on C keys only; 'names' labels every key. */
  labelMode?: 'c' | 'names'
  /** Contextual spelling for labels/accessible names, by midi. */
  nameForMidi?: (midi: number) => string | undefined
  onNoteOn?: (midi: number) => void
  onNoteOff?: (midi: number) => void
  /** When set, clicks toggle selection (notes still sound via onNoteOn/Off). */
  onToggle?: (midi: number) => void
  ariaLabel?: string
  /** Compact keyboards (exercises) use smaller keys. */
  compact?: boolean
}

const MAX_WHITE_WIDTH = 46
const MIN_WHITE_WIDTH = 22

export function PianoKeyboard({
  low,
  high,
  activeMidis,
  selectedMidis,
  scalePcs,
  labelMode = 'c',
  nameForMidi,
  onNoteOn,
  onNoteOff,
  onToggle,
  ariaLabel = 'Piano keyboard',
  compact = false,
}: PianoKeyboardProps) {
  const layout = useMemo(() => keyboardLayout(low, high), [low, high])
  const [containerRef, containerWidth] = useMeasure<HTMLDivElement>()
  const [pressed, setPressed] = useState<ReadonlySet<number>>(new Set())
  const pressedRef = useRef<Set<number>>(new Set())
  const allKeys = useMemo(() => {
    const keys = [
      ...layout.whites.map((k) => k.midi),
      ...layout.blacks.map((k) => k.midi),
    ].sort((a, b) => a - b)
    return keys
  }, [layout])
  const [focusMidi, setFocusMidi] = useState<number | null>(null)
  const effectiveFocus = focusMidi != null && allKeys.includes(focusMidi) ? focusMidi : allKeys[0]

  const whiteWidth = Math.max(
    MIN_WHITE_WIDTH,
    Math.min(MAX_WHITE_WIDTH, containerWidth > 0 ? containerWidth / layout.whiteCount : MAX_WHITE_WIDTH),
  )
  const whiteHeight = compact ? whiteWidth * 3.9 : whiteWidth * 4.4
  const blackWidth = whiteWidth * 0.6
  const blackHeight = whiteHeight * 0.62
  const totalWidth = layout.whiteCount * whiteWidth

  const nameOf = useCallback(
    (midi: number): string => nameForMidi?.(midi) ?? pitchName(defaultSpelling(midi)),
    [nameForMidi],
  )
  const spokenOf = useCallback(
    (midi: number): string => {
      const contextual = nameForMidi?.(midi)
      if (contextual) return contextual
      return spokenPitchName(defaultSpelling(midi))
    },
    [nameForMidi],
  )

  const press = useCallback(
    (midi: number) => {
      if (pressedRef.current.has(midi)) return
      pressedRef.current.add(midi)
      setPressed(new Set(pressedRef.current))
      onNoteOn?.(midi)
    },
    [onNoteOn],
  )

  const release = useCallback(
    (midi: number) => {
      if (!pressedRef.current.has(midi)) return
      pressedRef.current.delete(midi)
      setPressed(new Set(pressedRef.current))
      onNoteOff?.(midi)
    },
    [onNoteOff],
  )

  // Never leave notes hanging if the pointer is released outside a key.
  useEffect(() => {
    const releaseAll = () => {
      if (pressedRef.current.size === 0) return
      for (const midi of pressedRef.current) onNoteOff?.(midi)
      pressedRef.current.clear()
      setPressed(new Set())
    }
    window.addEventListener('pointerup', releaseAll)
    window.addEventListener('pointercancel', releaseAll)
    window.addEventListener('blur', releaseAll)
    return () => {
      window.removeEventListener('pointerup', releaseAll)
      window.removeEventListener('pointercancel', releaseAll)
      window.removeEventListener('blur', releaseAll)
      releaseAll()
    }
  }, [onNoteOff])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, midi: number) => {
      const index = allKeys.indexOf(midi)
      const move = (next: number | undefined) => {
        if (next == null) return
        event.preventDefault()
        setFocusMidi(next)
        const el = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
          `[data-midi="${next}"]`,
        )
        el?.focus()
      }
      switch (event.key) {
        case 'ArrowRight':
          move(allKeys[index + 1])
          break
        case 'ArrowLeft':
          move(allKeys[index - 1])
          break
        case 'Home':
          move(allKeys[0])
          break
        case 'End':
          move(allKeys[allKeys.length - 1])
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (onToggle) {
            onToggle(midi)
          } else if (!event.repeat) {
            press(midi)
          }
          break
      }
    },
    [allKeys, onToggle, press],
  )

  const onKeyUp = useCallback(
    (event: React.KeyboardEvent, midi: number) => {
      if ((event.key === 'Enter' || event.key === ' ') && !onToggle) {
        release(midi)
      }
    },
    [onToggle, release],
  )

  const renderKey = (midi: number, style: React.CSSProperties, isBlack: boolean) => {
    const active = activeMidis?.has(midi) || pressed.has(midi)
    const selected = selectedMidis?.has(midi) ?? false
    const scaleTone = scalePcs?.has(((midi % 12) + 12) % 12) ?? false
    const name = nameOf(midi)
    const isC = ((midi % 12) + 12) % 12 === 0
    const showLabel = labelMode === 'names' || (labelMode === 'c' && isC && !isBlack)
    const className = [
      'piano-key',
      isBlack ? 'piano-key--black' : 'piano-key--white',
      active ? 'is-active' : '',
      selected ? 'is-selected' : '',
    ]
      .filter(Boolean)
      .join(' ')
    return (
      <button
        key={midi}
        type="button"
        className={className}
        style={style}
        data-midi={midi}
        tabIndex={midi === effectiveFocus ? 0 : -1}
        aria-label={`${spokenOf(midi)} piano key`}
        {...(onToggle ? { 'aria-pressed': selected } : {})}
        onPointerDown={(e) => {
          e.preventDefault()
          setFocusMidi(midi)
          if (onToggle) {
            onToggle(midi)
            onNoteOn?.(midi)
            window.setTimeout(() => onNoteOff?.(midi), 350)
          } else {
            press(midi)
          }
        }}
        onPointerUp={() => !onToggle && release(midi)}
        onPointerLeave={() => !onToggle && release(midi)}
        onKeyDown={(e) => onKeyDown(e, midi)}
        onKeyUp={(e) => onKeyUp(e, midi)}
        onFocus={() => setFocusMidi(midi)}
      >
        {scaleTone && <span className="piano-key__scale-dot" aria-hidden="true" />}
        {showLabel && (
          <span className="piano-key__label" aria-hidden="true">
            {name}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className={`piano ${compact ? 'piano--compact' : ''}`} ref={containerRef}>
      <div
        className="piano__keys"
        role="group"
        aria-label={ariaLabel}
        style={{ width: totalWidth, height: whiteHeight }}
      >
        {layout.whites.map((key) =>
          renderKey(
            key.midi,
            {
              left: key.index * whiteWidth,
              width: whiteWidth,
              height: whiteHeight,
            },
            false,
          ),
        )}
        {layout.blacks.map((key) =>
          renderKey(
            key.midi,
            {
              left: key.center * whiteWidth - blackWidth / 2,
              width: blackWidth,
              height: blackHeight,
            },
            true,
          ),
        )}
      </div>
    </div>
  )
}
