/**
 * Seed script: parse Excel weather data files and create imrs-weather.db
 *
 * Usage:
 *   npx tsx scripts/seed-weather.ts
 *
 * Expects files named Indio_weather_data_[year]_Hill_station.xlsx in project root.
 * Creates imrs-weather.db with three tables:
 *   - weather_readings (raw 15-min data)
 *   - weather_daily (pre-aggregated daily)
 *   - weather_hourly (pre-aggregated hourly)
 */

import path from 'node:path'
import fs from 'node:fs'
import Database from 'better-sqlite3'
import XLSX from 'xlsx'

const DB_PATH = path.join(process.cwd(), 'imrs-weather.db')
const DATA_YEARS = [2020, 2021, 2022, 2023, 2024]

// Excel serial date → ISO string
// Excel epoch: Dec 30, 1899 (due to the 1900 leap year bug)
function excelDateToISO(serial: number): string {
  const excelEpoch = new Date(1899, 11, 30)
  const ms = serial * 86400000
  const date = new Date(excelEpoch.getTime() + ms)
  return date.toISOString()
}

function createTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS weather_readings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      recorded_at TEXT NOT NULL,
      rain_mm     REAL,
      wind_speed  REAL,
      gust_speed  REAL,
      pressure    REAL,
      temp_c      REAL,
      rh_pct      REAL,
      dewpt_c     REAL
    );

    CREATE TABLE IF NOT EXISTS weather_daily (
      date_local    TEXT PRIMARY KEY,
      year          INTEGER NOT NULL,
      month         INTEGER NOT NULL,
      temp_min      REAL,
      temp_max      REAL,
      temp_avg      REAL,
      rh_min        REAL,
      rh_max        REAL,
      rh_avg        REAL,
      dewpt_avg     REAL,
      rain_total    REAL,
      wind_avg      REAL,
      gust_max      REAL,
      pressure_avg  REAL,
      pressure_min  REAL,
      pressure_max  REAL,
      reading_count INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weather_hourly (
      date_local    TEXT NOT NULL,
      hour          INTEGER NOT NULL,
      temp_avg      REAL,
      rh_avg        REAL,
      wind_avg      REAL,
      rain_total    REAL,
      pressure_avg  REAL,
      reading_count INTEGER NOT NULL,
      PRIMARY KEY (date_local, hour)
    );
  `)
}

function createIndexes(db: Database.Database) {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_readings_recorded_at ON weather_readings(recorded_at);
    CREATE INDEX IF NOT EXISTS idx_daily_year ON weather_daily(year);
    CREATE INDEX IF NOT EXISTS idx_daily_year_month ON weather_daily(year, month);
    CREATE INDEX IF NOT EXISTS idx_hourly_date ON weather_hourly(date_local);
  `)
}

function insertReadings(db: Database.Database) {
  const insert = db.prepare(`
    INSERT INTO weather_readings (recorded_at, rain_mm, wind_speed, gust_speed, pressure, temp_c, rh_pct, dewpt_c)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertMany = db.transaction(
    (rows: (string | number | null)[][]) => {
      for (const row of rows) {
        insert.run(...row)
      }
    },
  )

  let totalRows = 0

  for (const year of DATA_YEARS) {
    const fileName = `Indio_weather_data_${year}_Hill_station.xlsx`
    const filePath = path.join(process.cwd(), fileName)

    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping ${fileName} — file not found`)
      continue
    }

    console.log(`Reading ${fileName}...`)
    const wb = XLSX.readFile(filePath)
    const ws = wb.Sheets[wb.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
      header: 1,
    })

    // Row 0: title, Row 1: headers, Row 2+: data
    const rows: (string | number | null)[][] = []
    for (let i = 2; i < data.length; i++) {
      const r = data[i]
      if (!r || r.length < 2) continue

      const serialDate = r[1]
      if (typeof serialDate !== 'number') continue

      const isoDate = excelDateToISO(serialDate)
      const rain = r[2] != null ? Number(r[2]) : null
      const windSpeed = r[3] != null ? Number(r[3]) : null
      const gustSpeed = r[4] != null ? Number(r[4]) : null
      const pressure = r[5] != null ? Number(r[5]) : null
      const tempC = r[6] != null ? Number(r[6]) : null
      const rhPct = r[7] != null ? Number(r[7]) : null
      const dewptC = r[8] != null ? Number(r[8]) : null

      rows.push([isoDate, rain, windSpeed, gustSpeed, pressure, tempC, rhPct, dewptC])
    }

    console.log(`  Parsed ${rows.length} readings from ${year}`)
    insertMany(rows)
    totalRows += rows.length
  }

  console.log(`Total readings inserted: ${totalRows}`)
}

