import path from 'node:path'
import Database from 'better-sqlite3'

let _db: Database.Database | null = null
let _weatherDb: Database.Database | null = null

export function getDb() {
  if (!_db) {
    const dbPath = path.join(process.cwd(), 'imrs-species.db')
    console.log("Using SQLite DB:", dbPath);

    _db = new Database(dbPath)
    _db.pragma('journal_mode = WAL')
  }
  return _db
}

export function getWeatherDb() {
  if (!_weatherDb) {
    const dbPath = path.join(process.cwd(), 'imrs-weather.db')
    console.log("Using Weather SQLite DB:", dbPath);

    _weatherDb = new Database(dbPath)
    _weatherDb.pragma('journal_mode = WAL')
  }
  return _weatherDb
}