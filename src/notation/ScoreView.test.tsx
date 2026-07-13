// ScoreView renders real VexFlow SVG in jsdom (glyph metrics are internal to
// VexFlow, so no browser layout is needed). These tests cover the overlay
// symbols/romans and their response to transposition and analysis visibility.

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreView } from './ScoreView'
import { renderExample, type ExampleSpec } from '../music/example'
import { sym } from '../music/chord'
import { sps, sp } from '../music/pitch'

const fixture: ExampleSpec = {
  id: 'score-fixture',
  title: 'Score fixture',
  listen: '',
  homeKey: 'C',
  textAlt: '',
  chords: [
    {
      beats: 4,
      symbol: sym('D', 'm7'),
      roman: 'ii7',
      clear: { bass: sps('D2'), treble: sps('F3 A3 C4') },
      melody: [
        { pitch: sp('F4'), beats: 2 },
        { pitch: sp('A4'), beats: 2 },
      ],
    },
    {
      beats: 4,
      symbol: sym('G', '7'),
      roman: 'V7',
      clear: { bass: sps('G2'), treble: sps('F3 B3') },
    },
    {
      beats: 4,
      symbol: sym('C', 'maj7'),
      roman: 'Imaj7',
      clear: { bass: sps('C2'), treble: sps('E3 G3 B3') },
    },
  ],
}

function renderScore(keyId = 'C', showAnalysis = true) {
  const rendered = renderExample(fixture, { keyId, voicing: 'clear', octaveShift: 0 })
  return render(
    <ScoreView example={rendered} currentSlice={null} showAnalysis={showAnalysis} width={900} />,
  )
}

describe('ScoreView', () => {
  it('draws an SVG grand staff with note groups', () => {
    const { container } = renderScore()
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.querySelectorAll('g.vf-stavenote').length).toBeGreaterThanOrEqual(6)
  })

  it('overlays chord symbols above the staff', () => {
    renderScore()
    expect(screen.getByText('Dm7')).toBeInTheDocument()
    expect(screen.getByText('G7')).toBeInTheDocument()
    expect(screen.getByText('Cmaj7')).toBeInTheDocument()
  })

  it('shows roman numerals only when analysis is visible', () => {
    const { unmount } = renderScore('C', true)
    expect(screen.getByText('ii7')).toBeInTheDocument()
    expect(screen.getByText('V7')).toBeInTheDocument()
    unmount()
    renderScore('C', false)
    expect(screen.getByText('Dm7')).toBeInTheDocument()
    expect(screen.queryByText('ii7')).not.toBeInTheDocument()
  })

  it('updates symbols when the example is transposed', () => {
    renderScore('Eb')
    expect(screen.getByText('Fm7')).toBeInTheDocument()
    expect(screen.getByText('B♭7')).toBeInTheDocument()
    expect(screen.getByText('E♭maj7')).toBeInTheDocument()
  })

  it('recolors the SVG to currentColor for theme support', () => {
    const { container } = renderScore()
    const filled = container.querySelectorAll('svg [fill]')
    const literals = [...filled].filter(
      (el) => el.getAttribute('fill') !== 'none' && el.getAttribute('fill') !== 'currentColor',
    )
    expect(literals).toHaveLength(0)
  })
})
