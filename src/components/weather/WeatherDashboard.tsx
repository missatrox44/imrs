import { useMediaQuery } from '@uidotdev/usehooks'
import { Monitor } from 'lucide-react'
import WeatherFilterBar from './WeatherFilterBar'
import WeatherStatCards from './WeatherStatCards'
import WeatherTimeSeries from './WeatherTimeSeries'
import WeatherDataRequestDialog from './WeatherDataRequestDialog'
import type { WeatherFilters } from '@/types/weather'
import { Route } from '@/routes/weather'
import { useWeatherDaily, useWeatherSummary } from '@/hooks/useWeatherData'

export default function WeatherDashboard() {
  const { year, season } = Route.useSearch()
  const filters: WeatherFilters = { year, season }
  const isMobile = useMediaQuery('(max-width: 767px)')

  const { data: summary, isLoading: summaryLoading } =
    useWeatherSummary(filters)
  const { data: daily, isLoading: dailyLoading } = useWeatherDaily(filters)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Climate &amp; Weather</h1>
          <p className="text-sm text-muted-foreground">
            Hill Station &middot; Indio Mountains Research Station &middot;
            2020&ndash;2024
          </p>
        </div>
        <WeatherDataRequestDialog />
      </div>

      {isMobile && (
        <div
          role="note"
          className="mb-6 flex items-start gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
        >
          <Monitor className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            For the full set of interactive climate charts, this page is best
            experienced on a larger screen.
          </span>
        </div>
      )}

      <section className="mb-8">
        <WeatherFilterBar />
      </section>

      <section className="mb-8">
        <WeatherStatCards summary={summary} isLoading={summaryLoading} />
      </section>

      {!isMobile && (
        <section className="mb-8">
          <WeatherTimeSeries data={daily} isLoading={dailyLoading} />
        </section>
      )}
    </main>
  )
}
