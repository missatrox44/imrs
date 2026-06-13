import { describe, expect, it } from 'vitest'
import { buildWeatherSummary } from './weatherTransforms'

describe('buildWeatherSummary', () => {
  it('returns null stats and empty sparklines for empty rows', async () => {
    const summary = await buildWeatherSummary('all', 'all', () =>
      Promise.resolve([]),
    )

    expect(summary.avgDailyHigh).toBeNull()
    expect(summary.totalPrecip).toBeNull()
    expect(summary.avgHumidity).toBeNull()
    expect(summary.avgWindSpeed).toBeNull()
    expect(summary.sparklines).toEqual({
      temp: [],
      precip: [],
      humidity: [],
      wind: [],
    })
  })

  it('shapes stats and collects sparkline points', async () => {
    let call = 0
    const summary = await buildWeatherSummary('all', 'all', () => {
      call += 1
      // first call: stats query, second call: sparkline query
      if (call === 1) {
        return Promise.resolve([
          {
            avg_daily_high: '32.5',
            total_precip: '120',
            avg_humidity: '55',
            avg_wind_speed: '6',
          },
        ])
      }
      return Promise.resolve([
        { temp_max: '30', rain_total: '0', rh_avg: '50', wind_avg: '5' },
        { temp_max: '32', rain_total: '1.2', rh_avg: '52', wind_avg: '6' },
      ])
    })

    expect(summary.avgDailyHigh).toBe(32.5)
    expect(summary.totalPrecip).toBe(120)
    expect(summary.sparklines.temp).toEqual([30, 32])
    expect(summary.sparklines.precip).toEqual([0, 1.2])
  })

  it('downsamples to roughly 30 points using a step', async () => {
    const sparkRows = Array.from({ length: 60 }, (_, i) => ({
      temp_max: String(i),
      rain_total: '0',
      rh_avg: '50',
      wind_avg: '5',
    }))

    let call = 0
    const summary = await buildWeatherSummary('all', 'all', () => {
      call += 1
      return Promise.resolve(call === 1 ? [{}] : sparkRows)
    })

    // step = floor(60 / 30) = 2 → 30 sampled points
    expect(summary.sparklines.temp).toHaveLength(30)
    expect(summary.sparklines.temp[0]).toBe(0)
    expect(summary.sparklines.temp[1]).toBe(2)
  })
})
