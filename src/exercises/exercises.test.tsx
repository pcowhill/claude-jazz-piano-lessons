import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChoiceExercise } from './ChoiceExercise'
import { BuildExercise } from './BuildExercise'
import { SettingsProvider } from '../app/settings'
import { makeFakePlayer } from '../test/fakePlayer'

function wrap(ui: React.ReactNode) {
  const { Provider, handle } = makeFakePlayer()
  const utils = render(
    <SettingsProvider>
      <Provider>{ui}</Provider>
    </SettingsProvider>,
  )
  return { handle, ...utils }
}

describe('ChoiceExercise', () => {
  const props = {
    title: 'Test choice',
    prompt: 'Which function?',
    hint: 'Think about the tritone.',
    explanation: <p>The dominant pulls home.</p>,
    options: [
      { id: 'right', label: 'Dominant', correct: true, why: 'Yes — tritone.' },
      { id: 'wrong', label: 'Tonic', why: 'No — home base.' },
    ],
    listen: { label: 'Hear it', midis: [43, 53, 59] },
  }

  it('gives immediate feedback for wrong then right answers', async () => {
    const user = userEvent.setup()
    wrap(<ChoiceExercise {...props} />)
    await user.click(screen.getByRole('button', { name: /tonic/i }))
    expect(screen.getByText(/no — home base/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /dominant/i }))
    expect(screen.getByText(/yes — tritone/i)).toBeInTheDocument()
  })

  it('shows hint, reveals explanation, and resets cleanly', async () => {
    const user = userEvent.setup()
    wrap(<ChoiceExercise {...props} />)
    await user.click(screen.getByRole('button', { name: 'Hint' }))
    expect(screen.getByText(/think about the tritone/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /reveal answer/i }))
    expect(screen.getByText(/the dominant pulls home/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reveal answer/i })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.queryByText(/the dominant pulls home/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/think about the tritone/i)).not.toBeInTheDocument()
  })

  it('plays the listen sound through the adapter', async () => {
    const user = userEvent.setup()
    const { handle } = wrap(<ChoiceExercise {...props} />)
    await user.click(screen.getByRole('button', { name: /hear it/i }))
    expect(handle.calls.sound).toContainEqual([43, 53, 59])
  })
})

describe('BuildExercise', () => {
  const props = {
    title: 'Build test',
    homeKey: 'C',
    target: 'C4 E4 G4',
    prompt: (names: string[]) => <>Build {names.join('–')}.</>,
    hint: 'Stack a major triad.',
    explanation: (names: string[]) => <p>{names.join('–')} is the triad.</p>,
  }

  it('checks selections with immediate feedback', async () => {
    const user = userEvent.setup()
    wrap(<BuildExercise {...props} />)
    await user.click(screen.getByRole('button', { name: /check selection/i }))
    expect(screen.getByText(/click keys/i)).toBeInTheDocument()

    const keyboard = screen.getByRole('group', { name: /note selection keyboard/i })
    await user.click(within(keyboard).getByRole('button', { name: /^C4 piano key$/i }))
    await user.click(within(keyboard).getByRole('button', { name: /^E4 piano key$/i }))
    await user.click(screen.getByRole('button', { name: /check selection/i }))
    expect(screen.getByText(/1 target tone still missing/i)).toBeInTheDocument()

    await user.click(within(keyboard).getByRole('button', { name: /^G4 piano key$/i }))
    await user.click(screen.getByRole('button', { name: /check selection/i }))
    expect(screen.getByText(/that's it/i)).toBeInTheDocument()
  })

  it('reveals the answer on the keyboard and resets', async () => {
    const user = userEvent.setup()
    const { handle } = wrap(<BuildExercise {...props} />)
    await user.click(screen.getByRole('button', { name: /reveal answer/i }))
    expect(screen.getByText(/C–E–G is the triad/i)).toBeInTheDocument()
    expect(handle.calls.sound.length).toBeGreaterThan(0)
    const keyboard = screen.getByRole('group', { name: /note selection keyboard/i })
    expect(within(keyboard).getByRole('button', { name: /^C4 piano key$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(within(keyboard).getByRole('button', { name: /^C4 piano key$/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('transposes the target with the key selector', async () => {
    const user = userEvent.setup()
    wrap(<BuildExercise {...props} />)
    await user.selectOptions(screen.getByRole('combobox'), 'Eb')
    expect(screen.getByText(/build e♭–g–b♭/i)).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: /note selection keyboard/i })
    await user.click(within(keyboard).getByRole('button', { name: /^E♭4 piano key$/i }))
    await user.click(within(keyboard).getByRole('button', { name: /^G4 piano key$/i }))
    await user.click(within(keyboard).getByRole('button', { name: /^B♭4 piano key$/i }))
    await user.click(screen.getByRole('button', { name: /check selection/i }))
    expect(screen.getByText(/that's it/i)).toBeInTheDocument()
  })
})
