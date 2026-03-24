export type Season = 'all' | 'winter' | 'premonsoon' | 'monsoon' | 'postmonsoon'
export type WeatherVariable =
  | 'all'
  | 'temp'
  | 'humidity'
  | 'wind'
  | 'precip'
  | 'pressure'
  | 'dewpoint'
export type WeatherView =
  | 'summary'
  | 'daily'
  | 'hourly'
  | 'monsoon'
  | 'wind'

export interface WeatherFilters {
  year: string
  season: Season
}

export interface WeatherDailyRow {
  date_local: string
  year: number
  month: number
  temp_min: number | null
  temp_max: number | null
  temp_avg: number | null
  rh_min: number | null
  rh_max: number | null
  rh_avg: number | null
  dewpt_avg: number | null
  rain_total: number | null
  wind_avg: number | null
  gust_max: number | null
  pressure_avg: number | null
  pressure_min: number | null
  pressure_max: number | null
  reading_count: number
}

export interface WeatherHourlyRow {
  date_local: string
  hour: number
  temp_avg: number | null
  rh_avg: number | null
  wind_avg: number | null
  rain_total: number | null
  pressure_avg: number | null
  reading_count: number
}

export interface WeatherSummary {
  avgDailyHigh: number | null
  totalPrecip: number | null
  avgHumidity: number | null
  avgWindSpeed: number | null
  sparklines: {
    temp: Array<number>
    precip: Array<number>
    humidity: Array<number>
    wind: Array<number>
  }
}

export interface WindSpeedBin {
  range: string
  count: number
  gustCount: number
}

export interface MonsoonComparison {
  year: number
  totalPrecip: number
  avgHumidity: number
  tempAnomaly: number
}
