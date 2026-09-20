import { act, renderHook } from '@testing-library/react'
import { useScrollDirection } from './useScrollDirection'

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('useScrollDirection', () => {
  beforeEach(() => scrollTo(0))

  it('returns up near the top of the page', () => {
    const { result } = renderHook(() => useScrollDirection())
    expect(result.current).toBe('up')
  })

  it('returns down after scrolling down past the threshold', () => {
    const { result } = renderHook(() => useScrollDirection())
    scrollTo(200)
    expect(result.current).toBe('down')
  })

  it('returns up after scrolling back up mid-page', () => {
    const { result } = renderHook(() => useScrollDirection())
    scrollTo(400)
    scrollTo(300)
    expect(result.current).toBe('up')
  })

  it('ignores small jitter below the threshold', () => {
    const { result } = renderHook(() => useScrollDirection())
    scrollTo(400)
    scrollTo(397)
    expect(result.current).toBe('down')
  })

  it('returns up when scrolled back to the top region', () => {
    const { result } = renderHook(() => useScrollDirection())
    scrollTo(400)
    scrollTo(40)
    expect(result.current).toBe('up')
  })
})
