/**
 * Seed script: enrich imrs-species.db with conservation status.
 *
 * Adds four nullable columns to the existing `specimens` table and populates
 * them from two FREE sources (no live calls happen at app runtime — this is
 * precomputed):
 *   - NatureServe Explorer (no API key): global G-rank + Texas subnational
 *     S-rank, both from a single species-search request.
 *   - IUCN Red List API v4 (requires a registered token, seed-time only):
 *     Red List category. Set IUCN_API_TOKEN to enable; omit to skip IUCN.
 *
 * The script AUGMENTS the existing DB (never drops it) and is resumable: by
 * default it only processes species with no conservation data yet. Pass
 * --force to reprocess every species.
 *
 * Usage:
 *   IUCN_API_TOKEN=xxxx npx tsx scripts/seed-conservation.ts
 *   npx tsx scripts/seed-conservation.ts --force
 *
 * Then push to Turso (production):
 *   sqlite3 imrs-species.db "PRAGMA wal_checkpoint(TRUNCATE);"
 *   turso db import imrs-species.db
 */

import path from 'node:path'
import Database from 'better-sqlite3'
import {
  extractNatureServe,
  findNatureServeMatch,
  pickLatestIucnCategory,
} from './conservation-sources'
import type {
  IucnAssessment,
  NatureServeMatch,
  NatureServeResult,
} from './conservation-sources'

const DB_PATH = path.join(process.cwd(), 'imrs-species.db')
const NS_SEARCH = 'https://explorer.natureserve.org/api/data/speciesSearch'
const IUCN_BASE = 'https://api.iucnredlist.org/api/v4'
const IUCN_TOKEN = process.env.IUCN_API_TOKEN
const DELAY_MS = 1000
const FORCE = process.argv.includes('--force')

const NEW_COLUMNS = [
  'iucn_category',
  'natureserve_grank',
  'natureserve_srank_tx',
  'natureserve_id',
]

interface SpecimenRow {
  id: number
  genus: string
  species: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function ensureColumns(db: Database.Database) {
  for (const col of NEW_COLUMNS) {
    try {
      db.exec(`ALTER TABLE specimens ADD COLUMN ${col} TEXT`)
    } catch (err) {
      // Re-runnable: ignore "duplicate column name" if the column already exists.
      if (!String((err as Error).message).includes('duplicate column'))
        throw err
    }
  }
}

async function fetchNatureServe(
  name: string,
): Promise<NatureServeMatch | null> {
  const res = await fetch(NS_SEARCH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      criteriaType: 'species',
      textCriteria: [{ paramType: 'quickSearch', searchToken: name }],
    }),
  })
  if (!res.ok) throw new Error(`NatureServe HTTP ${res.status}`)
  const json = (await res.json()) as { results?: Array<NatureServeResult> }
  const match = findNatureServeMatch(json.results ?? [], name)
  return match ? extractNatureServe(match) : null
}

async function fetchIucn(
  genus: string,
  species: string,
): Promise<string | null> {
  if (!IUCN_TOKEN) return null
  const url =
    `${IUCN_BASE}/taxa/scientific_name` +
    `?genus_name=${encodeURIComponent(genus)}` +
    `&species_name=${encodeURIComponent(species)}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${IUCN_TOKEN}`,
      Accept: 'application/json',
    },
  })
  if (res.status === 404) return null // species not assessed
  if (!res.ok) throw new Error(`IUCN HTTP ${res.status}`)
  const json = (await res.json()) as { assessments?: Array<IucnAssessment> }
  return pickLatestIucnCategory(json.assessments)
}

async function main() {
  const db = new Database(DB_PATH)
  ensureColumns(db)

  if (!IUCN_TOKEN) {
    console.warn(
      '⚠ IUCN_API_TOKEN not set — seeding NatureServe only, skipping IUCN.',
    )
  }

  const resumeFilter = FORCE
    ? ''
    : `AND iucn_category IS NULL
       AND natureserve_grank IS NULL
       AND natureserve_srank_tx IS NULL`

  const targets = db
    .prepare(
      `SELECT id, genus, species FROM specimens
       WHERE genus IS NOT NULL AND TRIM(genus) <> ''
         AND species IS NOT NULL AND TRIM(species) <> ''
         ${resumeFilter}`,
    )
    .all() as Array<SpecimenRow>

  const update = db.prepare(
    `UPDATE specimens
       SET iucn_category = ?, natureserve_grank = ?,
           natureserve_srank_tx = ?, natureserve_id = ?
     WHERE id = ?`,
  )

  const stats = {
    total: targets.length,
    nsMatched: 0,
    sRankTxFound: 0,
    iucnMatched: 0,
    noMatch: 0,
    errors: 0,
  }

  console.log(`Processing ${stats.total} species (force=${FORCE})...`)

  let i = 0
  for (const row of targets) {
    i++
    const name = `${row.genus} ${row.species}`.trim()
    try {
      const ns = await fetchNatureServe(name)
      await delay(DELAY_MS)

      let iucn: string | null = null
      if (IUCN_TOKEN) {
        iucn = await fetchIucn(row.genus, row.species)
        await delay(DELAY_MS)
      }

      if (ns?.gRank || ns?.sRankTx) stats.nsMatched++
      if (ns?.sRankTx) stats.sRankTxFound++
      if (iucn) stats.iucnMatched++
      if (!ns && !iucn) stats.noMatch++

      update.run(
        iucn,
        ns?.gRank ?? null,
        ns?.sRankTx ?? null,
        ns?.uniqueId ?? null,
        row.id,
      )

      if (i % 25 === 0 || i === stats.total) {
        console.log(
          `  [${i}/${stats.total}] ${name} → G:${ns?.gRank ?? '-'} TX:${ns?.sRankTx ?? '-'} IUCN:${iucn ?? '-'}`,
        )
      }
    } catch (err) {
      stats.errors++
      console.warn(`  ✗ ${name}: ${(err as Error).message}`)
    }
  }

  db.pragma('wal_checkpoint(TRUNCATE)')
  db.close()

  console.log('\n--- Coverage ---')
  console.log(`  Processed:          ${stats.total}`)
  console.log(`  NatureServe matched: ${stats.nsMatched}`)
  console.log(`  Texas S-rank found:  ${stats.sRankTxFound}`)
  console.log(`  IUCN matched:        ${stats.iucnMatched}`)
  console.log(`  No match (any):      ${stats.noMatch}`)
  console.log(`  Errors:              ${stats.errors}`)
  console.log(`\nDone! Updated ${DB_PATH}`)
  console.log('To push to Turso: turso db import imrs-species.db')
}

main()
