// Shared exercise frame: prompt, hint, immediate feedback, reveal, reset.
// Exploratory by design — no scores, no persistence, resets on reload.

import { useId, useState, type ReactNode } from 'react'
import './exercises.css'

export interface ExerciseFeedback {
  kind: 'correct' | 'incorrect' | 'info'
  text: string
}

export interface ExerciseShellProps {
  title: string
  prompt: ReactNode
  hint: string
  /** Shown after Reveal (and after a correct answer if `explanation` given). */
  explanation: ReactNode
  feedback: ExerciseFeedback | null
  revealed: boolean
  onReveal(): void
  onReset(): void
  children?: ReactNode
}

export function ExerciseShell({
  title,
  prompt,
  hint,
  explanation,
  feedback,
  revealed,
  onReveal,
  onReset,
  children,
}: ExerciseShellProps) {
  const [hintShown, setHintShown] = useState(false)
  const id = useId()

  return (
    <div className="exercise" data-exercise-title={title}>
      <div className="exercise__head">
        <span className="exercise__badge">Try it</span>
        <span className="exercise__title">{title}</span>
      </div>
      <div className="exercise__prompt">{prompt}</div>
      {children}
      <div className="exercise__actions">
        <button
          type="button"
          className="btn btn--small"
          aria-expanded={hintShown}
          aria-controls={`${id}-hint`}
          onClick={() => setHintShown((shown) => !shown)}
        >
          {hintShown ? 'Hide hint' : 'Hint'}
        </button>
        <button type="button" className="btn btn--small" onClick={onReveal} disabled={revealed}>
          Reveal answer
        </button>
        <button
          type="button"
          className="btn btn--small btn--quiet"
          onClick={() => {
            setHintShown(false)
            onReset()
          }}
        >
          Reset
        </button>
      </div>
      {hintShown && (
        <p className="exercise__hint" id={`${id}-hint`}>
          <strong>Hint:</strong> {hint}
        </p>
      )}
      <div aria-live="polite" className="exercise__live">
        {feedback && (
          <p className={`exercise__feedback exercise__feedback--${feedback.kind}`}>
            {feedback.kind === 'correct' ? '✓ ' : feedback.kind === 'incorrect' ? '✗ ' : ''}
            {feedback.text}
          </p>
        )}
        {revealed && <div className="exercise__explanation">{explanation}</div>}
      </div>
    </div>
  )
}
