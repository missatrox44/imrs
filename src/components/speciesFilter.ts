import type { Category } from '@/types/category'
import type { Species } from '@/types/species'
import type {
  RankOption,
  TaxonRankKey,
  TaxonSelection,
} from '@/types/speciesIndex'
import { TAXONOMIC_RANKS } from '@/data/constants'

export function applyTaxonomicFilters(
  items: Array<Species>,
  filters: Partial<Record<TaxonRankKey, string | null>>,
): Array<Species> {
  let result = items
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      result = result.filter(
        (s) =>
          s[key as keyof Species]?.toString().toLowerCase() ===
          value.toLowerCase(),
      )
    }
  }
  return result
}

export function applySearchTerm(
  items: Array<Species>,
  searchTerm: string,
): Array<Species> {
  if (!searchTerm) return items
  const lowerTerm = searchTerm.toLowerCase()
  return items.filter(
    (s) =>
      (s.genus && s.genus.toLowerCase().includes(lowerTerm)) ||
      (s.species && s.species.toLowerCase().includes(lowerTerm)) ||
      (s.species_common_name &&
        s.species_common_name.toLowerCase().includes(lowerTerm)) ||
      (s.family && s.family.toLowerCase().includes(lowerTerm)),
  )
}

export function filterByCategory(
  items: Array<Species>,
  category: Category,
): Array<Species> {
  return category === 'all'
    ? items
    : items.filter((s) => s.category === category)
}

export function sortSpecies(
  items: Array<Species>,
  direction: 'asc' | 'desc',
): Array<Species> {
  return items.slice().sort((a, b) => {
    const aEmpty = !a.genus && !a.species
    const bEmpty = !b.genus && !b.species
    if (aEmpty !== bEmpty) return aEmpty ? 1 : -1

    const genusA = (a.genus ?? '').toLowerCase()
    const genusB = (b.genus ?? '').toLowerCase()
    const cmp =
      genusA.localeCompare(genusB) ||
      (a.species ?? '')
        .toLowerCase()
        .localeCompare((b.species ?? '').toLowerCase())
    return direction === 'asc' ? cmp : -cmp
  })
}

/** Display form for taxon names; DB casing varies by source ("SUIDAE", "Suidae"). */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Options for every rank, each narrowed by the selections above it (never by
 * its own or lower ranks), with specimen counts. Values are capitalized so
 * DB casing drift ("MAGNOLIOPSIDA" vs "Magnoliopsida") collapses to one row.
 */
export function getRankOptions(
  items: Array<Species>,
  selection: TaxonSelection,
): Record<TaxonRankKey, Array<RankOption>> {
  const options = {} as Record<TaxonRankKey, Array<RankOption>>
  let scope = items
  for (const { key } of TAXONOMIC_RANKS) {
    const counts = new Map<string, number>()
    for (const s of scope) {
      const raw = s[key]?.trim()
      if (!raw) continue
      const value = capitalize(raw)
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    options[key] = Array.from(counts, ([value, count]) => ({
      value,
      count,
    })).sort((a, b) => a.value.localeCompare(b.value))
    const selected = selection[key]
    if (selected) scope = applyTaxonomicFilters(scope, { [key]: selected })
  }
  return options
}

/** Set (or clear, with null) one rank and drop every rank below it. */
export function setRank(
  selection: TaxonSelection,
  key: TaxonRankKey,
  value: string | null,
): TaxonSelection {
  const next: TaxonSelection = {}
  for (const { key: rank } of TAXONOMIC_RANKS) {
    if (rank === key) {
      if (value) next[rank] = value
      break
    }
    if (selection[rank]) next[rank] = selection[rank]
  }
  return next
}

/** Selected ranks in lineage order (kingdom → genus). */
export function getLineage(
  selection: TaxonSelection,
): Array<{ key: TaxonRankKey; label: string; value: string }> {
  return TAXONOMIC_RANKS.flatMap(({ key, label }) => {
    const value = selection[key]
    return value ? [{ key, label, value }] : []
  })
}
