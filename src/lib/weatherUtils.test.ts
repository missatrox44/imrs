import { describe, expect, it } from 'vitest'
import { SEASONS, getSeasonMonthsClause, isMonsoonMonth } from './weatherUtils'

describe('getSeasonMonthsClause', () => {
  it('returns null for "all"', () => {
    expect(getSeasonMonthsClause('all')).toBeNull()
  })

  it('returns the months array for a known season', () => {
    expect(getSeasonMonthsClause('monsoon')).toEqual(SEASONS.monsoon.months)
    expect(getSeasonMonthsClause('winter')).toEqual([11, 12, 1, 2, 3])
    expect(getSeasonMonthsClause('premonsoon')).toEqual([4, 5, 6])
    expect(getSeasonMonthsClause('postmonsoon')).toEqual([10])
  })

  it('returns null for an unknown season', () => {
    expect(getSeasonMonthsClause('summer')).toBeNull()
    expect(getSeasonMonthsClause('')).toBeNull()
  })
})

describe('isMonsoonMonth', () => {
  it.each([7, 8, 9])('returns true for monsoon month %i', (month) => {
    expect(isMonsoonMonth(month)).toBe(true)
  })

  it.each([1, 2, 3, 4, 5, 6, 10, 11, 12])(
    'returns false for non-monsoon month %i',
    (month) => {
      expect(isMonsoonMonth(month)).toBe(false)
    },
  )
})
