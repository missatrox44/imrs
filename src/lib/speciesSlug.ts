import type { Species } from '@/types/species'

// Builds a URL-safe kebab slug from the binomial, e.g. "Notiosorex crawfordi"
// → "notiosorex-crawfordi". Returns '' when either part is missing/blank so
// callers can fall back to the bare ID.
export function slugifyBinomial(genus?: string, species?: string): string {
  const g = genus?.trim()
  const s = species?.trim()
  if (!g || !s) {
    return ''
  }

  return `${g} ${s}`
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Canonical path segment for a species: "{id}-{slug}", or just "{id}" when
// there's no binomial to slugify. This is the single source of truth for how
// species links are built.
export function speciesPath(
  species: Pick<Species, 'id' | 'genus' | 'species'>,
): string {
  const slug = slugifyBinomial(species.genus, species.species)
  return slug ? `${species.id}-${slug}` : `${species.id}`
}

// Extracts the leading integer ID from a route param, ignoring any slug text
// that follows it. "381-packera-tampicana" → 381, "705" → 705, junk → null.
export function parseSpeciesId(param: string): number | null {
  const match = /^(\d+)/.exec(param)
  return match ? Number(match[1]) : null
}
