import type { Season } from '@/types/weather'

export const SEASONS: Record<
  Exclude<Season, 'all'>,
  { months: Array<number>; label: string }
> = {
  winter: { months: [11, 12, 1, 2, 3], label: 'Winter (Nov\u2013Mar)' },
  premonsoon: { months: [4, 5, 6], label: 'Pre-monsoon (Apr\u2013Jun)' },
  monsoon: { months: [7, 8, 9], label: 'Monsoon (Jul\u2013Sep)' },
  postmonsoon: { months: [10], label: 'Post-monsoon (Oct)' },
} as const

export function getSeasonMonthsClause(season: string): Array<number> | null {
  if (season === 'all') return null
  const key = season as Exclude<Season, 'all'>
  if (!(key in SEASONS)) return null
  return SEASONS[key].months
}

export function isMonsoonMonth(month: number): boolean {
  return SEASONS.monsoon.months.includes(month)
}
