import { useState } from 'react'
import { LESSONS } from '../lessons/registry'
import { useLessonNav } from './navigation'
import { usePlayer } from '../audio/player'
import { SettingsPanel } from './SettingsPanel'

export function Header() {
  const { activeId, goTo } = useLessonNav()
  const player = usePlayer()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const activeLesson = LESSONS.find((lesson) => lesson.id === activeId)

  return (
    <header className="site-header">
      <div className="site-header__inner wide">
        <div className="site-header__brand">
          <a
            href="#top"
            className="site-header__title"
            onClick={(e) => {
              e.preventDefault()
              history.replaceState(null, '', window.location.pathname + window.location.search)
              window.scrollTo({ top: 0 })
            }}
          >
            Jazz Piano Theory Atlas
          </a>
          <span className="site-header__context" aria-live="off">
            {activeLesson ? `${activeLesson.number} · ${activeLesson.short}` : 'Introduction'}
          </span>
        </div>

        <nav className="site-header__nav" aria-label="Lessons">
          {LESSONS.map((lesson) => (
            <a
              key={lesson.id}
              href={`#${lesson.id}`}
              className="site-header__chip"
              aria-label={`Lesson ${lesson.number}: ${lesson.title}`}
              title={`${lesson.number}. ${lesson.title}`}
              aria-current={activeId === lesson.id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                goTo(lesson.id)
              }}
            >
              {lesson.number}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="btn btn--small"
            onClick={() => player.stop()}
            aria-label="Stop all playback"
            title="Stop all playback"
          >
            ◼ Stop
          </button>
          <button
            type="button"
            className="btn btn--small"
            aria-expanded={settingsOpen}
            aria-haspopup="dialog"
            onClick={() => setSettingsOpen((open) => !open)}
          >
            Settings
          </button>
        </div>
      </div>
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </header>
  )
}
