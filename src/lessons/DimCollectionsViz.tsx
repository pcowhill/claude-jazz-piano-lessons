// Interactive visualization of the three fully diminished seventh
// pitch-class collections: a clock-face of the 12 pitch classes with each
// collection selectable and playable.

import { useState } from 'react'
import { DIM_COLLECTIONS } from '../music/scales'
import { usePlayer } from '../audio/player'
import './dimviz.css'

const PC_NAMES = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B']

/** A voicing (midis) for each collection, stacked in minor thirds from octave 3. */
function collectionMidis(pcs: number[]): number[] {
  const root = 48 + pcs[0] // C3-based
  return [root, root + 3, root + 6, root + 9]
}

export function DimCollectionsViz() {
  const player = usePlayer()
  const [selected, setSelected] = useState<'I' | 'II' | 'III'>('III')
  const collection = DIM_COLLECTIONS.find((c) => c.id === selected)!

  return (
    <figure className="dimviz panel" data-example-id="l8-collections">
      <figcaption className="panel__head">
        <div className="panel__titles">
          <span className="panel__title">The three diminished collections</span>
          <span className="panel__listen">
            Twelve pitch classes, three non-overlapping °7 collections — click each to see and hear it.
          </span>
        </div>
      </figcaption>
      <div className="dimviz__layout">
        <svg viewBox="0 0 220 220" className="dimviz__ring" role="img"
          aria-label={`Pitch-class clock highlighting collection ${selected}: ${collection.memberNames.join(', ')}`}>
          {Array.from({ length: 12 }, (_, pcNum) => {
            const angle = (pcNum / 12) * Math.PI * 2 - Math.PI / 2
            const x = 110 + Math.cos(angle) * 86
            const y = 110 + Math.sin(angle) * 86
            const inSelected = collection.pcs.includes(pcNum)
            return (
              <g key={pcNum}>
                <circle
                  cx={x}
                  cy={y}
                  r={15}
                  className={`dimviz__node ${inSelected ? 'is-on' : ''}`}
                />
                <text x={x} y={y + 4} textAnchor="middle" className="dimviz__label">
                  {PC_NAMES[pcNum].split('/')[0]}
                </text>
              </g>
            )
          })}
          {collection.pcs.map((pcNum, i) => {
            const next = collection.pcs[(i + 1) % 4]
            const a1 = (pcNum / 12) * Math.PI * 2 - Math.PI / 2
            const a2 = (next / 12) * Math.PI * 2 - Math.PI / 2
            return (
              <line
                key={`edge-${pcNum}`}
                x1={110 + Math.cos(a1) * 70}
                y1={110 + Math.sin(a1) * 70}
                x2={110 + Math.cos(a2) * 70}
                y2={110 + Math.sin(a2) * 70}
                className="dimviz__edge"
              />
            )
          })}
        </svg>
        <div className="dimviz__side">
          <div className="chip-row" role="group" aria-label="Diminished collection">
            {DIM_COLLECTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={selected === c.id}
                onClick={() => {
                  setSelected(c.id)
                  player.sound(collectionMidis(c.pcs), 1.6)
                }}
              >
                Collection {c.id}
              </button>
            ))}
            <button
              type="button"
              className="btn btn--small"
              onClick={() => player.sound(collectionMidis(collection.pcs), 1.6)}
            >
              ♪ Hear it
            </button>
          </div>
          <p className="dimviz__names">
            Members (with common enharmonic names): <strong>{collection.memberNames.join(' · ')}</strong>
          </p>
          <p className="dimviz__note">
            Under transposition by semitone, 12-TET contains exactly <strong>three distinct
            fully diminished seventh pitch-class collections</strong> — the three squares on
            this clock. Every named °7 chord (C°7, E♭°7, F♯°7, B°7…) is a root-choice,
            spelling, and function laid over one of these three sounds. “Only three
            diminished chords” is loose talk: three <em>collections</em>, many chords.
          </p>
        </div>
      </div>
    </figure>
  )
}
