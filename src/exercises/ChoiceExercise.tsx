import { useCallback, useState, type ReactNode } from 'react'
import { ExerciseShell, type ExerciseFeedback } from './ExerciseShell'
import { usePlayer } from '../audio/player'

export interface ChoiceOption {
  id: string
  label: string
  correct?: boolean
  /** Why this option is right / not right — used for immediate feedback. */
  why: string
}

export interface ChoiceExerciseProps {
  title: string
  prompt: ReactNode
  hint: string
  explanation: ReactNode
  options: ChoiceOption[]
  /** Optional sound: a chord, an arpeggio, or a sequence of chords. */
  listen?: { label: string; midis?: number[]; sequence?: number[][]; arpeggiate?: boolean }
}

export function ChoiceExercise({ title, prompt, hint, explanation, options, listen }: ChoiceExerciseProps) {
  const player = usePlayer()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const selected = options.find((option) => option.id === selectedId) ?? null
  const feedback: ExerciseFeedback | null = selected
    ? selected.correct
      ? { kind: 'correct', text: selected.why }
      : { kind: 'incorrect', text: selected.why }
    : null

  const playListen = useCallback(() => {
    if (!listen) return
    if (listen.sequence) {
      listen.sequence.forEach((chord, i) => {
        window.setTimeout(() => player.sound(chord, 1.15), i * 1000)
      })
    } else if (listen.arpeggiate && listen.midis) {
      listen.midis.forEach((midi, i) => {
        window.setTimeout(() => player.sound([midi], 0.7), i * 320)
      })
    } else if (listen.midis) {
      player.sound(listen.midis, 1.6)
    }
  }, [listen, player])

  return (
    <ExerciseShell
      title={title}
      prompt={prompt}
      hint={hint}
      explanation={explanation}
      feedback={feedback}
      revealed={revealed}
      onReveal={() => setRevealed(true)}
      onReset={() => {
        setSelectedId(null)
        setRevealed(false)
      }}
    >
      {listen && (
        <button type="button" className="btn btn--small exercise__listen" onClick={playListen}>
          ♪ {listen.label}
        </button>
      )}
      <div className="exercise__options" role="group" aria-label="Answer choices">
        {options.map((option) => {
          const isSelected = selectedId === option.id
          const showAsCorrect = revealed && option.correct
          return (
            <button
              key={option.id}
              type="button"
              className={[
                'exercise__option',
                isSelected ? 'is-selected' : '',
                isSelected && option.correct ? 'is-correct' : '',
                isSelected && !option.correct ? 'is-incorrect' : '',
                showAsCorrect ? 'is-answer' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={isSelected}
              onClick={() => setSelectedId(option.id)}
            >
              {isSelected && (option.correct ? '✓ ' : '✗ ')}
              {!isSelected && showAsCorrect ? '✓ ' : ''}
              {option.label}
            </button>
          )
        })}
      </div>
    </ExerciseShell>
  )
}
