import { useEffect, useRef } from 'react'
import { useSettings } from './settings'
import { usePlayer } from '../audio/player'

/** Non-modal settings popover anchored under the header. */
export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { prefs, update, reset, reducedMotion } = useSettings()
  const player = usePlayer()
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    firstFieldRef.current?.querySelector<HTMLElement>('button, input, select')?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      restoreFocusRef.current?.focus?.()
    }
  }, [onClose])

  const audioModeText =
    player.audioMode === 'sampled'
      ? 'Sampled piano (Salamander)'
      : player.audioMode === 'synth'
        ? 'Synth piano'
        : player.audioMode === 'unavailable'
          ? 'Audio unavailable in this browser'
          : 'Starts after your first play'

  return (
    <div
      ref={panelRef}
      className="settings"
      role="dialog"
      aria-label="Settings"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="settings__row" ref={firstFieldRef}>
        <span className="settings__label" id="settings-theme-label">
          Theme
        </span>
        <div className="seg" role="group" aria-labelledby="settings-theme-label">
          {(['light', 'system', 'dark'] as const).map((theme) => (
            <button
              key={theme}
              type="button"
              className="seg__option"
              aria-pressed={prefs.theme === theme}
              onClick={() => update({ theme })}
            >
              {theme[0].toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="settings__row">
        <label className="settings__label" htmlFor="settings-volume">
          Volume
        </label>
        <input
          id="settings-volume"
          type="range"
          min={0}
          max={100}
          value={Math.round(prefs.volume * 100)}
          onChange={(e) => update({ volume: Number(e.target.value) / 100 })}
        />
        <span className="settings__value">{Math.round(prefs.volume * 100)}%</span>
      </div>

      <div className="settings__row">
        <label className="settings__label" htmlFor="settings-tempo">
          Default tempo
        </label>
        <input
          id="settings-tempo"
          type="range"
          min={48}
          max={176}
          step={4}
          value={prefs.tempo}
          onChange={(e) => update({ tempo: Number(e.target.value) })}
        />
        <span className="settings__value">{prefs.tempo} BPM</span>
      </div>

      <div className="settings__row">
        <span className="settings__label" id="settings-voicing-label">
          Default voicing
        </span>
        <div className="seg" role="group" aria-labelledby="settings-voicing-label">
          {(['clear', 'jazz'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className="seg__option"
              aria-pressed={prefs.voicing === mode}
              onClick={() => update({ voicing: mode })}
            >
              {mode === 'clear' ? 'Clear' : 'Jazz'}
            </button>
          ))}
        </div>
      </div>

      <div className="settings__row">
        <label className="field field--checkbox">
          <input
            type="checkbox"
            checked={prefs.analysisVisible}
            onChange={(e) => update({ analysisVisible: e.target.checked })}
          />
          Show harmonic analysis (Roman numerals, annotations)
        </label>
      </div>

      <div className="settings__row">
        <label className="field field--checkbox">
          <input
            type="checkbox"
            checked={prefs.noteLabels}
            onChange={(e) => update({ noteLabels: e.target.checked })}
          />
          Label every piano key
        </label>
      </div>

      <div className="settings__row">
        <label className="field field--checkbox">
          <input
            type="checkbox"
            checked={prefs.reduceMotion}
            onChange={(e) => update({ reduceMotion: e.target.checked })}
          />
          Reduce motion
          {reducedMotion && !prefs.reduceMotion && (
            <em className="settings__hint">(already on via system preference)</em>
          )}
        </label>
      </div>

      <div className="settings__row settings__row--footer">
        <span className="settings__meta">Piano sound: {audioModeText}</span>
        <button type="button" className="btn btn--small" onClick={reset}>
          Reset preferences
        </button>
      </div>
    </div>
  )
}
