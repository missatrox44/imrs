import { createServerFileRoute } from '@tanstack/react-start/server'
import { getTurso } from '@/server/turso'
import { getWeatherDb } from '@/server/db'
import {
  rowToDaily,
  rowToHourly,
  rowToMonsoon,
  rowToWindBin,
} from '@/server/weatherMapper'
import {
  dailyQuery,
  summaryQuery,
  sparklineQuery,
  hourlyQuery,
  monsoonQuery,
  windDistributionQueryFromReadings,
} from '@/server/weatherQueries'
import type { WeatherSummary } from '@/types/weather'

const CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=86400, s-maxage=604800',
}

interface QueryResult {
  rows: Record<string, unknown>[]
}

async function executeQuery(
  sql: string,
  args: (string | number)[],
): Promise<QueryResult> {
  // Try Turso first
  try {
    const client = getTurso()
    const result = await client.execute({ sql, args })
    return { rows: result.rows as unknown as Record<string, unknown>[] }
  } catch (tursoError) {
    console.warn('[API/weather] Turso failed, falling back to local SQLite')
  }

  // Fallback to local SQLite
  const db = getWeatherDb()
  const rows = db.prepare(sql).all(...args) as Record<string, unknown>[]
  return { rows }
}

export const ServerRoute = createServerFileRoute('/api/weather').methods({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const view = url.searchParams.get('view') || 'daily'
    const year = url.searchParams.get('year') || 'all'
    const season = url.searchParams.get('season') || 'all'

    try {
      switch (view) {
        case 'summary': {
          const stats = summaryQuery(year, season)
          const statsResult = await executeQuery(stats.sql, stats.args)
          const row = statsResult.rows[0] || {}

          const spark = sparklineQuery(year, season)
          const sparkResult = await executeQuery(spark.sql, spark.args)

          // Downsample sparklines to ~30 points
          const sparkRows = sparkResult.rows
          const step = Math.max(1, Math.floor(sparkRows.length / 30))
          const temp: number[] = []
          const precip: number[] = []
          const humidity: number[] = []
          const wind: number[] = []

          for (let i = 0; i < sparkRows.length; i += step) {
            const r = sparkRows[i]
            if (r.temp_max != null) temp.push(Number(r.temp_max))
            if (r.rain_total != null) precip.push(Number(r.rain_total))
            if (r.rh_avg != null) humidity.push(Number(r.rh_avg))
            if (r.wind_avg != null) wind.push(Number(r.wind_avg))
          }

          const summary: WeatherSummary = {
            avgDailyHigh:
              row.avg_daily_high != null ? Number(row.avg_daily_high) : null,
            totalPrecip:
              row.total_precip != null ? Number(row.total_precip) : null,
            avgHumidity:
              row.avg_humidity != null ? Number(row.avg_humidity) : null,
            avgWindSpeed:
              row.avg_wind_speed != null ? Number(row.avg_wind_speed) : null,
            sparklines: { temp, precip, humidity, wind },
          }

          return new Response(JSON.stringify(summary), {
            headers: CACHE_HEADERS,
          })
        }

        case 'daily': {
          const q = dailyQuery(year, season)
          const result = await executeQuery(q.sql, q.args)
          const data = result.rows.map(rowToDaily)
          return new Response(JSON.stringify(data), {
            headers: CACHE_HEADERS,
          })
        }

        case 'hourly': {
          const q = hourlyQuery(year, season)
          const result = await executeQuery(q.sql, q.args)
          const data = result.rows.map(rowToHourly)
          return new Response(JSON.stringify(data), {
            headers: CACHE_HEADERS,
          })
        }

        case 'monsoon': {
          const q = monsoonQuery()
          const result = await executeQuery(q.sql, q.args)
          const data = result.rows.map(rowToMonsoon)
          return new Response(JSON.stringify(data), {
            headers: CACHE_HEADERS,
          })
        }

        case 'wind': {
          const q = windDistributionQueryFromReadings(year, season)
          const result = await executeQuery(q.sql, q.args)
          const data = result.rows.map(rowToWindBin)
          return new Response(JSON.stringify(data), {
            headers: CACHE_HEADERS,
          })
        }

        default:
          return new Response(
            JSON.stringify({ error: `Unknown view: ${view}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
      }
    } catch (error) {
      console.error('[API/weather] Fetch failed:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch weather data' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }
  },
})
