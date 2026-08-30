import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AsyncRateLimiter } from '@tanstack/react-pacer'
import type { Species } from '@/types/species'
import { GC_TIME, STALE_TIME } from '@/data/constants'
import { fetchObservations, taxonQueryName } from '@/lib/inat'
import { getPhotoUrl } from '@/lib/getPhotoUrl'

// Shared ceiling across every grid card. iNaturalist's guideline is ~60
// requests/min total; 30/min for hover photos leaves headroom for the
// observations feed and species detail pages. Module-level is safe: this hook
// is hover-gated and therefore client-only.
const hoverPhotoLimiter = new AsyncRateLimiter(
  (scientificName: string, signal: AbortSignal) =>
    fetchObservations(
      { taxon_name: scientificName, photos: true, per_page: 1 },
      signal,
    ),
  { limit: 30, window: 60_000, windowType: 'sliding' },
)

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
      const response = await hoverPhotoLimiter.maybeExecute(
        scientificName,
        signal,
      )
      // Rejected by the shared limit: throw instead of caching null so the
      // photo can still resolve on a later hover once the window frees up.
      if (!response) {
        throw new Error('shared hover-photo rate limit reached (30/min)')
      }
      return getPhotoUrl(response.results[0]?.photos)
    },
    enabled: enabled && scientificName.length > 0,
    retry: false,
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
