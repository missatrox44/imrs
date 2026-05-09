import { describe, expect, it } from 'vitest'
import { formatElevation } from './formatElevation'

describe('formatElevation', () => {
  it('returns "Unknown elevation" for undefined input', () => {
    expect(formatElevation()).toBe('Unknown elevation')
  })

  it('formats meters with locale separators and a trailing unit', () => {
    expect(formatElevation(1500)).toBe('1,500 m')
  })

  it('handles zero', () => {
    expect(formatElevation(0)).toBe('0 m')
  })

  it('handles large values', () => {
    expect(formatElevation(2_345_678)).toBe('2,345,678 m')
  })
})
