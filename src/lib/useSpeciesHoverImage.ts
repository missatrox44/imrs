import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Species } from '@/types/species'
import { GC_TIME, STALE_TIME } from '@/data/constants'
import { fetchObservations, taxonQueryName } from '@/lib/inat'
import { getPhotoUrl } from '@/lib/getPhotoUrl'

// Single owner of hover-image resolution for grid cards. Today it resolves the
// top global iNaturalist photo for the species; a future iteration can check a
// curated `Record<name, url>` here first and fall back to iNaturalist without
// touching any card code.
export function useSpeciesHoverImage(
  species: Species,
  enabled: boolean,
): { url: string | null } {
  const scientificName = taxonQueryName(species.genus, species.species)

  const { data, error } = useQuery({
    queryKey: ['hover-photo', scientificName],
    queryFn: async ({ signal }) => {
      const { results } = await fetchObservations(
        { taxon_name: scientificName, photos: true, per_page: 1 },
        signal,
      )
      return getPhotoUrl(results[0]?.photos)
    },
    enabled: enabled && scientificName.length > 0,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })

  // The image is decorative, so a failure degrades silently in the UI — but log
  // it so iNaturalist rate-limiting, outages, or schema drift stay diagnosable
  // instead of looking identical to a species that simply has no photo.
  useEffect(() => {
    if (error) {
      console.error(
        `useSpeciesHoverImage: failed to resolve photo for "${scientificName}"`,
        error,
      )
    }
  }, [error, scientificName])

  return { url: data ?? null }
}
