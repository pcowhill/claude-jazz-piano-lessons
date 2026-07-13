// Shared presentational bits for lesson prose.

import type { ReactNode } from 'react'
import { SOURCES } from '../app/chrome'

export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <aside className="lesson__takeaway">
      <strong>Practical takeaway</strong>
      {children}
    </aside>
  )
}

const SOURCE_LABELS: Record<string, string> = {
  'levine-theory': 'Levine, Jazz Theory',
  'levine-piano': 'Levine, Jazz Piano',
  terefenko: 'Terefenko',
  'berklee-harmony': 'Berklee Jazz Harmony',
  pease: 'Pease',
  kingstone: 'Kingstone / Barry Harris method',
  'berklee-ust': 'Berklee UST material',
}

export function SourceChips({ ids }: { ids: string[] }) {
  const valid = ids.filter((id) => SOURCES.some((source) => source.id === id))
  if (valid.length === 0) return null
  return (
    <p className="lesson__sources">
      <span>Grounding:</span>
      {valid.map((id) => (
        <span key={id} className="lesson__source-chip">
          {SOURCE_LABELS[id] ?? id}
        </span>
      ))}
    </p>
  )
}
