import { getTurso } from './turso'

export async function ensureSchema() {
  const db = getTurso()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS specimens (
      id INTEGER PRIMARY KEY,
      category TEXT,
      kingdom TEXT,
      phylum TEXT,
      phylum_common_name TEXT,
      sub_phylum TEXT,
      sub_phylum_common_name TEXT,
      class_name TEXT,
      class_common_name TEXT,
      sub_class TEXT,
      sub_class_common_name TEXT,
      order_name TEXT,
      order_common_name TEXT,
      sub_order TEXT,
      sub_order_common_name TEXT,
      family TEXT,
      family_common_name TEXT,
      sub_family TEXT,
      sub_family_common_name TEXT,
      genus TEXT,
      species TEXT,
      authorship TEXT,
      collectors_field_numbers TEXT,
      note TEXT,
      species_common_name TEXT,
      records TEXT
    )
  `)
}