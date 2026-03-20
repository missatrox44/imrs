import { Route } from '@/routes/weather'
import WeatherFilterBar from './WeatherFilterBar'
import type { WeatherFilters } from '@/types/weather'

export default function WeatherDashboard() {
  const { year, season, variable } = Route.useSearch()
  const filters: WeatherFilters = { year, season, variable }

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

      <p className="text-sm text-muted-foreground">
        Weather dashboard charts coming soon. Active filters: year={filters.year}
        , season={filters.season}, variable={filters.variable}
      </p>
    </main>
  )
}
