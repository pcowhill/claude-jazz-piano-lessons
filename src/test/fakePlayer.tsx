// A stateful in-memory PlayerAPI for component tests: records calls, tracks
// the active owner, and never touches an AudioContext.

import { useMemo, useState, type ReactNode } from 'react'
import { vi } from 'vitest'
import { PlayerContext, type PlayerAPI, type PlayRequest } from '../audio/player'

export interface FakePlayerHandle {
  calls: {
    play: PlayRequest[]
    noteOn: number[]
    noteOff: number[]
    sound: number[][]
    stop: number
    stopIfOwner: string[]
  }
  /** Drive a slice callback as if playback advanced. */
  emitSlice(index: number): void
  endPlayback(): void
}

export function makeFakePlayer(): {
  Provider: (props: { children: ReactNode }) => React.JSX.Element
  handle: FakePlayerHandle
} {
  const calls: FakePlayerHandle['calls'] = {
    play: [],
    noteOn: [],
    noteOff: [],
    sound: [],
    stop: 0,
    stopIfOwner: [],
  }
  let activeRequest: PlayRequest | null = null
  let setActiveOwnerState: ((owner: string | null) => void) | null = null

  const handle: FakePlayerHandle = {
    calls,
    emitSlice(index: number) {
      const request = activeRequest
      if (request) request.onSlice(request.slices[index] ?? null)
    },
    endPlayback() {
      const request = activeRequest
      activeRequest = null
      setActiveOwnerState?.(null)
      if (request) {
        request.onSlice(null)
        request.onEnded()
      }
    },
  }

  function Provider({ children }: { children: ReactNode }) {
    const [activeOwner, setActiveOwner] = useState<string | null>(null)
    setActiveOwnerState = setActiveOwner
    const api = useMemo<PlayerAPI>(
      () => ({
        activeOwner,
        audioMode: 'synth',
        play: vi.fn(async (request: PlayRequest) => {
          if (activeRequest && activeRequest.ownerId !== request.ownerId) {
            activeRequest.onSlice(null)
            activeRequest.onEnded()
          }
          calls.play.push(request)
          activeRequest = request
          setActiveOwner(request.ownerId)
        }),
        stop: vi.fn(() => {
          calls.stop += 1
          const request = activeRequest
          activeRequest = null
          setActiveOwner(null)
          if (request) {
            request.onSlice(null)
            request.onEnded()
          }
        }),
        stopIfOwner: vi.fn((ownerId: string) => {
          calls.stopIfOwner.push(ownerId)
          if (activeRequest?.ownerId === ownerId) {
            const request = activeRequest
            activeRequest = null
            setActiveOwner(null)
            request.onSlice(null)
            request.onEnded()
          }
        }),
        updateTempo: vi.fn(),
        noteOn: vi.fn((midi: number) => {
          calls.noteOn.push(midi)
        }),
        noteOff: vi.fn((midi: number) => {
          calls.noteOff.push(midi)
        }),
        sound: vi.fn((midis: number[]) => {
          calls.sound.push(midis)
        }),
        setVolume: vi.fn(),
      }),
      [activeOwner],
    )
    return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>
  }

  return { Provider, handle }
}
