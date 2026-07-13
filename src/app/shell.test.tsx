import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsProvider, STORAGE_KEY } from './settings'
import { LessonNavProvider } from './navigation'
import { Header } from './Header'
import { DesktopGate } from './DesktopGate'
import { LessonSection } from '../components/LessonSection'
import { LESSONS } from '../lessons/registry'
import { makeFakePlayer } from '../test/fakePlayer'

declare global {
  interface Window {
    __setMedia: (query: string, matches: boolean) => void
  }
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      {LESSONS.slice(0, 3).map((meta) => (
        <LessonSection key={meta.id} meta={meta}>
          <p>Content for {meta.title}</p>
        </LessonSection>
      ))}
      {children}
    </>
  )
}

function renderShell() {
  const { Provider, handle } = makeFakePlayer()
  const utils = render(
    <SettingsProvider>
      <Provider>
        <LessonNavProvider>
          <Shell />
        </LessonNavProvider>
      </Provider>
    </SettingsProvider>,
  )
  return { handle, ...utils }
}

describe('lesson navigation', () => {
  it('updates the hash when a lesson chip is clicked', async () => {
    const user = userEvent.setup()
    renderShell()
    await user.click(screen.getByRole('link', { name: /lesson 2:/i }))
    expect(window.location.hash).toBe('#diatonic-harmony')
  })

  it('reveals a collapsed lesson when navigating to it', async () => {
    const user = userEvent.setup()
    renderShell()
    const first = LESSONS[0]
    await user.click(screen.getAllByRole('button', { name: 'Collapse' })[0])
    expect(screen.queryByText(`Content for ${first.title}`)).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /lesson 1:/i }))
    expect(screen.getByText(`Content for ${first.title}`)).toBeInTheDocument()
  })

  it('collapses and expands lesson content', async () => {
    const user = userEvent.setup()
    renderShell()
    const first = LESSONS[0]
    const toggle = screen.getAllByRole('button', { name: 'Collapse' })[0]
    await user.click(toggle)
    expect(screen.queryByText(`Content for ${first.title}`)).not.toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Expand' })[0])
    expect(screen.getByText(`Content for ${first.title}`)).toBeInTheDocument()
  })

  it('activates the lesson named in the initial hash', () => {
    window.location.hash = '#extensions-alterations'
    renderShell()
    const chip = screen.getByRole('link', { name: /lesson 3:/i })
    expect(chip).toHaveAttribute('aria-current', 'true')
    window.location.hash = ''
  })

  it('offers a global stop control', async () => {
    const user = userEvent.setup()
    const { handle } = renderShell()
    await user.click(screen.getByRole('button', { name: /stop all playback/i }))
    expect(handle.calls.stop).toBe(1)
  })
})

describe('settings persistence', () => {
  it('persists changes and restores defaults on reset', async () => {
    const user = userEvent.setup()
    renderShell()
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    await user.click(within(dialog).getByRole('button', { name: 'Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)
    expect(stored.prefs.theme).toBe('dark')

    await user.click(within(dialog).getByRole('button', { name: /reset preferences/i }))
    const restored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)
    expect(restored.prefs.theme).toBe('system')
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    renderShell()
    const trigger = screen.getByRole('button', { name: 'Settings' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})

describe('desktop gate', () => {
  it('replaces the app below 1100px and stops playback', () => {
    window.__setMedia('(max-width: 1099px)', true)
    const { Provider, handle } = makeFakePlayer()
    render(
      <SettingsProvider>
        <Provider>
          <LessonNavProvider>
            <DesktopGate>
              <p>App content</p>
            </DesktopGate>
          </LessonNavProvider>
        </Provider>
      </SettingsProvider>,
    )
    expect(screen.getByTestId('desktop-gate')).toBeInTheDocument()
    expect(screen.queryByText('App content')).not.toBeInTheDocument()
    expect(handle.calls.stop).toBeGreaterThanOrEqual(1)
  })

  it('renders the app at desktop widths', () => {
    const { Provider } = makeFakePlayer()
    render(
      <SettingsProvider>
        <Provider>
          <LessonNavProvider>
            <DesktopGate>
              <p>App content</p>
            </DesktopGate>
          </LessonNavProvider>
        </Provider>
      </SettingsProvider>,
    )
    expect(screen.getByText('App content')).toBeInTheDocument()
    expect(screen.queryByTestId('desktop-gate')).not.toBeInTheDocument()
  })
})

describe('analysis visibility preference', () => {
  it('toggles the analysis checkbox and persists it', async () => {
    const user = userEvent.setup()
    renderShell()
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    const checkbox = screen.getByRole('checkbox', { name: /show harmonic analysis/i })
    expect(checkbox).toBeChecked()
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)
    expect(stored.prefs.analysisVisible).toBe(false)
  })
})
