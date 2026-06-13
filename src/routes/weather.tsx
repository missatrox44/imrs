import { createFileRoute } from '@tanstack/react-router'
import type { Season } from '@/types/weather'
import { Loader } from '@/components/Loader'
import WeatherDashboard from '@/components/weather/WeatherDashboard'
import { fetchWeatherSummary } from '@/server/weatherService'
import { SITE_URL } from '@/data/constants'

type WeatherSearch = {
  year: string
  season: Season
}

export const Route = createFileRoute('/weather')({
  validateSearch: (search: Record<string, unknown>): WeatherSearch => ({
    year: (search.year as string | undefined) ?? 'all',
    season: (search.season as Season | undefined) ?? 'all',
  }),

  ssr: 'data-only',

  loader: ({ location }) => {
    const search = location.search as WeatherSearch
    return fetchWeatherSummary({
      data: { year: search.year, season: search.season },
    })
  },

  pendingComponent: () => <Loader dataTitle="weather data" />,
  component: WeatherPage,
  head: () => ({
    meta: [
      { title: 'Weather | IMRS' },
      {
        name: 'description',
        content:
          'Five years of 15-minute interval climate data from the Indio Mountains Research Station Hill weather station — temperature, precipitation, humidity, wind, and pressure charts.',
      },
    ],
    links: [{ rel: 'canonical', href: SITE_URL + '/weather' }],
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
