// Pure response parsers for the conservation seed script.
//
// These are split out from seed-conservation.ts (which does network + DB I/O)
// so the highest-risk part — matching names and reading the API response
// shapes — can be unit-tested against captured fixtures. Both API shapes were
// verified live before this was written.

// --- NatureServe Explorer (POST /api/data/speciesSearch) ---

export interface NatureServeSubnation {
  subnationCode?: string
  roundedSRank?: string
}

export interface NatureServeNation {
  nationCode?: string
  subnations?: Array<NatureServeSubnation>
}

export interface NatureServeResult {
  scientificName?: string
  uniqueId?: string
  roundedGRank?: string
  nations?: Array<NatureServeNation>
}

export interface NatureServeMatch {
  uniqueId: string | null
  gRank: string | null
  sRankTx: string | null
}

/**
 * Find the result that matches `name` exactly (case-insensitive). The search
 * is fuzzy — e.g. searching "Canis lupus" returns "Canis familiaris" first — so
 * we never take results[0] blindly. Falls back to a result whose name starts
 * with the binomial (handles trailing authorship), but never fuzzy-guesses.
 */
export function findNatureServeMatch(
  results: Array<NatureServeResult>,
  name: string,
): NatureServeResult | null {
  const target = name.trim().toLowerCase()
  if (!target) return null
  const exact = results.find(
    (r) => r.scientificName?.trim().toLowerCase() === target,
  )
  if (exact) return exact
  return (
    results.find((r) =>
      r.scientificName?.trim().toLowerCase().startsWith(`${target} `),
    ) ?? null
  )
}

/** Read the Texas (US → TX) subnational S-rank from a search result. */
export function pickTexasSRank(result: NatureServeResult): string | null {
  const us = result.nations?.find((n) => n.nationCode === 'US')
  const tx = us?.subnations?.find((s) => s.subnationCode === 'TX')
  return tx?.roundedSRank ?? null
}

/** Extract the fields we store from a matched NatureServe result. */
export function extractNatureServe(
  result: NatureServeResult,
): NatureServeMatch {
  return {
    uniqueId: result.uniqueId ?? null,
    gRank: result.roundedGRank ?? null,
    sRankTx: pickTexasSRank(result),
  }
}

// --- IUCN Red List API v4 (GET /api/v4/taxa/scientific_name) ---

export interface IucnAssessment {
  latest?: boolean
  red_list_category_code?: string
}

/** The current Red List category code (e.g. "EN"), preferring the latest assessment. */
export function pickLatestIucnCategory(
  assessments: Array<IucnAssessment> | undefined,
): string | null {
  if (!Array.isArray(assessments) || assessments.length === 0) return null
  const latest = assessments.find((a) => a.latest) ?? assessments[0]
  return latest.red_list_category_code ?? null
}

// --- Texas SGCN (static TPWD State Wildlife Action Plan list) ---

/**
 * Parse the lowercased binomial scientific names from the TPWD SGCN CSV.
 *
 * The CSV header is `taxonomic_group,scientific_name,...` — only column 2
 * (`scientific_name`) is needed, and neither it nor column 1 contains embedded
 * commas (the only messy quoted field, `general_habitat`, is last), so a plain
 * comma split taking index 1 is safe. The header row is skipped.
 */
export function parseSgcnBinomials(csvText: string): Set<string> {
  const names = new Set<string>()
  const lines = csvText.split(/\r?\n/)
  for (const line of lines.slice(1)) {
    const name = line.split(',')[1]?.trim().toLowerCase()
    if (name) names.add(name)
  }
  return names
}

/** Whether a genus + species is on the SGCN list (exact binomial match). */
export function isSgcnListed(
  genus: string,
  species: string,
  listed: Set<string>,
): boolean {
  return listed.has(`${genus.trim()} ${species.trim()}`.toLowerCase())
}
