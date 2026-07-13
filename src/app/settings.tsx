// Lightweight preference persistence. One versioned localStorage key; no
// accounts, progress tracking or analytics — exercise state intentionally
// resets on reload.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { VoicingMode } from '../music/example'

export interface Preferences {
  theme: 'light' | 'dark' | 'system'
  /** Master volume 0–1. */
  volume: number
  /** Default tempo for examples, BPM. */
  tempo: number
  voicing: VoicingMode
  analysisVisible: boolean
  noteLabels: boolean
  /** Force reduced motion. The OS preference is always respected regardless. */
  reduceMotion: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  volume: 0.8,
  tempo: 96,
  voicing: 'clear',
  analysisVisible: true,
  noteLabels: false,
  reduceMotion: false,
}

export const STORAGE_KEY = 'jpta:prefs'
const STORAGE_VERSION = 1

interface StoredPayload {
  version: number
  prefs: Partial<Preferences>
}

function isVoicing(v: unknown): v is VoicingMode {
  return v === 'clear' || v === 'jazz'
}

function isTheme(v: unknown): v is Preferences['theme'] {
  return v === 'light' || v === 'dark' || v === 'system'
}

function clampNumber(v: unknown, min: number, max: number, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback
}

/** Load preferences, tolerating missing keys, bad JSON and unknown versions. */
export function loadPreferences(storage: Pick<Storage, 'getItem'> | null): Preferences {
  const defaults = { ...DEFAULT_PREFERENCES }
  if (!storage) return defaults
  let raw: string | null = null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return defaults
  }
  if (!raw) return defaults
  try {
    const payload = JSON.parse(raw) as StoredPayload
    if (payload.version !== STORAGE_VERSION || typeof payload.prefs !== 'object' || !payload.prefs) {
      return defaults
    }
    const p = payload.prefs
    return {
      theme: isTheme(p.theme) ? p.theme : defaults.theme,
      volume: clampNumber(p.volume, 0, 1, defaults.volume),
      tempo: clampNumber(p.tempo, 40, 208, defaults.tempo),
      voicing: isVoicing(p.voicing) ? p.voicing : defaults.voicing,
      analysisVisible: typeof p.analysisVisible === 'boolean' ? p.analysisVisible : defaults.analysisVisible,
      noteLabels: typeof p.noteLabels === 'boolean' ? p.noteLabels : defaults.noteLabels,
      reduceMotion: typeof p.reduceMotion === 'boolean' ? p.reduceMotion : defaults.reduceMotion,
    }
  } catch {
    return defaults
  }
}

export function savePreferences(storage: Pick<Storage, 'setItem'> | null, prefs: Preferences): void {
  if (!storage) return
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, prefs }))
  } catch {
    // Storage may be unavailable (private mode); preferences simply don't persist.
  }
}

export interface SettingsAPI {
  prefs: Preferences
  update(partial: Partial<Preferences>): void
  reset(): void
  /** OS reduced-motion preference OR user override. */
  reducedMotion: boolean
  /** Resolved theme after applying the system preference. */
  resolvedTheme: 'light' | 'dark'
}

const SettingsContext = createContext<SettingsAPI | null>(null)

export function useSettings(): SettingsAPI {
  const api = useContext(SettingsContext)
  if (!api) throw new Error('useSettings must be used within a SettingsProvider')
  return api
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(() =>
    loadPreferences(typeof window !== 'undefined' ? window.localStorage : null),
  )

  const update = useCallback((partial: Partial<Preferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial }
      savePreferences(window.localStorage, next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const next = { ...DEFAULT_PREFERENCES }
    savePreferences(window.localStorage, next)
    setPrefs(next)
  }, [])

  const osDark = useMediaQuery('(prefers-color-scheme: dark)')
  const osReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const resolvedTheme: 'light' | 'dark' = prefs.theme === 'system' ? (osDark ? 'dark' : 'light') : prefs.theme
  const reducedMotion = osReducedMotion || prefs.reduceMotion

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
  }, [reducedMotion])

  const api = useMemo<SettingsAPI>(
    () => ({ prefs, update, reset, reducedMotion, resolvedTheme }),
    [prefs, update, reset, reducedMotion, resolvedTheme],
  )

  return <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>
}
