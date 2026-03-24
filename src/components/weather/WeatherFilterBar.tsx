import { useNavigate } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'
import type { Season } from '@/types/weather'
import { Route } from '@/routes/weather'
import { Button } from '@/components/ui/button'
import { SEASONS } from '@/lib/weatherUtils'

const YEARS = ['all', '2020', '2021', '2022', '2023', '2024'] as const

const SEASON_OPTIONS: Array<{ key: Season; label: string }> = [
  { key: 'all', label: 'All Seasons' },
  ...Object.entries(SEASONS).map(([key, val]) => ({
    key: key as Season,
    label: val.label,
  })),
]

export default function WeatherFilterBar() {
  const navigate = useNavigate()
  const { year, season } = Route.useSearch()

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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Year</span>
        <div className="flex flex-wrap gap-1.5">
          {YEARS.map((y) => (
            <Button
              key={y}
              variant={year === y ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('year', y)}
              className="cursor-pointer"
            >
              {y === 'all' ? 'All' : y}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Season
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SEASON_OPTIONS.map((s) => (
            <Button
              key={s.key}
              variant={season === s.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('season', s.key)}
              className={`cursor-pointer ${
                s.key === 'monsoon' && season === 'monsoon'
                  ? 'bg-[hsl(170,60%,35%)] hover:bg-[hsl(170,60%,30%)]'
                  : ''
              }`}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset filters
        </Button>
      )}
    </div>
  )
}
