import { useEffect, useState } from 'react'

export type ScrollDirection = 'up' | 'down'

const THRESHOLD_PX = 8
const TOP_REGION_PX = 80

/**
 * Tracks whether the user last scrolled up or down. Always reports 'up'
 * near the top of the page so a hide-on-scroll header is visible on load.
 */
export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('up')

  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      if (y <= TOP_REGION_PX) {
        setDirection('up')
        lastY = y
        return
      }
      const delta = y - lastY
      if (Math.abs(delta) < THRESHOLD_PX) return
      setDirection(delta > 0 ? 'down' : 'up')
      lastY = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return direction
}
