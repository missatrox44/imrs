import type { Category } from '@/types/category'
import type { Species } from '@/types/species'
import type { TaxonomicFilters } from '@/components/SpeciesIndex'

export function applyTaxonomicFilters(
  items: Array<Species>,
  filters: TaxonomicFilters,
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
