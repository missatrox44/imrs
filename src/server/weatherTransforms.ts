import type { WeatherSummary } from '@/types/weather'
import { sparklineQuery, summaryQuery } from '@/server/weatherQueries'

type WeatherRow = Record<string, unknown>

interface WeatherQuery {
  sql: string
  args: Array<string | number>
}

type RunQuery = (query: WeatherQuery) => Promise<Array<WeatherRow>>

// Downsample sparkline rows to ~30 points and shape the summary stats.
// Shared by the server fn (weatherService) and the API route (api/weather)
// so the downsampling logic lives in exactly one place.
export async function buildWeatherSummary(
  year: string,
  season: string,
  runQuery: RunQuery,
): Promise<WeatherSummary> {
  const statsRows = await runQuery(summaryQuery(year, season))
  const row = statsRows[0] ?? {}

  const sparkRows = await runQuery(sparklineQuery(year, season))
  const step = Math.max(1, Math.floor(sparkRows.length / 30))
  const temp: Array<number> = []
  const precip: Array<number> = []
  const humidity: Array<number> = []
  const wind: Array<number> = []

  for (let i = 0; i < sparkRows.length; i += step) {
    const r = sparkRows[i]
    if (r.temp_max != null) temp.push(Number(r.temp_max))
    if (r.rain_total != null) precip.push(Number(r.rain_total))
    if (r.rh_avg != null) humidity.push(Number(r.rh_avg))
    if (r.wind_avg != null) wind.push(Number(r.wind_avg))
  }

  return {
    avgDailyHigh:
      row.avg_daily_high != null ? Number(row.avg_daily_high) : null,
    totalPrecip: row.total_precip != null ? Number(row.total_precip) : null,
    avgHumidity: row.avg_humidity != null ? Number(row.avg_humidity) : null,
    avgWindSpeed:
      row.avg_wind_speed != null ? Number(row.avg_wind_speed) : null,
    sparklines: { temp, precip, humidity, wind },
  }
}
