import { describe, expect, it } from 'vitest'
import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MusicPanel } from './MusicPanel'
import { SettingsProvider } from '../app/settings'
import { makeFakePlayer } from '../test/fakePlayer'
import { sym } from '../music/chord'
import { sps } from '../music/pitch'
import type { ExampleSpec } from '../music/example'

const fixture: ExampleSpec = {
  id: 'panel-fixture',
  title: 'Fixture ii–V–I',
  listen: 'Listen closely.',
  homeKey: 'C',
  textAlt: 'A ii–V–I in C.',
  chords: [
    {
      beats: 4,
      symbol: sym('D', 'm7'),
      roman: 'ii7',
      func: 'predominant',
      clear: { bass: sps('D2'), treble: sps('F3 A3 C4') },
      jazz: { bass: sps('D2'), treble: sps('F3 C4 E4') },
    },
    {
      beats: 4,
      symbol: sym('G', '7'),
      roman: 'V7',
      func: 'dominant',
      clear: { bass: sps('G2'), treble: sps('F3 B3') },
      jazz: { bass: sps('G2'), treble: sps('F3 B3 E4') },
    },
    {
      beats: 4,
      symbol: sym('C', 'maj7'),
      roman: 'Imaj7',
      func: 'tonic',
      clear: { bass: sps('C2'), treble: sps('E3 G3 B3') },
      jazz: { bass: sps('C2'), treble: sps('E3 B3 D4') },
    },
  ],
  analysis: ['Guide tones resolve by half step.'],
}

function setup(specOverride?: Partial<ExampleSpec>) {
  const { Provider, handle } = makeFakePlayer()
  const spec = { ...fixture, ...specOverride }
  const utils = render(
    <SettingsProvider>
      <Provider>
        <MusicPanel spec={spec} />
      </Provider>
    </SettingsProvider>,
  )
  return { handle, ...utils }
}

describe('MusicPanel', () => {
  it('starts playback with derived attacks and stops on demand', async () => {
    const user = userEvent.setup()
    const { handle } = setup()
    await user.click(screen.getByRole('button', { name: /play fixture/i }))
    expect(handle.calls.play).toHaveLength(1)
    const request = handle.calls.play[0]
    expect(request.totalBeats).toBe(12)
    expect(request.attacks[0].midis).toContain(38) // D2
    // While playing, the same button stops.
    await user.click(screen.getByRole('button', { name: /stop fixture/i }))
    expect(handle.calls.stop).toBe(1)
  })

  it('shows the current chord during playback and clears after', async () => {
    const user = userEvent.setup()
    const { handle } = setup()
    await user.click(screen.getByRole('button', { name: /play fixture/i }))
    act(() => handle.emitSlice(1))
    expect(screen.getByText('G7')).toBeInTheDocument()
    expect(screen.getByText('V7')).toBeInTheDocument()
    act(() => handle.endPlayback())
    expect(screen.queryByText('G7')).not.toBeInTheDocument()
    expect(screen.getByText(/press play/i)).toBeInTheDocument()
  })

  it('transposes on key change and stops its own playback', async () => {
    const user = userEvent.setup()
    const { handle } = setup()
    await user.click(screen.getByRole('button', { name: /play fixture/i }))
    await user.selectOptions(screen.getByRole('combobox', { name: /key for fixture/i }), 'Eb')
    expect(handle.calls.stopIfOwner.length).toBeGreaterThan(0)
    expect(screen.getByText(/currently in the key of E♭/i)).toBeInTheDocument()
  })

  it('keeps the selected key when toggling analyze', async () => {
    const user = userEvent.setup()
    setup()
    await user.selectOptions(screen.getByRole('combobox', { name: /key for fixture/i }), 'A')
    await user.click(screen.getByRole('button', { name: /analyze/i }))
    expect(screen.getByText(/guide tones resolve/i)).toBeInTheDocument()
    expect(screen.getByText(/currently in the key of A/i)).toBeInTheDocument()
    const select = screen.getByRole('combobox', { name: /key for fixture/i }) as HTMLSelectElement
    expect(select.value).toBe('A')
  })

  it('switches voicing modes and register independently', async () => {
    const user = userEvent.setup()
    const { handle } = setup()
    const jazzButton = within(
      screen.getByRole('group', { name: /voicing for fixture/i }),
    ).getByRole('button', { name: 'Jazz' })
    await user.click(jazzButton)
    expect(jazzButton).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: /play fixture/i }))
    const jazzRequest = handle.calls.play.at(-1)!
    expect(jazzRequest.attacks[0].midis).toContain(64) // E4 only in jazz voicing
    await user.selectOptions(screen.getByRole('combobox', { name: /register/i }), '1')
    await user.click(screen.getByRole('button', { name: /play fixture/i }))
    const shifted = handle.calls.play.at(-1)!
    expect(shifted.attacks[0].midis).toContain(76) // E5 after octave shift
  })

  it('plays free keyboard notes through the audio adapter', async () => {
    const user = userEvent.setup()
    const { handle } = setup()
    const keyboard = screen.getByRole('group', { name: /piano keyboard for fixture/i })
    const key = within(keyboard).getAllByRole('button')[0]
    await user.pointer([{ keys: '[MouseLeft>]', target: key }, { keys: '[/MouseLeft]' }])
    expect(handle.calls.noteOn.length).toBeGreaterThan(0)
    expect(handle.calls.noteOff.length).toBeGreaterThan(0)
  })

  it('marks only one panel active at a time', async () => {
    const user = userEvent.setup()
    const { Provider, handle } = makeFakePlayer()
    render(
      <SettingsProvider>
        <Provider>
          <MusicPanel spec={{ ...fixture, id: 'a', title: 'Alpha' }} />
          <MusicPanel spec={{ ...fixture, id: 'b', title: 'Beta' }} />
        </Provider>
      </SettingsProvider>,
    )
    await user.click(screen.getByRole('button', { name: /play alpha/i }))
    expect(screen.getByRole('button', { name: /stop alpha/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /play beta/i }))
    // Alpha reverted to Play; Beta is the single active example.
    expect(screen.getByRole('button', { name: /play alpha/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /stop beta/i })).toBeInTheDocument()
    expect(handle.calls.play).toHaveLength(2)
  })

  it('switches variants', async () => {
    const user = userEvent.setup()
    const variantSpec: ExampleSpec = {
      ...fixture,
      chords: undefined,
      variants: [
        { id: 'one', label: 'Version one', chords: fixture.chords! },
        { id: 'two', label: 'Version two', chords: fixture.chords!.slice(0, 2) },
      ],
    }
    const { handle } = setup(variantSpec)
    await user.click(screen.getByRole('button', { name: 'Version two' }))
    await user.click(screen.getByRole('button', { name: /play fixture/i }))
    expect(handle.calls.play.at(-1)!.totalBeats).toBe(8)
  })
})
