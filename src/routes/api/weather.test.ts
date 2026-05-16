import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Route } from './weather'

// Mock createFileRoute so `Route` is just the config object passed to it,
// letting us invoke the server `GET` handler directly from the test.
// vitest hoists vi.mock above the import, so `Route` receives the mock.
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: Record<string, unknown>) => options,
}))

const execute = vi.fn()
vi.mock('@/server/turso', () => ({
  getTurso: () => ({ execute }),
}))

type RouteConfig = {
  server: {
    handlers: { GET: (ctx: { request: Request }) => Promise<Response> }
  }
}

function callGet(query: Record<string, string> = {}) {
  const params = new URLSearchParams(query)
  const request = new Request(`http://localhost/api/weather?${params}`)
  return (Route as unknown as RouteConfig).server.handlers.GET({ request })
}

describe('GET /api/weather', () => {
  beforeEach(() => execute.mockReset())
  afterEach(() => vi.restoreAllMocks())

  it('returns 400 for an unknown view', async () => {
    const res = await callGet({ view: 'bogus' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Unknown view: bogus' })
  })

  it('daily view returns mapped daily rows with cache headers', async () => {
    execute.mockResolvedValueOnce({
      rows: [
        {
          date_local: '2024-07-15',
          year: '2024',
          month: '7',
          temp_min: '15',
          temp_max: '30',
          temp_avg: '22',
          rh_min: '20',
          rh_max: '60',
          rh_avg: '40',
          dewpt_avg: '12',
          rain_total: '0',
          wind_avg: '4',
          gust_max: '8',
          pressure_avg: '1013',
          pressure_min: '1010',
          pressure_max: '1015',
          reading_count: '24',
        },
      ],
    })

    const res = await callGet({ view: 'daily', year: 'all', season: 'all' })

    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toMatch(/max-age=86400/)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0]).toMatchObject({
      date_local: '2024-07-15',
      year: 2024,
      temp_min: 15,
      temp_max: 30,
    })
  })

  it('passes monsoon season months as SQL args', async () => {
    execute.mockResolvedValueOnce({ rows: [] })

    await callGet({ view: 'daily', year: '2024', season: 'monsoon' })

    expect(execute).toHaveBeenCalledTimes(1)
    const callArg = execute.mock.calls[0][0] as {
      sql: string
      args: Array<unknown>
    }
    expect(callArg.args).toContain(2024) // year filter
    expect(callArg.args).toEqual(expect.arrayContaining([7, 8, 9])) // monsoon months
    expect(callArg.sql).toMatch(/WHERE/)
  })

  it('summary view executes two queries and returns sparklines', async () => {
    // first call: stats query, second call: sparkline query
    execute
      .mockResolvedValueOnce({
        rows: [
          {
            avg_daily_high: '32.5',
            total_precip: '120',
            avg_humidity: '55',
            avg_wind_speed: '6',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { temp_max: '30', rain_total: '0', rh_avg: '50', wind_avg: '5' },
          { temp_max: '32', rain_total: '1.2', rh_avg: '52', wind_avg: '6' },
        ],
      })

    const res = await callGet({ view: 'summary', year: 'all', season: 'all' })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.avgDailyHigh).toBe(32.5)
    expect(body.totalPrecip).toBe(120)
    expect(body.avgHumidity).toBe(55)
    expect(body.avgWindSpeed).toBe(6)
    expect(body.sparklines.temp).toEqual([30, 32])
    expect(execute).toHaveBeenCalledTimes(2)
  })

  it('returns 500 when the database throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    execute.mockRejectedValueOnce(new Error('boom'))

    const res = await callGet({ view: 'daily' })

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Failed to fetch weather data' })
  })
})
