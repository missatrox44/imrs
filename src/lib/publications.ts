import type { Publication } from '@/data/publications'
import { publications } from '@/data/publications'

/** Publications for a species id, newest first. */
export function getPublicationsForSpecies(
  speciesId: number,
  pubs: Array<Publication> = publications,
): Array<Publication> {
  return pubs
    .filter((pub) => pub.speciesIds.includes(speciesId))
    .sort((a, b) => b.year - a.year)
}

const TYPE_LABELS: Record<Publication['type'], string> = {
  thesis: 'Thesis',
  dissertation: 'Dissertation',
}

export function publicationTypeLabel(type: Publication['type']): string {
  return TYPE_LABELS[type]
}
