// 🌵 DOUBLE CHECK
import { getTurso } from './turso'

export async function ensureSchema() {
  const db = getTurso()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS specimen (
      id INTEGER PRIMARY KEY,
      category TEXT,
      kingdom TEXT,
      phylum TEXT,
      sub_phylum TEXT,
      class_name TEXT,
      order_name TEXT,
      family TEXT,
      genus TEXT,
      species TEXT,
      authorship TEXT,
      collectors_field_numbers TEXT,
      note TEXT,
      common_name TEXT,
      records TEXT
    )
  `)
}