import type { TaxonGroup } from '@/types/taxon'
import { GROUP_TO_TAXON_ID } from '@/types/taxon'

// Most specific first: Arachnida and Insecta both sit under Invertebrata, so
// the subkingdom must be checked last or it would swallow every arthropod.
const GROUP_PRECEDENCE = [
  'arachnid',
  'insects',
  'mammals',
  'birds',
  'reptiles',
  'amphibians',
  'fish',
  'plants',
  'fungi',
  'invertebrates',
] as const satisfies ReadonlyArray<TaxonGroup>

/** Resolve an observation's filter group from its taxon `ancestor_ids`. */
export function getObservationGroup(
  ancestorIds?: ReadonlyArray<number> | null,
): TaxonGroup | null {
  if (!ancestorIds?.length) return null
  const ids = new Set(ancestorIds)
  return (
    GROUP_PRECEDENCE.find((group) => ids.has(GROUP_TO_TAXON_ID[group]!)) ?? null
  )
}
