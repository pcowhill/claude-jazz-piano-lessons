import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

// jsdom lacks these; components use them defensively.
if (!('scrollIntoView' in Element.prototype) || typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {}
}
// jsdom's scrollTo throws "Not implemented" — replace it outright.
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })

// matchMedia stub with per-test overrides via __setMedia.
const mediaState = new Map<string, boolean>()
;(window as unknown as { __setMedia: (q: string, m: boolean) => void }).__setMedia = (
  query: string,
  matches: boolean,
) => {
  mediaState.set(query, matches)
}
window.matchMedia = ((query: string) => ({
  matches: mediaState.get(query) ?? false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia

afterEach(() => {
  mediaState.clear()
})
