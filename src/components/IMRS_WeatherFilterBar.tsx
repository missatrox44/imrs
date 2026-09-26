// Year and Season chip groups; selections navigate via URL search.
import { useId } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Season } from '@/types/weather'
import { Route } from '@/routes/weather'
import { SEASONS } from '@/lib/weatherUtils'

const YEARS = ['all', '2020', '2021', '2022', '2023', '2024'] as const

const SEASON_OPTIONS: Array<{ key: Season; label: string }> = [
  { key: 'all', label: 'All' },
  ...Object.entries(SEASONS).map(([key, val]) => ({
    key: key as Season,
    label: val.label,
  })),
]

const CHIP_CLASS =
  'cursor-pointer rounded-pill border px-[10px] py-px font-brand-mono text-xs leading-6 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper'
const CHIP_ACTIVE =
  'border-brand-green-dark bg-brand-green-dark text-brand-light'
const CHIP_IDLE = 'border-brand-ink text-brand-ink hover:bg-brand-sand'

const HEADING_CLASS =
  'font-brand-sans type-card-title tracking-[0.04em] text-brand-ink'

export const IMRS_WeatherFilterBar = () => {
  const navigate = useNavigate()
  const { year, season } = Route.useSearch()
  const yearId = useId()
  const seasonId = useId()

  const setFilter = (key: string, value: string) => {
    navigate({
      to: '/weather',
      search: { year, season, [key]: value },
      replace: true,
    })
  }

  const resetFilters = () => {
    navigate({
      to: '/weather',
      search: { year: 'all', season: 'all' },
      replace: true,
    })
  }

  const hasActiveFilters = year !== 'all' || season !== 'all'

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div
        role="group"
        aria-labelledby={yearId}
        className="flex flex-col gap-4 lg:gap-6"
      >
        <h2 id={yearId} className={HEADING_CLASS}>
          Year
        </h2>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => (
            <button
              key={y}
              type="button"
              aria-pressed={year === y}
              onClick={() => setFilter('year', y)}
              className={`${CHIP_CLASS} ${year === y ? CHIP_ACTIVE : CHIP_IDLE}`}
            >
              {y === 'all' ? 'All' : y}
            </button>
          ))}
        </div>
      </div>

      <div
        role="group"
        aria-labelledby={seasonId}
        className="flex flex-col gap-4 lg:gap-6"
      >
        <h2 id={seasonId} className={HEADING_CLASS}>
          Season
        </h2>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={season === s.key}
              onClick={() => setFilter('season', s.key)}
              className={`${CHIP_CLASS} ${season === s.key ? CHIP_ACTIVE : CHIP_IDLE}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-fit cursor-pointer font-brand-mono text-sm tracking-[0.04em] text-brand-gray underline-offset-4 hover:text-brand-ink hover:underline"
        >
          Reset filters
        </button>
      )}
    </div>
  )
}
