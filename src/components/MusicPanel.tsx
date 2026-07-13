// The shared interactive example panel: score above keyboard, transport and
// musical controls between them, analysis below. Audio, notation, keyboard
// highlighting, chord symbols and analysis all derive from one rendered
// example, so they cannot drift apart.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { renderExample, type ExampleSpec, type Slice, type VoicingMode } from '../music/example'
import { KEY_CHOICES } from '../music/key'
import { spelledIntervalLabel } from '../music/interval'
import { pcName, pcOf, pitchName } from '../music/pitch'
import { usePlayer } from '../audio/player'
import { useSettings } from '../app/settings'
import { PianoKeyboard } from '../keyboard/PianoKeyboard'
import { rangeForExample } from '../keyboard/geometry'
import { ScoreView } from '../notation/ScoreView'
import { useMeasure } from './useMeasure'
import './panel.css'

export interface MusicPanelProps {
  spec: ExampleSpec
  /** Distinguishes multiple panels sharing one spec. */
  instanceId?: string
  /** Controlled key (explorers that need to react to the key). */
  keyId?: string
  onKeyChange?: (keyId: string) => void
  /** Pitch classes marked as scale tones on the keyboard. */
  scalePcs?: ReadonlySet<number>
  /** Extra content rendered between controls and score (explorer controls). */
  children?: React.ReactNode
}

