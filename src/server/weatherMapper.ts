import type {
  MonsoonComparison,
  WeatherDailyRow,
  WeatherHourlyRow,
  WindSpeedBin,
} from '@/types/weather'

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

export function rowToDaily(row: Record<string, unknown>): WeatherDailyRow {
  return {
    date_local: String(row.date_local),
    year: Number(row.year),
    month: Number(row.month),
    temp_min: toNum(row.temp_min),
    temp_max: toNum(row.temp_max),
    temp_avg: toNum(row.temp_avg),
    rh_min: toNum(row.rh_min),
    rh_max: toNum(row.rh_max),
    rh_avg: toNum(row.rh_avg),
    dewpt_avg: toNum(row.dewpt_avg),
    rain_total: toNum(row.rain_total),
    wind_avg: toNum(row.wind_avg),
    gust_max: toNum(row.gust_max),
    pressure_avg: toNum(row.pressure_avg),
    pressure_min: toNum(row.pressure_min),
    pressure_max: toNum(row.pressure_max),
    reading_count: Number(row.reading_count),
  }
}

export function rowToHourly(row: Record<string, unknown>): WeatherHourlyRow {
  return {
    date_local: String(row.date_local),
    hour: Number(row.hour),
    temp_avg: toNum(row.temp_avg),
    rh_avg: toNum(row.rh_avg),
    wind_avg: toNum(row.wind_avg),
    rain_total: toNum(row.rain_total),
    pressure_avg: toNum(row.pressure_avg),
    reading_count: Number(row.reading_count),
  }
}

export function rowToMonsoon(row: Record<string, unknown>): MonsoonComparison {
  return {
    year: Number(row.year),
    totalPrecip: Number(row.total_precip),
    avgHumidity: Number(row.avg_humidity),
    tempAnomaly: Number(row.temp_anomaly),
  }
}

export function rowToWindBin(row: Record<string, unknown>): WindSpeedBin {
  return {
    range: String(row.range),
    count: Number(row.count),
    gustCount: Number(row.gust_count),
  }
}
