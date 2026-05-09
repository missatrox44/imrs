import { createServerFn } from '@tanstack/react-start'
import type { WeatherSummary } from '@/types/weather'
import { getTurso } from '@/server/turso'
import { sparklineQuery, summaryQuery } from '@/server/weatherQueries'

interface WeatherFilterInput {
  year: string
  season: string
}

export const fetchWeatherSummary = createServerFn({ method: 'GET' })
  .validator(
    (input: WeatherFilterInput): WeatherFilterInput => ({
      year: input.year,
      season: input.season,
    }),
  )
  .handler(async ({ data }): Promise<WeatherSummary> => {
    const client = getTurso()

    const stats = summaryQuery(data.year, data.season)
    const statsResult = await client.execute({
      sql: stats.sql,
      args: stats.args,
    })
    const row =
      (statsResult.rows[0] as Record<string, unknown> | undefined) ?? {}

    const spark = sparklineQuery(data.year, data.season)
    const sparkResult = await client.execute({
      sql: spark.sql,
      args: spark.args,
    })
    const sparkRows = sparkResult.rows as unknown as Array<
      Record<string, unknown>
    >

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
  })
