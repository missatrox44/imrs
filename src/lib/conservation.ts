import type { Species } from '@/types/species'

// Conservation status normalization.
//
// Raw codes are stored on the species row exactly as the source reports them
// (e.g. "G2", "S1", "CR"). This module is the single place that maps those raw
// codes onto a shared severity scale and a color tier, so the DB stays
// source-faithful and the UI never re-derives status logic.

export type ConservationSource =
  | 'iucn'
  | 'natureserve-global'
  | 'natureserve-tx'
  | 'texas-sgcn'

export type ConservationTier =
  | 'critical'
  | 'high'
  | 'moderate'
  | 'secure'
  | 'flag'
  | 'unknown'

export interface ConservationRank {
  source: ConservationSource
  /** Raw code as stored, e.g. "G2", "S1", "CR". */
  code: string
  /** 1 = most at-risk … 5 = secure, 0 = not evaluated / no data. */
  severity: number
  tier: ConservationTier
  /** Human-readable status, e.g. "Endangered". */
  label: string
}

export const SOURCE_LABELS: Record<ConservationSource, string> = {
  iucn: 'IUCN Red List',
  'natureserve-global': 'NatureServe Global',
  'natureserve-tx': 'NatureServe (Texas)',
  'texas-sgcn': 'Texas SGCN',
}

function severityToTier(severity: number): ConservationTier {
  switch (severity) {
    case 1:
      return 'critical'
    case 2:
      return 'high'
    case 3:
      return 'moderate'
    case 4:
    case 5:
      return 'secure'
    default:
      return 'unknown'
  }
}

const NATURESERVE_NUMERIC_LABELS = new Map<number, string>([
  [1, 'Critically Imperiled'],
  [2, 'Imperiled'],
  [3, 'Vulnerable'],
  [4, 'Apparently Secure'],
  [5, 'Secure'],
])

function normalizeNatureServe(
  source: ConservationSource,
  raw: string,
): ConservationRank | null {
  const code = raw.trim().toUpperCase()
  const prefix = code[0]
  if (prefix !== 'G' && prefix !== 'S') return null

  const body = code.slice(1)

  // Numeric ranks, including rounded ranges like "G2G3" — the more at-risk
  // (lowest) number wins.
  const digits = body.match(/\d/g)
  if (digits && digits.length > 0) {
    const severity = Math.min(...digits.map(Number))
    return {
      source,
      code,
      severity,
      tier: severityToTier(severity),
      label: NATURESERVE_NUMERIC_LABELS.get(severity) ?? 'Unknown',
    }
  }

  // Presumed extinct/extirpated and possibly extinct/extirpated are treated as
  // most at-risk.
  if (body.startsWith('X')) {
    return {
      source,
      code,
      severity: 1,
      tier: 'critical',
      label: prefix === 'G' ? 'Presumed Extinct' : 'Presumed Extirpated',
    }
  }
  if (body.startsWith('H')) {
    return {
      source,
      code,
      severity: 1,
      tier: 'critical',
      label: prefix === 'G' ? 'Possibly Extinct' : 'Possibly Extirpated',
    }
  }

  // Not Ranked / Unrankable / Not Applicable.
  const unknownLabels: Record<string, string> = {
    NR: 'Not Ranked',
    U: 'Unrankable',
    NA: 'Not Applicable',
  }
  return {
    source,
    code,
    severity: 0,
    tier: 'unknown',
    label: unknownLabels[body] ?? 'Not Ranked',
  }
}

const IUCN_MAP = new Map<string, { severity: number; label: string }>([
  ['EX', { severity: 1, label: 'Extinct' }],
  ['EW', { severity: 1, label: 'Extinct in the Wild' }],
  ['CR', { severity: 1, label: 'Critically Endangered' }],
  ['EN', { severity: 2, label: 'Endangered' }],
  ['VU', { severity: 3, label: 'Vulnerable' }],
  ['NT', { severity: 4, label: 'Near Threatened' }],
  ['LC', { severity: 5, label: 'Least Concern' }],
  ['DD', { severity: 0, label: 'Data Deficient' }],
  ['NE', { severity: 0, label: 'Not Evaluated' }],
])

function normalizeIucn(raw: string): ConservationRank | null {
  const code = raw.trim().toUpperCase()
  const entry = IUCN_MAP.get(code)
  if (!entry) return null
  return {
    source: 'iucn',
    code,
    severity: entry.severity,
    tier: severityToTier(entry.severity),
    label: entry.label,
  }
}

// Texas SGCN is a binary designation (a species is on the State Wildlife Action
// Plan list or it isn't), so it doesn't fit the 1–5 severity scale. It gets its
// own `flag` tier with severity 0, which keeps it off the grid's most-at-risk
// badge (filtered to severity ≥ 1) while still rendering on the detail page.
function normalizeSgcn(): ConservationRank {
  return {
    source: 'texas-sgcn',
    code: 'SGCN',
    severity: 0,
    tier: 'flag',
    label: 'Listed',
  }
}

/** Normalize a single raw code, or null if absent/unrecognized. */
export function normalizeRank(
  source: ConservationSource,
  code: string | null | undefined,
): ConservationRank | null {
  if (code == null || code.trim() === '') return null
  if (source === 'iucn') return normalizeIucn(code)
  if (source === 'texas-sgcn') return normalizeSgcn()
  return normalizeNatureServe(source, code)
}

/**
 * All available ranks for a species, in fixed display order
 * (IUCN → NatureServe Global → NatureServe Texas → Texas SGCN). Includes
 * "not evaluated" ranks (informative on the detail page); absent fields are
 * skipped.
 */
export function getConservationRanks(
  species: Species,
): Array<ConservationRank> {
  return [
    normalizeRank('iucn', species.iucn_category),
    normalizeRank('natureserve-global', species.natureserve_grank),
    normalizeRank('natureserve-tx', species.natureserve_srank_tx),
    normalizeRank('texas-sgcn', species.texas_sgcn),
  ].filter((rank): rank is ConservationRank => rank !== null)
}

/**
 * The most at-risk evaluated rank, for the grid card badge. Only ranks of
 * conservation concern qualify (severity 1–3: critical/high/moderate); secure
 * "green" ranks (severity 4–5) and not-evaluated ranks (severity 0) are
 * intentionally omitted so grid cards highlight only at-risk species. Lowest
 * severity wins; ties break by source order (IUCN > Global > Texas). Returns
 * null when the species has no at-risk rank. The full set of ranks, green
 * included, is still shown on the detail page via getConservationRanks.
 */
export function getMostAtRiskRank(species: Species): ConservationRank | null {
  const ranked = getConservationRanks(species).filter(
    (rank) => rank.severity >= 1 && rank.severity <= 3,
  )
  if (ranked.length === 0) return null
  return ranked.reduce((worst, rank) =>
    rank.severity < worst.severity ? rank : worst,
  )
}
