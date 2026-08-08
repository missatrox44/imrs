import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import type {
  WeatherDailyRow,
  WeatherFilters,
  WeatherSummary,
} from '@/types/weather'
import { GC_TIME, STALE_TIME } from '@/data/constants'
import { fetchWeatherSummary } from '@/server/weatherService'

function weatherUrl(view: string, filters: WeatherFilters): string {
  const params = new URLSearchParams({
    view,
    year: filters.year,
    season: filters.season,
  })
  return `/api/weather?${params}`
}

function weatherQueryKey(view: string, filters: WeatherFilters) {
  return ['weather', view, filters.year, filters.season] as const
}

async function fetchWeather<T>(
  view: string,
  filters: WeatherFilters,
): Promise<T> {
  const res = await fetch(weatherUrl(view, filters))
  if (!res.ok) throw new Error(`Failed to fetch weather ${view}`)
  return res.json()
}

// Shared by the /weather loader (ensureQueryData) and useWeatherSummary —
// one definition, one cache entry.
export function weatherSummaryQuery(filters: WeatherFilters) {
  return queryOptions({
    queryKey: weatherQueryKey('summary', filters),
    // An SSR loader cannot fetch a relative URL, so the server takes the
    // direct server-fn path; the browser keeps /api/weather for its
    // Cache-Control CDN headers.
    queryFn: () =>
      typeof window === 'undefined'
        ? fetchWeatherSummary({ data: filters })
        : fetchWeather<WeatherSummary>('summary', filters),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function weatherDailyQuery(filters: WeatherFilters) {
  return queryOptions({
    queryKey: weatherQueryKey('daily', filters),
    queryFn: () => fetchWeather<Array<WeatherDailyRow>>('daily', filters),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useWeatherSummary(filters: WeatherFilters) {
  return useQuery({
    ...weatherSummaryQuery(filters),
    placeholderData: keepPreviousData,
  })
}

export function useWeatherDaily(filters: WeatherFilters) {
  return useQuery({
    ...weatherDailyQuery(filters),
    placeholderData: keepPreviousData,
  })
}
