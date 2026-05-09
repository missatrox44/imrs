import { describe, expect, it } from 'vitest'
import { formatCoordinates } from './formatCoordinates'

describe('formatCoordinates', () => {
  it('returns "Coordinates unavailable" when both args are undefined', () => {
    expect(formatCoordinates()).toBe('Coordinates unavailable')
  })

  it('returns "Coordinates unavailable" when only lat is provided', () => {
    expect(formatCoordinates(30.5)).toBe('Coordinates unavailable')
  })

  it('returns "Coordinates unavailable" when only lon is provided', () => {
    expect(formatCoordinates(undefined, -104.5)).toBe('Coordinates unavailable')
  })

  it('formats valid coordinates with 5 decimal precision', () => {
    expect(formatCoordinates(30.12345, -104.67891)).toBe(
      '30.12345°N, 104.67891°W',
    )
  })

  it('applies Math.abs to a negative longitude', () => {
    expect(formatCoordinates(30, -104)).toBe('30.00000°N, 104.00000°W')
  })

  it('rounds to 5 decimals', () => {
    expect(formatCoordinates(30.123456789, -104.987654321)).toBe(
      '30.12346°N, 104.98765°W',
    )
  })
})
