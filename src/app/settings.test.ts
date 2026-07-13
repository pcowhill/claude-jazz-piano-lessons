import { describe, expect, it } from 'vitest'
import { DEFAULT_PREFERENCES, loadPreferences, savePreferences, STORAGE_KEY } from './settings'

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial))
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    dump: () => Object.fromEntries(map),
  }
}

describe('preference persistence', () => {
  it('returns defaults when storage is empty or unavailable', () => {
    expect(loadPreferences(fakeStorage())).toEqual(DEFAULT_PREFERENCES)
    expect(loadPreferences(null)).toEqual(DEFAULT_PREFERENCES)
  })

  it('round-trips saved preferences', () => {
    const storage = fakeStorage()
    const prefs = { ...DEFAULT_PREFERENCES, theme: 'dark' as const, tempo: 132, voicing: 'jazz' as const }
    savePreferences(storage, prefs)
    expect(loadPreferences(storage)).toEqual(prefs)
  })

  it('falls back to defaults for unknown storage versions', () => {
    const storage = fakeStorage({
      [STORAGE_KEY]: JSON.stringify({ version: 99, prefs: { theme: 'dark' } }),
    })
    expect(loadPreferences(storage)).toEqual(DEFAULT_PREFERENCES)
  })

  it('tolerates corrupted JSON', () => {
    const storage = fakeStorage({ [STORAGE_KEY]: '{not json' })
    expect(loadPreferences(storage)).toEqual(DEFAULT_PREFERENCES)
  })

  it('merges partial payloads and clamps out-of-range values', () => {
    const storage = fakeStorage({
      [STORAGE_KEY]: JSON.stringify({ version: 1, prefs: { tempo: 9999, volume: -2, theme: 'dark' } }),
    })
    const loaded = loadPreferences(storage)
    expect(loaded.theme).toBe('dark')
    expect(loaded.tempo).toBe(208)
    expect(loaded.volume).toBe(0)
    expect(loaded.voicing).toBe(DEFAULT_PREFERENCES.voicing)
  })

  it('ignores invalid enum values', () => {
    const storage = fakeStorage({
      [STORAGE_KEY]: JSON.stringify({ version: 1, prefs: { theme: 'neon', voicing: 'shred' } }),
    })
    const loaded = loadPreferences(storage)
    expect(loaded.theme).toBe(DEFAULT_PREFERENCES.theme)
    expect(loaded.voicing).toBe(DEFAULT_PREFERENCES.voicing)
  })
})