function aggregateDaily(db: Database.Database) {
  console.log('Aggregating daily data...')
  db.exec(`
    INSERT OR REPLACE INTO weather_daily
    SELECT
      DATE(recorded_at) as date_local,
      CAST(strftime('%Y', recorded_at) AS INTEGER) as year,
      CAST(strftime('%m', recorded_at) AS INTEGER) as month,
      ROUND(MIN(temp_c), 2) as temp_min,
      ROUND(MAX(temp_c), 2) as temp_max,
      ROUND(AVG(temp_c), 2) as temp_avg,
      ROUND(MIN(rh_pct), 2) as rh_min,
      ROUND(MAX(rh_pct), 2) as rh_max,
      ROUND(AVG(rh_pct), 2) as rh_avg,
      ROUND(AVG(dewpt_c), 2) as dewpt_avg,
      ROUND(SUM(rain_mm), 2) as rain_total,
      ROUND(AVG(wind_speed), 2) as wind_avg,
      ROUND(MAX(gust_speed), 2) as gust_max,
      ROUND(AVG(pressure), 2) as pressure_avg,
      ROUND(MIN(pressure), 2) as pressure_min,
      ROUND(MAX(pressure), 2) as pressure_max,
      COUNT(*) as reading_count
    FROM weather_readings
    GROUP BY DATE(recorded_at)
  `)
  const count = db.prepare('SELECT COUNT(*) as c FROM weather_daily').get() as { c: number }
  console.log(`  Daily rows: ${count.c}`)
}

function aggregateHourly(db: Database.Database) {
  console.log('Aggregating hourly data...')
  db.exec(`
    INSERT OR REPLACE INTO weather_hourly
    SELECT
      DATE(recorded_at) as date_local,
      CAST(strftime('%H', recorded_at) AS INTEGER) as hour,
      ROUND(AVG(temp_c), 2) as temp_avg,
      ROUND(AVG(rh_pct), 2) as rh_avg,
      ROUND(AVG(wind_speed), 2) as wind_avg,
      ROUND(SUM(rain_mm), 2) as rain_total,
      ROUND(AVG(pressure), 2) as pressure_avg,
      COUNT(*) as reading_count
    FROM weather_readings
    GROUP BY DATE(recorded_at), CAST(strftime('%H', recorded_at) AS INTEGER)
  `)
  const count = db.prepare('SELECT COUNT(*) as c FROM weather_hourly').get() as { c: number }
  console.log(`  Hourly rows: ${count.c}`)
}

function main() {
  // Remove existing db
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log('Removed existing imrs-weather.db')
  }

  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = OFF') // faster inserts for bulk seed

  console.log('Creating tables...')
  createTables(db)

  console.log('Inserting readings from Excel files...')
  insertReadings(db)

  aggregateDaily(db)
  aggregateHourly(db)

  console.log('Creating indexes...')
  createIndexes(db)

  // Reset synchronous for normal usage
  db.pragma('synchronous = NORMAL')
  db.close()

  console.log(`\nDone! Database created at ${DB_PATH}`)
  console.log('\nTo push to Turso:')
  console.log('  turso db shell <your-db-name> < weather-schema.sql')
  console.log('  -- or --')
  console.log('  turso db import imrs-weather.db')
}

main()
