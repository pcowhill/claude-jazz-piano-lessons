// Playback coordinator. One example may play at a time; starting a new one
// cleanly cancels the previous schedule, releases its notes and clears its
// highlights. All Tone.js access happens after an explicit user gesture.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Attack, Slice } from '../music/example'
import { createPianoEngine, type AudioMode, type PianoEngine } from './engine'
import { beatsToSeconds, ticksNotation } from './timing'

export interface PlayRequest {
  ownerId: string
  attacks: Attack[]
  slices: Slice[]
  totalBeats: number
  bpm: number
  onSlice: (slice: Slice | null) => void
  onEnded: () => void
}

export interface PlayerAPI {
  /** ownerId of the example currently playing, or null. */
  activeOwner: string | null
  /** 'pending' until the first user gesture initializes audio. */
  audioMode: AudioMode | 'pending' | 'unavailable'
  play(request: PlayRequest): Promise<void>
  stop(): void
  stopIfOwner(ownerId: string): void
  updateTempo(ownerId: string, bpm: number): void
  /** Free-play: press and release a single key. */
  noteOn(midi: number): void
  noteOff(midi: number): void
  /** One-shot chord/arpeggio for exercises and explorers. */
  sound(midis: number[], durationSec?: number): void
  setVolume(volume: number): void
}

const PlayerContext = createContext<PlayerAPI | null>(null)

export function usePlayer(): PlayerAPI {
  const api = useContext(PlayerContext)
  if (!api) throw new Error('usePlayer must be used within a PlayerProvider')
  return api
}

type ToneModule = typeof import('tone')

interface ActivePlayback {
  ownerId: string
  part: import('tone').Part
  onSlice: (slice: Slice | null) => void
  onEnded: () => void
}

interface AudioRuntime {
  Tone: ToneModule
  engine: PianoEngine
}

