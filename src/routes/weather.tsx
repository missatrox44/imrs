import { createFileRoute } from '@tanstack/react-router'
import type { Season, WeatherVariable } from '@/types/weather'
import { Loader } from '@/components/Loader'
import WeatherDashboard from '@/components/weather/WeatherDashboard'

type WeatherSearch = {
  year: string
  season: Season
  variable: WeatherVariable
}

export const Route = createFileRoute('/weather')({
  ssr: 'data-only',

  validateSearch: (search: Record<string, unknown>): WeatherSearch => ({
    year: (search.year as string) || 'all',
    season: (search.season as Season) || 'all',
    variable: (search.variable as WeatherVariable) || 'all',
  }),

  loader: async ({ location }) => {
    const params = new URLSearchParams({
      view: 'summary',
      year: (location.search as WeatherSearch).year || 'all',
      season: (location.search as WeatherSearch).season || 'all',
    })
    const res = await fetch(`/api/weather?${params}`)
    if (!res.ok) throw new Error('Failed to fetch weather data')
    return res.json()
  },

  pendingComponent: () => <Loader dataTitle="weather data" />,
  component: WeatherPage,
  head: () => ({
    title: 'Weather | IMRS',
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'IMRS Weather Data',
          description:
            'Five years of 15-minute interval weather observations from the Indio Mountains Research Station Hill weather station.',
        }),
      },
    ],
  }),
})

function WeatherPage() {
  return <WeatherDashboard />
}
