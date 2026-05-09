import { describe, expect, it } from 'vitest'
import {
  rowToDaily,
  rowToHourly,
  rowToMonsoon,
  rowToWindBin,
} from './weatherMapper'

describe('rowToDaily', () => {
  it('coerces numeric strings and preserves nulls via toNum', () => {
    const result = rowToDaily({
      date_local: '2024-07-15',
      year: '2024',
      month: '7',
      temp_min: '15.5',
      temp_max: null,
      temp_avg: undefined,
      rh_min: '',
      rh_max: '60',
      rh_avg: '50',
      dewpt_avg: '12',
      rain_total: '0',
      wind_avg: '5.2',
      gust_max: '10',
      pressure_avg: '1013',
      pressure_min: '1010',
      pressure_max: '1015',
      reading_count: '24',
    })

    expect(result.date_local).toBe('2024-07-15')
    expect(result.year).toBe(2024)
    expect(result.month).toBe(7)
    expect(result.temp_min).toBe(15.5)
    expect(result.temp_max).toBeNull()
    expect(result.temp_avg).toBeNull()
    expect(result.rh_min).toBeNull()
    expect(result.rh_max).toBe(60)
    expect(result.reading_count).toBe(24)
  })

  it('treats non-numeric strings as null', () => {
    const result = rowToDaily({
      date_local: '2024-01-01',
      year: 2024,
      month: 1,
      temp_min: 'abc',
      temp_max: 0,
      temp_avg: 0,
      rh_min: 0,
      rh_max: 0,
      rh_avg: 0,
      dewpt_avg: 0,
      rain_total: 0,
      wind_avg: 0,
      gust_max: 0,
      pressure_avg: 0,
      pressure_min: 0,
      pressure_max: 0,
      reading_count: 0,
    })
    expect(result.temp_min).toBeNull()
    expect(result.temp_max).toBe(0)
  })
})

describe('rowToHourly', () => {
  it('returns the expected shape', () => {
    const result = rowToHourly({
      date_local: '2024-07-15',
      hour: '13',
      temp_avg: '28',
      rh_avg: '45',
      wind_avg: '6',
      rain_total: null,
      pressure_avg: '1011',
      reading_count: '4',
    })
    expect(result).toEqual({
      date_local: '2024-07-15',
      hour: 13,
      temp_avg: 28,
      rh_avg: 45,
      wind_avg: 6,
      rain_total: null,
      pressure_avg: 1011,
      reading_count: 4,
    })
  })
})

describe('rowToMonsoon', () => {
  it('coerces snake_case fields to camelCase numbers', () => {
    const result = rowToMonsoon({
      year: '2023',
      total_precip: '125.5',
      avg_humidity: '65',
      temp_anomaly: '-1.2',
    })
    expect(result).toEqual({
      year: 2023,
      totalPrecip: 125.5,
      avgHumidity: 65,
      tempAnomaly: -1.2,
    })
  })
})

describe('rowToWindBin', () => {
  it('preserves range string and coerces counts', () => {
    const result = rowToWindBin({
      range: '5-10',
      count: '120',
      gust_count: '8',
    })
    expect(result).toEqual({ range: '5-10', count: 120, gustCount: 8 })
  })
})