export function PlayerProvider({
  children,
  volume,
}: {
  children: ReactNode
  volume: number
}) {
  const [activeOwner, setActiveOwner] = useState<string | null>(null)
  const [audioMode, setAudioMode] = useState<PlayerAPI['audioMode']>('pending')
  const runtimeRef = useRef<AudioRuntime | null>(null)
  const runtimePromiseRef = useRef<Promise<AudioRuntime | null> | null>(null)
  const activeRef = useRef<ActivePlayback | null>(null)
  const volumeRef = useRef(volume)

  const ensureAudio = useCallback(async (): Promise<AudioRuntime | null> => {
    if (runtimeRef.current) return runtimeRef.current
    if (!runtimePromiseRef.current) {
      runtimePromiseRef.current = (async () => {
        try {
          const Tone = await import('tone')
          await Tone.start()
          const engine = await createPianoEngine(Tone)
          engine.setVolume(volumeRef.current)
          const runtime = { Tone, engine }
          runtimeRef.current = runtime
          setAudioMode(engine.mode)
          return runtime
        } catch (error) {
          console.error('Audio initialization failed', error)
          setAudioMode('unavailable')
          return null
        }
      })()
    }
    return runtimePromiseRef.current
  }, [])

  const haltActive = useCallback((runtime: AudioRuntime | null) => {
    const active = activeRef.current
    if (!active) return
    activeRef.current = null
    if (runtime) {
      const transport = runtime.Tone.getTransport()
      transport.stop()
      transport.cancel(0)
      runtime.engine.releaseAll()
    }
    active.part.dispose()
    active.onSlice(null)
    active.onEnded()
    setActiveOwner(null)
  }, [])

  const stop = useCallback(() => {
    haltActive(runtimeRef.current)
  }, [haltActive])

  const stopIfOwner = useCallback(
    (ownerId: string) => {
      if (activeRef.current?.ownerId === ownerId) haltActive(runtimeRef.current)
    },
    [haltActive],
  )

  const play = useCallback(
    async (request: PlayRequest) => {
      const runtime = await ensureAudio()
      if (!runtime) return
      const { Tone, engine } = runtime
      haltActive(runtime)

      const transport = Tone.getTransport()
      transport.bpm.value = request.bpm
      transport.position = 0
      const ppq = transport.PPQ
      const draw = Tone.getDraw()

      type PartEvent =
        | { kind: 'attack'; attack: Attack }
        | { kind: 'slice'; slice: Slice }
        | { kind: 'end' }
      const events: [string, PartEvent][] = []
      for (const attack of request.attacks) {
        events.push([ticksNotation(attack.startBeats, ppq), { kind: 'attack', attack }])
      }
      for (const slice of request.slices) {
        events.push([ticksNotation(slice.startBeats, ppq), { kind: 'slice', slice }])
      }
      events.push([ticksNotation(request.totalBeats, ppq), { kind: 'end' }])

      const part = new Tone.Part<PartEvent>((time, event) => {
        if (event.kind === 'attack') {
          const seconds = beatsToSeconds(event.attack.beats, transport.bpm.value)
          engine.attackRelease(event.attack.midis, seconds * 0.98, time, event.attack.velocity)
        } else if (event.kind === 'slice') {
          draw.schedule(() => {
            if (activeRef.current?.ownerId === request.ownerId) {
              request.onSlice(event.slice)
            }
          }, time)
        } else {
          draw.schedule(() => {
            if (activeRef.current?.ownerId === request.ownerId) {
              activeRef.current = null
              transport.stop()
              transport.cancel(0)
              request.onSlice(null)
              request.onEnded()
              setActiveOwner(null)
            }
          }, time)
        }
      }, events)
      part.start(0)

      activeRef.current = {
        ownerId: request.ownerId,
        part,
        onSlice: request.onSlice,
        onEnded: request.onEnded,
      }
      setActiveOwner(request.ownerId)
      transport.start('+0.05')
    },
    [ensureAudio, haltActive],
  )

  const updateTempo = useCallback((ownerId: string, bpm: number) => {
    const runtime = runtimeRef.current
    if (!runtime || activeRef.current?.ownerId !== ownerId) return
    runtime.Tone.getTransport().bpm.value = bpm
  }, [])

  const noteOn = useCallback(
    (midi: number) => {
      const runtime = runtimeRef.current
      if (runtime) {
        runtime.engine.noteOn(midi)
      } else {
        // First gesture: initialize, then sound the note so the press is not lost.
        void ensureAudio().then((r) => r?.engine.attackRelease([midi], 1.2))
      }
    },
    [ensureAudio],
  )

  const noteOff = useCallback((midi: number) => {
    runtimeRef.current?.engine.noteOff(midi)
  }, [])

  const sound = useCallback(
    (midis: number[], durationSec = 1.1) => {
      const runtime = runtimeRef.current
      if (runtime) {
        runtime.engine.attackRelease(midis, durationSec)
      } else {
        void ensureAudio().then((r) => r?.engine.attackRelease(midis, durationSec))
      }
    },
    [ensureAudio],
  )

  const setVolume = useCallback((v: number) => {
    volumeRef.current = v
    runtimeRef.current?.engine.setVolume(v)
  }, [])

  useEffect(() => {
    setVolume(volume)
  }, [volume, setVolume])

  useEffect(() => {
    const onPageHide = () => stop()
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('pagehide', onPageHide)
      stop()
      runtimeRef.current?.engine.dispose()
      runtimeRef.current = null
      runtimePromiseRef.current = null
    }
  }, [stop])

  const api = useMemo<PlayerAPI>(
    () => ({
      activeOwner,
      audioMode,
      play,
      stop,
      stopIfOwner,
      updateTempo,
      noteOn,
      noteOff,
      sound,
      setVolume,
    }),
    [activeOwner, audioMode, play, stop, stopIfOwner, updateTempo, noteOn, noteOff, sound, setVolume],
  )

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>
}

/** Test/provider seam: expose the raw context for fake players in tests. */
export { PlayerContext }
