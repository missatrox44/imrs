import { getSeasonMonthsClause } from '@/lib/weatherUtils'

interface WhereClause {
  sql: string
  args: (string | number)[]
}

export function buildWhereClause(
  year: string,
  season: string,
): WhereClause {
  const conditions: string[] = []
  const args: (string | number)[] = []

  if (year !== 'all') {
    const years = year.split(',').map(Number).filter((n) => !Number.isNaN(n))
    if (years.length > 0) {
      conditions.push(`year IN (${years.map(() => '?').join(',')})`)
      args.push(...years)
    }
  }

  const months = getSeasonMonthsClause(season)
  if (months) {
    conditions.push(`month IN (${months.map(() => '?').join(',')})`)
    args.push(...months)
  }

  return {
    sql: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    args,
  }
}

export function dailyQuery(year: string, season: string) {
  const { sql, args } = buildWhereClause(year, season)
  return {
    sql: `SELECT * FROM weather_daily ${sql} ORDER BY date_local`,
    args,
  }
}

export function summaryQuery(year: string, season: string) {
  const { sql, args } = buildWhereClause(year, season)
  return {
    sql: `SELECT
      ROUND(AVG(temp_max), 1) as avg_daily_high,
      ROUND(SUM(rain_total), 1) as total_precip,
      ROUND(AVG(rh_avg), 1) as avg_humidity,
      ROUND(AVG(wind_avg), 1) as avg_wind_speed
    FROM weather_daily ${sql}`,
    args,
  }
}

export function sparklineQuery(year: string, season: string) {
  const { sql, args } = buildWhereClause(year, season)
  return {
    sql: `SELECT date_local, temp_max, rain_total, rh_avg, wind_avg
    FROM weather_daily ${sql}
    ORDER BY date_local`,
    args,
  }
}

export function hourlyQuery(year: string, season: string) {
  const { sql, args } = buildWhereClause(year, season)
  // hourly table doesn't have year/month columns, so filter via date range
  // Re-derive from daily table's dates
  return {
    sql: `SELECT h.* FROM weather_hourly h
    INNER JOIN (SELECT DISTINCT date_local FROM weather_daily ${sql}) d
    ON h.date_local = d.date_local
    ORDER BY h.date_local, h.hour`,
    args,
  }
}

export function monsoonQuery() {
  return {
    sql: `SELECT
      year,
      ROUND(SUM(rain_total), 1) as total_precip,
      ROUND(AVG(rh_avg), 1) as avg_humidity,
      ROUND(AVG(temp_avg) - (SELECT AVG(temp_avg) FROM weather_daily), 1) as temp_anomaly
    FROM weather_daily
    WHERE month IN (7, 8, 9)
    GROUP BY year
    ORDER BY year`,
    args: [],
  }
}

export function windDistributionQuery(year: string, season: string) {
  const { sql, args } = buildWhereClause(year, season)
  return {
    sql: `SELECT
      CASE
        WHEN wind_speed < 5 THEN '0-5'
        WHEN wind_speed < 10 THEN '5-10'
        WHEN wind_speed < 20 THEN '10-20'
        WHEN wind_speed < 30 THEN '20-30'
        ELSE '30+'
      END as range,
      COUNT(*) as count,
      SUM(CASE WHEN gust_speed >= 30 THEN 1 ELSE 0 END) as gust_count
    FROM weather_readings
    WHERE wind_speed IS NOT NULL
      ${sql ? 'AND ' + sql.replace('WHERE ', '') : ''}
    GROUP BY range
    ORDER BY CAST(range AS REAL)`,
    args,
  }
}

// Wind distribution needs year/month from the timestamp, so override for readings table
export function windDistributionQueryFromReadings(
  year: string,
  season: string,
) {
  const conditions: string[] = ['wind_speed IS NOT NULL']
  const args: (string | number)[] = []

  if (year !== 'all') {
    const years = year.split(',').map(Number).filter((n) => !Number.isNaN(n))
    if (years.length > 0) {
      conditions.push(
        `CAST(strftime('%Y', recorded_at) AS INTEGER) IN (${years.map(() => '?').join(',')})`,
      )
      args.push(...years)
    }
  }

  const months = getSeasonMonthsClause(season)
  if (months) {
    conditions.push(
      `CAST(strftime('%m', recorded_at) AS INTEGER) IN (${months.map(() => '?').join(',')})`,
    )
    args.push(...months)
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  return {
    sql: `SELECT
      CASE
        WHEN wind_speed < 5 THEN '0-5'
        WHEN wind_speed < 10 THEN '5-10'
        WHEN wind_speed < 20 THEN '10-20'
        WHEN wind_speed < 30 THEN '20-30'
        ELSE '30+'
      END as range,
      COUNT(*) as count,
      SUM(CASE WHEN gust_speed >= 30 THEN 1 ELSE 0 END) as gust_count
    FROM weather_readings
    ${whereClause}
    GROUP BY range
    ORDER BY
      CASE range
        WHEN '0-5' THEN 1
        WHEN '5-10' THEN 2
        WHEN '10-20' THEN 3
        WHEN '20-30' THEN 4
        ELSE 5
      END`,
    args,
  }
}
