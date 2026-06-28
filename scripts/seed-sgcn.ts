/**
 * Seed script: flag specimens that are Texas Species of Greatest Conservation
 * Need (SGCN).
 *
 * Unlike NatureServe and IUCN (seeded from live APIs by seed-conservation.ts),
 * the Texas Parks & Wildlife Department (TPWD) State Wildlife Action Plan SGCN
 * list has no public API, so it ships as a static CSV checked into the repo at
 * src/data/tpwd-sgcn-list.csv. This script adds a nullable `texas_sgcn` column
 * to the existing `specimens` table and sets it to 'SGCN' for every specimen
 * whose binomial (genus + species) exactly matches a name on the list.
 *
 * SGCN is binary (listed / not listed), so there is no rank to store — the
 * column's presence is the signal. The script AUGMENTS the existing DB (never
 * drops it) and is safe to re-run: it recomputes the flag for every specimen.
 *
 * Usage:
 *   npx tsx scripts/seed-sgcn.ts
 *
 * Then push to Turso (production):
 *   sqlite3 imrs-species.db "PRAGMA wal_checkpoint(TRUNCATE);"
 *   turso db import imrs-species.db
 */

import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { isSgcnListed, parseSgcnBinomials } from './conservation-sources'

const DB_PATH = path.join(process.cwd(), 'imrs-species.db')
const CSV_PATH = path.join(process.cwd(), 'src/data/tpwd-sgcn-list.csv')

interface SpecimenRow {
  id: number
  genus: string
  species: string
}

function ensureColumn(db: Database.Database) {
  try {
    db.exec('ALTER TABLE specimens ADD COLUMN texas_sgcn TEXT')
  } catch (err) {
    // Re-runnable: ignore "duplicate column name" if it already exists.
    if (!String((err as Error).message).includes('duplicate column')) throw err
  }
}

function main() {
  const listed = parseSgcnBinomials(fs.readFileSync(CSV_PATH, 'utf8'))
  console.log(`Loaded ${listed.size} SGCN names from ${CSV_PATH}`)

  const db = new Database(DB_PATH)
  ensureColumn(db)

  const targets = db
    .prepare(
      `SELECT id, genus, species FROM specimens
       WHERE genus IS NOT NULL AND TRIM(genus) <> ''
         AND species IS NOT NULL AND TRIM(species) <> ''`,
    )
    .all() as Array<SpecimenRow>

  const update = db.prepare('UPDATE specimens SET texas_sgcn = ? WHERE id = ?')

  let matched = 0
  const applyAll = db.transaction((rows: Array<SpecimenRow>) => {
    for (const row of rows) {
      const flag = isSgcnListed(row.genus, row.species, listed) ? 'SGCN' : null
      if (flag) matched++
      update.run(flag, row.id)
    }
  })
  applyAll(targets)

  db.pragma('wal_checkpoint(TRUNCATE)')
  db.close()

  console.log('\n--- Coverage ---')
  console.log(`  Specimens scanned: ${targets.length}`)
  console.log(`  SGCN matched:      ${matched}`)
  console.log(`\nDone! Updated ${DB_PATH}`)
  console.log('To push to Turso: turso db import imrs-species.db')
}

main()
