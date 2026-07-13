// Piano engine abstraction. The preferred instrument is a Tone.Sampler over
// the bundled Salamander Grand Piano subset (see THIRD_PARTY_NOTICES.md);
// if those assets fail to load, a shaped polyphonic synth takes over with the
// same interface. Tone.js is imported dynamically so nothing here touches an
// AudioContext until the user gestures.

export type AudioMode = 'sampled' | 'synth'

export interface PianoEngine {
  readonly mode: AudioMode
  /** Schedule-friendly attack+release. `when` is an absolute AudioContext time. */
  attackRelease(midis: number[], durationSec: number, when?: number, velocity?: number): void
  noteOn(midi: number, velocity?: number): void
  noteOff(midi: number): void
  releaseAll(): void
  /** 0–1 master volume. */
  setVolume(volume: number): void
  dispose(): void
}

type ToneModule = typeof import('tone')

const SAMPLE_URLS: Record<string, string> = {
  C1: 'C1.mp3',
  'F#1': 'Fs1.mp3',
  C2: 'C2.mp3',
  'D#2': 'Ds2.mp3',
  'F#2': 'Fs2.mp3',
  A2: 'A2.mp3',
  C3: 'C3.mp3',
  'D#3': 'Ds3.mp3',
  'F#3': 'Fs3.mp3',
  A3: 'A3.mp3',
  C4: 'C4.mp3',
  'D#4': 'Ds4.mp3',
  'F#4': 'Fs4.mp3',
  A4: 'A4.mp3',
  C5: 'C5.mp3',
  'D#5': 'Ds5.mp3',
  'F#5': 'Fs5.mp3',
  A5: 'A5.mp3',
  C6: 'C6.mp3',
  'F#6': 'Fs6.mp3',
  C7: 'C7.mp3',
}

function volumeToDb(Tone: ToneModule, volume: number): number {
  if (volume <= 0) return Number.NEGATIVE_INFINITY
  return Tone.gainToDb(Math.min(1, volume))
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

interface Chain {
  /** Node instruments connect into (front of the effects chain). */
  head: import('tone').ToneAudioNode
  volume: import('tone').Volume
  nodes: { dispose(): void }[]
}

async function buildOutputChain(Tone: ToneModule, wet: number): Promise<Chain> {
  const limiter = new Tone.Limiter(-1).toDestination()
  const volume = new Tone.Volume(0).connect(limiter)
  const reverb = new Tone.Reverb({ decay: 1.9, preDelay: 0.02, wet }).connect(volume)
  await reverb.ready
  return { head: reverb, volume, nodes: [reverb, volume, limiter] }
}

class SamplerEngine implements PianoEngine {
  readonly mode: AudioMode = 'sampled'
  constructor(
    private sampler: import('tone').Sampler,
    private chain: Chain,
    private Tone: ToneModule,
  ) {}

  attackRelease(midis: number[], durationSec: number, when?: number, velocity = 0.8): void {
    const freqs = midis.map(midiToFreq)
    this.sampler.triggerAttackRelease(freqs, durationSec, when, velocity)
  }
  noteOn(midi: number, velocity = 0.8): void {
    this.sampler.triggerAttack(midiToFreq(midi), this.Tone.now(), velocity)
  }
  noteOff(midi: number): void {
    this.sampler.triggerRelease(midiToFreq(midi), this.Tone.now())
  }
  releaseAll(): void {
    this.sampler.releaseAll()
  }
  setVolume(volume: number): void {
    this.chain.volume.volume.value = volumeToDb(this.Tone, volume)
  }
  dispose(): void {
    this.sampler.dispose()
    this.chain.nodes.forEach((n) => n.dispose())
  }
}

class SynthEngine implements PianoEngine {
  readonly mode: AudioMode = 'synth'
  constructor(
    private poly: import('tone').PolySynth,
    private chain: Chain,
    private Tone: ToneModule,
  ) {}

  attackRelease(midis: number[], durationSec: number, when?: number, velocity = 0.8): void {
    const freqs = midis.map(midiToFreq)
    this.poly.triggerAttackRelease(freqs, durationSec, when, velocity)
  }
  noteOn(midi: number, velocity = 0.8): void {
    this.poly.triggerAttack(midiToFreq(midi), this.Tone.now(), velocity)
  }
  noteOff(midi: number): void {
    this.poly.triggerRelease(midiToFreq(midi), this.Tone.now())
  }
  releaseAll(): void {
    this.poly.releaseAll()
  }
  setVolume(volume: number): void {
    this.chain.volume.volume.value = volumeToDb(this.Tone, volume)
  }
  dispose(): void {
    this.poly.dispose()
    this.chain.nodes.forEach((n) => n.dispose())
  }
}

async function createSampler(Tone: ToneModule): Promise<PianoEngine> {
  const chain = await buildOutputChain(Tone, 0.1)
  const baseUrl = `${import.meta.env.BASE_URL}samples/salamander/`
  const sampler = await new Promise<import('tone').Sampler>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('sample load timeout')), 12_000)
    const instance: import('tone').Sampler = new Tone.Sampler({
      urls: SAMPLE_URLS,
      baseUrl,
      release: 0.9,
      onload: () => {
        clearTimeout(timeout)
        resolve(instance)
      },
      onerror: (error) => {
        clearTimeout(timeout)
        reject(error)
      },
    })
  })
  sampler.connect(chain.head)
  return new SamplerEngine(sampler, chain, Tone)
}

async function createSynth(Tone: ToneModule): Promise<PianoEngine> {
  const chain = await buildOutputChain(Tone, 0.16)
  const poly = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      // Warm, slightly nasal partial stack — closer to a felted piano than a
      // raw triangle, and it decays cleanly under the amplitude envelope.
      type: 'custom',
      partials: [1, 0.55, 0.32, 0.18, 0.09, 0.05, 0.028, 0.015],
    },
    envelope: { attack: 0.004, decay: 1.35, sustain: 0.12, release: 1.1, decayCurve: 'exponential' },
    volume: -8,
  })
  poly.maxPolyphony = 48
  const filter = new Tone.Filter({ frequency: 4200, type: 'lowpass', rolloff: -12 })
  poly.connect(filter)
  filter.connect(chain.head)
  chain.nodes.push(filter)
  return new SynthEngine(poly, chain, Tone)
}

/**
 * Create the best available engine: sampled piano when the bundled assets
 * load, synth fallback otherwise.
 */
export async function createPianoEngine(Tone: ToneModule): Promise<PianoEngine> {
  try {
    return await createSampler(Tone)
  } catch {
    return await createSynth(Tone)
  }
}
