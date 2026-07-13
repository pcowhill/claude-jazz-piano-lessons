// Build-the-sound exercise: select notes on a keyboard to match a target
// pitch-class set. Fully transposable — the target, prompt names and revealed
// answer all move with the chosen key.

import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ExerciseShell, type ExerciseFeedback } from './ExerciseShell'
import { PianoKeyboard } from '../keyboard/PianoKeyboard'
import { usePlayer } from '../audio/player'
import { KEY_CHOICES, keyChoiceById, resolveTonic } from '../music/key'
import { transposePitch, transpositionInterval } from '../music/interval'
import { midiOf, pcName, pitchName, sp, type Pitch } from '../music/pitch'

export interface BuildExerciseProps {
  title: string
  /** Receives the transposed target names for prompt text. */
  prompt: (names: string[], keyLabel: string) => ReactNode
  hint: string
  explanation: (names: string[], keyLabel: string) => ReactNode
  /** Authored key of the target spelling, a key-choice id. */
  homeKey: string
  /** Target pitches, spelled in the home key with octaves (e.g. 'B3 D4 F4 Ab4'). */
  target: string
  /** Show the key selector (default true). */
  transposable?: boolean
  keySelectorLabel?: string
}

export function BuildExercise({
  title,
  prompt,
  hint,
  explanation,
  homeKey,
  target,
  transposable = true,
  keySelectorLabel = 'Key',
}: BuildExerciseProps) {
  const player = usePlayer()
  const [keyId, setKeyId] = useState(homeKey)
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set())
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null)
  const [revealed, setRevealed] = useState(false)

  const homePitches = useMemo(() => target.trim().split(/\s+/).map(sp), [target])

  const { targetPitches, keyLabel } = useMemo(() => {
    const homeTonic = keyChoiceById(homeKey).tonics[0]
    const choice = keyChoiceById(keyId)
    const tonic = resolveTonic(choice, homeTonic, homePitches)
    const iv = transpositionInterval(homeTonic, tonic)
    const moved = homePitches.map((p) => transposePitch(p, iv))
    return { targetPitches: moved, keyLabel: pcName(tonic) }
  }, [homeKey, keyId, homePitches])

  const targetNames = targetPitches.map((p) => pcName(p))
  const targetPcs = useMemo(
    () => new Set(targetPitches.map((p) => ((midiOf(p) % 12) + 12) % 12)),
    [targetPitches],
  )
  const targetMidis = useMemo(() => targetPitches.map(midiOf), [targetPitches])

  const range = useMemo(() => {
    const min = Math.min(...targetMidis)
    const max = Math.max(...targetMidis)
    return { low: min - 5, high: max + 5 }
  }, [targetMidis])

  const nameForMidi = useCallback(
    (midi: number) => {
      const match = targetPitches.find((p) => midiOf(p) % 12 === ((midi % 12) + 12) % 12)
      if (!match) return undefined
      return pitchName({ ...match, octave: Math.floor(midi / 12) - 1 } as Pitch)
    },
    [targetPitches],
  )

  const toggle = useCallback(
    (midi: number) => {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(midi)) {
          next.delete(midi)
        } else {
          next.add(midi)
        }
        return next
      })
      setFeedback(null)
      player.sound([midi], 0.5)
    },
    [player],
  )

  const check = useCallback(() => {
    const selectedPcs = new Set([...selected].map((midi) => ((midi % 12) + 12) % 12))
    const missing = [...targetPcs].filter((p) => !selectedPcs.has(p)).length
    const extra = [...selectedPcs].filter((p) => !targetPcs.has(p)).length
    if (missing === 0 && extra === 0 && selected.size > 0) {
      setFeedback({
        kind: 'correct',
        text: `That's it: ${targetNames.join('–')}. Octave doubling is fine — the pitch classes are what count.`,
      })
      player.sound([...selected], 1.4)
    } else if (selected.size === 0) {
      setFeedback({ kind: 'info', text: 'Click keys on the keyboard to select notes first.' })
    } else {
      const parts: string[] = []
      if (missing > 0) parts.push(`${missing} target tone${missing > 1 ? 's' : ''} still missing`)
      if (extra > 0) parts.push(`${extra} selected note${extra > 1 ? 's' : ''} do${extra === 1 ? 'es' : ''}n't belong`)
      setFeedback({ kind: 'incorrect', text: `Not yet — ${parts.join(' and ')}. Adjust and check again.` })
    }
  }, [selected, targetPcs, targetNames, player])

  const reveal = useCallback(() => {
    setSelected(new Set(targetMidis))
    setRevealed(true)
    setFeedback(null)
    player.sound(targetMidis, 1.4)
  }, [targetMidis, player])

  const reset = useCallback(() => {
    setSelected(new Set())
    setFeedback(null)
    setRevealed(false)
  }, [])

  return (
    <ExerciseShell
      title={title}
      prompt={prompt(targetNames, keyLabel)}
      hint={hint}
      explanation={explanation(targetNames, keyLabel)}
      feedback={feedback}
      revealed={revealed}
      onReveal={reveal}
      onReset={reset}
    >
      <div className="exercise__buildbar">
        {transposable && (
          <label className="field">
            {keySelectorLabel}
            <select value={keyId} onChange={(e) => { setKeyId(e.target.value); reset() }}>
              {KEY_CHOICES.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="button" className="btn btn--small btn--primary" onClick={check}>
          Check selection
        </button>
        <button
          type="button"
          className="btn btn--small"
          onClick={() => selected.size > 0 && player.sound([...selected], 1.2)}
        >
          ♪ Play selection
        </button>
      </div>
      <PianoKeyboard
        low={range.low}
        high={range.high}
        selectedMidis={selected}
        onToggle={toggle}
        nameForMidi={nameForMidi}
        labelMode="c"
        compact
        ariaLabel={`Note selection keyboard for ${title}`}
      />
    </ExerciseShell>
  )
}
