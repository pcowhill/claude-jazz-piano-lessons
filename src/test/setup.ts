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
if (!('scrollTo' in window) || typeof window.scrollTo !== 'function') {
  Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })
}
