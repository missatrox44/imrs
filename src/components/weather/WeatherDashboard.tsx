import { Route } from '@/routes/weather'
import WeatherFilterBar from './WeatherFilterBar'
import WeatherStatCards from './WeatherStatCards'
import WeatherTimeSeries from './WeatherTimeSeries'
import { useWeatherSummary, useWeatherDaily } from '@/hooks/useWeatherData'
import type { WeatherFilters } from '@/types/weather'

export default function WeatherDashboard() {
  const { year, season, variable } = Route.useSearch()
  const filters: WeatherFilters = { year, season, variable }

  const { data: summary, isLoading: summaryLoading } =
    useWeatherSummary(filters)
  const { data: daily, isLoading: dailyLoading } = useWeatherDaily(filters)

  return (
    <main id="main-content" className="container mx-auto px-4 py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Climate &amp; Weather</h1>
        <p className="text-sm text-muted-foreground">
          Hill Station &middot; Indio Mountains Research Station &middot;
          2020&ndash;2024 &middot; 15-minute intervals
        </p>
      </div>

      <section className="mb-8">
        <WeatherFilterBar />
      </section>

      <section className="mb-8">
        <WeatherStatCards summary={summary} isLoading={summaryLoading} />
      </section>

      <section className="mb-8">
        <WeatherTimeSeries
          data={daily}
          variable={variable}
          isLoading={dailyLoading}
        />
      </section>
    </main>
  )
}
