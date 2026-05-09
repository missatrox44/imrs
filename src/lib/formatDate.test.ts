import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('returns "Unknown date" for undefined input', () => {
    expect(formatDate()).toBe('Unknown date')
  })

  it('returns "Unknown date" for empty string', () => {
    expect(formatDate('')).toBe('Unknown date')
  })

  it('formats a timestamp as en-US short month, numeric day, numeric year', () => {
    // mid-day UTC avoids local-timezone date shifts on either side of UTC
    expect(formatDate('2024-07-15T12:00:00Z')).toBe('Jul 15, 2024')
  })

  it('handles full ISO timestamps', () => {
    expect(formatDate('2024-12-25T12:00:00Z')).toMatch(/Dec \d{1,2}, 2024/)
  })
})