export function MusicPanel({
  spec,
  instanceId,
  keyId: controlledKeyId,
  onKeyChange,
  scalePcs,
  children,
}: MusicPanelProps) {
  const player = usePlayer()
  const { prefs } = useSettings()
  const reactId = useId()
  const ownerId = `${spec.id}${instanceId ? `:${instanceId}` : ''}:${reactId}`

  const [localKeyId, setLocalKeyId] = useState(spec.initialKeyId ?? spec.homeKey)
  const keyId = controlledKeyId ?? localKeyId
  const setKeyId = useCallback(
    (next: string) => {
      setLocalKeyId(next)
      onKeyChange?.(next)
    },
    [onKeyChange],
  )
  const [octaveShift, setOctaveShift] = useState(0)
  const [voicing, setVoicing] = useState<VoicingMode>(prefs.voicing)
  const [tempo, setTempo] = useState(spec.defaultTempo ?? prefs.tempo)
  const [variantId, setVariantId] = useState<string | null>(spec.variants?.[0]?.id ?? null)
  const [currentSlice, setCurrentSlice] = useState<Slice | null>(null)
  const [analyzeOpen, setAnalyzeOpen] = useState(false)

  const rendered = useMemo(
    () => renderExample(spec, { keyId, voicing, octaveShift, variantId }),
    [spec, keyId, voicing, octaveShift, variantId],
  )

  const playing = player.activeOwner === ownerId

  // Any change that re-renders the music (including a rebuilt spec, as in the
  // reharmonization lab) stops this panel's playback cleanly.
  const renderRef = useRef({ renderKey: `${keyId}|${voicing}|${octaveShift}|${variantId}`, spec })
  const renderKey = `${keyId}|${voicing}|${octaveShift}|${variantId}`
  useEffect(() => {
    if (renderRef.current.renderKey !== renderKey || renderRef.current.spec !== spec) {
      renderRef.current = { renderKey, spec }
      player.stopIfOwner(ownerId)
      setCurrentSlice(null)
    }
  }, [renderKey, spec, ownerId, player])

  // Unmount (collapse, navigation) stops playback.
  useEffect(() => {
    return () => player.stopIfOwner(ownerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const start = useCallback(() => {
    void player.play({
      ownerId,
      attacks: rendered.attacks,
      slices: rendered.slices,
      totalBeats: rendered.totalBeats,
      bpm: tempo,
      onSlice: setCurrentSlice,
      onEnded: () => setCurrentSlice(null),
    })
  }, [player, ownerId, rendered, tempo])

  const togglePlay = useCallback(() => {
    if (playing) {
      player.stop()
    } else {
      start()
    }
  }, [playing, player, start])

  const onTempoChange = useCallback(
    (value: number) => {
      setTempo(value)
      player.updateTempo(ownerId, value)
    },
    [player, ownerId],
  )

  const range = useMemo(
    () => rangeForExample(rendered.minMidi, rendered.maxMidi),
    [rendered.minMidi, rendered.maxMidi],
  )

  const nameForMidi = useCallback(
    (midi: number) => rendered.nameByMidi.get(midi),
    [rendered],
  )

  const [scoreRef, scoreWidth] = useMeasure<HTMLDivElement>()

  const currentChord = currentSlice != null ? rendered.chords[currentSlice.chordIndex] : null
  const activeMidis = useMemo(() => new Set(currentSlice?.midis ?? []), [currentSlice])

  const hasAnalyzeContent =
    rendered.analysis.length > 0 || rendered.chords.some((c) => c.note != null)
  const analyzeId = `${reactId}-analyze`

  return (
    <figure className="panel" data-example-id={spec.id} data-playing={playing || undefined}>
      <figcaption className="panel__head">
        <div className="panel__titles">
          <span className="panel__title">{spec.title}</span>
          <span className="panel__listen">{spec.listen}</span>
        </div>
        {spec.variants && spec.variants.length > 1 && (
          <div className="chip-row panel__variants" role="group" aria-label="Version">
            {spec.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className="chip"
                aria-pressed={variantId === variant.id}
                onClick={() => setVariantId(variant.id)}
              >
                {variant.label}
              </button>
            ))}
          </div>
        )}
      </figcaption>

      <div className="panel__controls">
        <button
          type="button"
          className={`btn ${playing ? '' : 'btn--primary'}`}
          onClick={togglePlay}
          aria-label={playing ? `Stop ${spec.title}` : `Play ${spec.title}`}
        >
          {playing ? '◼ Stop' : '▶ Play'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={start}
          aria-label={`Restart ${spec.title}`}
          title="Restart from the beginning"
        >
          ↺ Restart
        </button>
        <label className="field">
          Tempo
          <input
            type="range"
            min={48}
            max={176}
            step={4}
            value={tempo}
            onChange={(e) => onTempoChange(Number(e.target.value))}
            aria-label={`Tempo for ${spec.title}, beats per minute`}
          />
          <span className="field__value">{tempo}</span>
        </label>
        <label className="field">
          {spec.keyLabel ?? 'Key'}
          <select
            value={keyId}
            onChange={(e) => setKeyId(e.target.value)}
            aria-label={`${spec.keyLabel ?? 'Key'} for ${spec.title}`}
          >
            {KEY_CHOICES.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Register
          <select
            value={octaveShift}
            onChange={(e) => setOctaveShift(Number(e.target.value))}
            aria-label={`Register for ${spec.title}`}
          >
            <option value={1}>Up an octave</option>
            <option value={0}>As written</option>
            <option value={-1}>Down an octave</option>
          </select>
        </label>
        <div className="seg" role="group" aria-label={`Voicing for ${spec.title}`}>
          {(['clear', 'jazz'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className="seg__option"
              aria-pressed={voicing === mode}
              onClick={() => setVoicing(mode)}
            >
              {mode === 'clear' ? 'Clear' : 'Jazz'}
            </button>
          ))}
        </div>
        {hasAnalyzeContent && (
          <button
            type="button"
            className="btn btn--quiet"
            aria-expanded={analyzeOpen}
            aria-controls={analyzeId}
            onClick={() => setAnalyzeOpen((open) => !open)}
          >
            {analyzeOpen ? 'Hide analysis notes' : 'Analyze'}
          </button>
        )}
      </div>

      {children}

      <div ref={scoreRef}>
        <ScoreView
          example={rendered}
          currentSlice={currentSlice}
          showAnalysis={prefs.analysisVisible}
          width={scoreWidth}
        />
      </div>

      <div className="panel__now" aria-live="off">
        <span className="panel__now-label">Now:</span>
        {currentChord ? (
          <>
            <strong>{currentChord.symbolText ?? '—'}</strong>
            {prefs.analysisVisible && currentChord.roman && (
              <span className="panel__now-roman">{currentChord.roman}</span>
            )}
            {prefs.analysisVisible && currentChord.func && (
              <span className="panel__now-func">{currentChord.func}</span>
            )}
          </>
        ) : (
          <span className="panel__now-idle">
            {playing ? '…' : 'press Play, or click any key below'}
          </span>
        )}
      </div>

      <PianoKeyboard
        low={range.low}
        high={range.high}
        activeMidis={activeMidis}
        scalePcs={scalePcs}
        labelMode={prefs.noteLabels ? 'names' : 'c'}
        nameForMidi={nameForMidi}
        onNoteOn={player.noteOn}
        onNoteOff={player.noteOff}
        ariaLabel={`Piano keyboard for ${spec.title}`}
      />

      {analyzeOpen && hasAnalyzeContent && (
        <div className="panel__analyze" id={analyzeId}>
          {rendered.analysis.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <ChordNotes rendered={rendered} />
        </div>
      )}

      <p className="sr-only">
        {spec.textAlt} Currently in the key of {pcName(rendered.tonic)}.
      </p>
    </figure>
  )
}

function ChordNotes({ rendered }: { rendered: ReturnType<typeof renderExample> }) {
  const annotated = rendered.chords.filter((c) => c.note || (c.symbol && c.symbolText))
  if (annotated.length === 0) return null
  return (
    <dl className="panel__chord-notes">
      {rendered.chords.map((chord) => {
        if (!chord.symbolText) return null
        const tones = [...chord.bass, ...chord.treble]
        const root = chord.symbol?.root
        const toneText = root
          ? tones
              .map((n) => `${pitchName(n.pitch)} (${spelledIntervalLabel(root, n.pitch)})`)
              .join(', ')
          : tones.map((n) => pitchName(n.pitch)).join(', ')
        const soundingHints = tones
          .filter((n) => Math.abs(n.pitch.alter) >= 1 && enharmonicHint(n.pitch))
          .map((n) => enharmonicHint(n.pitch))
          .filter((hint, i, arr) => hint && arr.indexOf(hint) === i)
        return (
          <div key={chord.index} className="panel__chord-note">
            <dt>
              {chord.symbolText}
              {chord.roman ? ` — ${chord.roman}` : ''}
            </dt>
            <dd>
              {toneText}
              {soundingHints.length > 0 && <em> · {soundingHints.join('; ')}</em>}
              {chord.note && <span className="panel__chord-comment"> {chord.note}</span>}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

/** 'C♭4, sounding as B in equal temperament' for uncommon spellings. */
function enharmonicHint(pitch: { letter: string; alter: number; octave: number }): string | null {
  if (Math.abs(pitch.alter) < 1) return null
  const p = pitch as import('../music/pitch').Pitch
  const soundingPc = pcOf(p)
  const plain = [
    ['C', 0], ['D', 2], ['E', 4], ['F', 5], ['G', 7], ['A', 9], ['B', 11],
  ].find(([, num]) => num === soundingPc)
  if (!plain) return null // sounds as a black key; the spelling is already informative
  if (Math.abs(pitch.alter) === 1 && plain[0] === pitch.letter) return null
  return `${pcName(p)} sounds as ${plain[0]} in equal temperament`
}
