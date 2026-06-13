import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getTurso } from '@/server/turso'
import {
  rowToDaily,
  rowToHourly,
  rowToMonsoon,
  rowToWindBin,
} from '@/server/weatherMapper'
import {
  dailyQuery,
  hourlyQuery,
  monsoonQuery,
  windDistributionQueryFromReadings,
} from '@/server/weatherQueries'
import { buildWeatherSummary } from '@/server/weatherTransforms'
import { CACHE_HEADERS } from '@/data/constants'

const querySchema = z.object({
  view: z
    .enum(['summary', 'daily', 'hourly', 'monsoon', 'wind'])
    .default('daily'),
  year: z
    .string()
    .regex(/^(all|\d{4}(,\d{4})*)$/)
    .default('all'),
  season: z
    .enum(['all', 'winter', 'premonsoon', 'monsoon', 'postmonsoon'])
    .default('all'),
})

interface QueryResult {
  rows: Array<Record<string, unknown>>
}

async function executeQuery(
  sql: string,
  args: Array<string | number>,
): Promise<QueryResult> {
  const client = getTurso()
  const result = await client.execute({ sql, args })
  return { rows: result.rows as unknown as Array<Record<string, unknown>> }
}

export const Route = createFileRoute('/api/weather')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const parsed = querySchema.safeParse(
          Object.fromEntries(url.searchParams),
        )

        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: 'Invalid query parameters' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const { view, year, season } = parsed.data

        try {
          switch (view) {
            case 'summary': {
              const summary = await buildWeatherSummary(year, season, (q) =>
                executeQuery(q.sql, q.args).then((r) => r.rows),
              )

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
          }
        } catch (error) {
          console.error(
            '[API/weather] Fetch failed:',
            error instanceof Error ? error.message : 'Unknown error',
          )
          return new Response(
            JSON.stringify({ error: 'Failed to fetch weather data' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
