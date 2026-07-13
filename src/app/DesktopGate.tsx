import { useEffect, useState, type ReactNode } from 'react'
import { usePlayer } from '../audio/player'

function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1099px)').matches,
  )
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1099px)')
    const onChange = () => setNarrow(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return narrow
}

/**
 * The atlas is deliberately desktop-only: interactive grand staves and
 * keyboards need width. Below 1100px the app is replaced by a full-page
 * notice.
 */
export function DesktopGate({ children }: { children: ReactNode }) {
  const narrow = useIsNarrow()
  const player = usePlayer()

  useEffect(() => {
    if (narrow) player.stop()
  }, [narrow, player])

  if (!narrow) return <>{children}</>

  return (
    <main className="gate" data-testid="desktop-gate">
      <div className="gate__card">
        <div className="gate__glyph" aria-hidden="true">
          𝄞
        </div>
        <h1>Jazz Piano Theory Atlas</h1>
        <p>
          This interactive score-and-keyboard reference is designed for desktop screens
          <strong> 1100&nbsp;pixels wide or wider</strong>. Grand-staff notation, playable
          keyboards and analysis layers need room to stay legible side by side.
        </p>
        <p className="gate__hint">
          Please revisit on a laptop or desktop display — or widen this window if you can.
        </p>
      </div>
    </main>
  )
}
