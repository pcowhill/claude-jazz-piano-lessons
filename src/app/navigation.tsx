// Lesson collapse state, scroll-spy and hash synchronization. Scroll-spying
// uses history.replaceState so following the page never floods the history
// stack.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { LESSONS } from '../lessons/registry'
import { useSettings } from './settings'

interface LessonNavAPI {
  collapsed: Readonly<Record<string, boolean>>
  toggleCollapsed(id: string): void
  expand(id: string): void
  activeId: string | null
  goTo(id: string): void
}

const LessonNavContext = createContext<LessonNavAPI | null>(null)

export function useLessonNav(): LessonNavAPI {
  const api = useContext(LessonNavContext)
  if (!api) throw new Error('useLessonNav must be used within LessonNavProvider')
  return api
}

const HEADER_OFFSET = 96

export function LessonNavProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useSettings()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const suppressSpyUntil = useRef(0)

  const toggleCollapsed = useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const expand = useCallback((id: string) => {
    setCollapsed((prev) => (prev[id] ? { ...prev, [id]: false } : prev))
  }, [])

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 8
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' })
    },
    [reducedMotion],
  )

  const goTo = useCallback(
    (id: string) => {
      expand(id)
      suppressSpyUntil.current = Date.now() + 1200
      setActiveId(id)
      history.replaceState(null, '', `#${id}`)
      // Wait a frame so a collapsed section can expand before measuring.
      requestAnimationFrame(() => scrollToSection(id))
    },
    [expand, scrollToSection],
  )

  // Scroll spy.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      if (Date.now() < suppressSpyUntil.current) return
      let current: string | null = null
      for (const lesson of LESSONS) {
        const el = document.getElementById(lesson.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= HEADER_OFFSET + 60) current = lesson.id
      }
      setActiveId((prev) => (prev === current ? prev : current))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Reflect the active lesson in the hash without history spam.
  useEffect(() => {
    if (!activeId) return
    if (Date.now() < suppressSpyUntil.current) return
    const target = `#${activeId}`
    if (window.location.hash !== target) {
      history.replaceState(null, '', target)
    }
  }, [activeId])

  // Deep link: reveal and scroll to the lesson in the initial hash.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash || !LESSONS.some((lesson) => lesson.id === hash)) return
    expand(hash)
    suppressSpyUntil.current = Date.now() + 1500
    setActiveId(hash)
    // Two frames + a settle delay: notation panels shift layout as they mount.
    const timer = window.setTimeout(() => {
      const el = document.getElementById(hash)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 8
      window.scrollTo({ top, behavior: 'auto' })
      const heading = document.getElementById(`${hash}-title`)
      heading?.focus({ preventScroll: true })
    }, 250)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for manual hash edits / back navigation.
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (LESSONS.some((lesson) => lesson.id === hash)) {
        goTo(hash)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [goTo])

  const api = useMemo<LessonNavAPI>(
    () => ({ collapsed, toggleCollapsed, expand, activeId, goTo }),
    [collapsed, toggleCollapsed, expand, activeId, goTo],
  )

  return <LessonNavContext.Provider value={api}>{children}</LessonNavContext.Provider>
}
