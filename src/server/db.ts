import path from 'node:path'
import Database from 'better-sqlite3'

let _db: Database.Database | null = null

export function getDb() {
  if (!_db) {
    const dbPath = path.join(process.cwd(), 'dev.db')
    console.log("Using SQLite DB:", dbPath);

    _db = new Database(dbPath)
    _db.pragma('journal_mode = WAL')
  }
  return _db
}