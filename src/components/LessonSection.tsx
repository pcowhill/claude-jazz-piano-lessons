import type { ReactNode } from 'react'
import type { LessonMeta } from '../lessons/registry'
import { useLessonNav } from '../app/navigation'
import { ErrorBoundary } from './ErrorBoundary'

/**
 * A collapsible lesson section. Content unmounts while collapsed, which also
 * guarantees any playing example inside stops (panels stop on unmount).
 */
export function LessonSection({ meta, children }: { meta: LessonMeta; children: ReactNode }) {
  const { collapsed, toggleCollapsed } = useLessonNav()
  const isCollapsed = collapsed[meta.id] === true
  const bodyId = `${meta.id}-body`
  return (
    <section id={meta.id} className="lesson" aria-labelledby={`${meta.id}-title`}>
      <div className="lesson__header prose">
        <h2 id={`${meta.id}-title`} tabIndex={-1}>
          <span className="lesson__number" aria-hidden="true">
            {meta.number}
          </span>
          {meta.title}
        </h2>
        <button
          type="button"
          className="btn btn--small btn--quiet lesson__collapse"
          aria-expanded={!isCollapsed}
          aria-controls={bodyId}
          onClick={() => toggleCollapsed(meta.id)}
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
      {!isCollapsed && (
        <div id={bodyId} className="lesson__body">
          <ErrorBoundary label={meta.title}>{children}</ErrorBoundary>
        </div>
      )}
    </section>
  )
}
