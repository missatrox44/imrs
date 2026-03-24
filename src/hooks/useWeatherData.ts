import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type {
  MonsoonComparison,
  WeatherDailyRow,
  WeatherFilters,
  WeatherHourlyRow,
  WeatherSummary,
  WindSpeedBin,
} from '@/types/weather'

const WEATHER_STALE_TIME = 1000 * 60 * 60 * 24 * 30 // 30 days
const WEATHER_GC_TIME = 1000 * 60 * 60 * 24 * 60 // 60 days

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

async function fetchWeather<T>(view: string, filters: WeatherFilters): Promise<T> {
  const res = await fetch(weatherUrl(view, filters))
  if (!res.ok) throw new Error(`Failed to fetch weather ${view}`)
  return res.json()
}

export function useWeatherSummary(filters: WeatherFilters) {
  return useQuery({
    queryKey: weatherQueryKey('summary', filters),
    queryFn: () => fetchWeather<WeatherSummary>('summary', filters),
    staleTime: WEATHER_STALE_TIME,
    gcTime: WEATHER_GC_TIME,
    placeholderData: keepPreviousData,
  })
}

export function useWeatherDaily(filters: WeatherFilters) {
  return useQuery({
    queryKey: weatherQueryKey('daily', filters),
    queryFn: () => fetchWeather<Array<WeatherDailyRow>>('daily', filters),
    staleTime: WEATHER_STALE_TIME,
    gcTime: WEATHER_GC_TIME,
    placeholderData: keepPreviousData,
  })
}

export function useWeatherHourly(filters: WeatherFilters) {
  return useQuery({
    queryKey: weatherQueryKey('hourly', filters),
    queryFn: () => fetchWeather<Array<WeatherHourlyRow>>('hourly', filters),
    staleTime: WEATHER_STALE_TIME,
    gcTime: WEATHER_GC_TIME,
    placeholderData: keepPreviousData,
  })
}

export function useWeatherMonsoon() {
  return useQuery({
    queryKey: ['weather', 'monsoon'],
    queryFn: () =>
      fetchWeather<Array<MonsoonComparison>>('monsoon', {
        year: 'all',
        season: 'all',
      }),
    staleTime: WEATHER_STALE_TIME,
    gcTime: WEATHER_GC_TIME,
  })
}

export function useWeatherWind(filters: WeatherFilters) {
  return useQuery({
    queryKey: weatherQueryKey('wind', filters),
    queryFn: () => fetchWeather<Array<WindSpeedBin>>('wind', filters),
    staleTime: WEATHER_STALE_TIME,
    gcTime: WEATHER_GC_TIME,
    placeholderData: keepPreviousData,
  })
}
