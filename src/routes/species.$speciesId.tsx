import { createFileRoute } from '@tanstack/react-router'
import type { Species } from '@/types/species'
import type { Observation } from '@/types/observation'

import { Loader } from '@/components/Loader'
import { SpeciesDetails } from '@/components/SpeciesDetails'

export const Route = createFileRoute('/species/$speciesId')({
  // Fetch the species + recent observations for this ID
  loader: async ({ params }) => {
    const { speciesId } = params
    const res = await fetch('/data/species.json')
    const all: Array<Species> = await res.json()

    const species = all.find((s) => String(s.id) === String(speciesId)) ?? null

    let observations: Array<Observation> = []
    if (species) {
      try {
        // Build a scientific name from genus + species
        const scientificName = [species.genus, species.species]
          .filter(Boolean)
          .join(' ')

        if (scientificName.length > 0) {
          const obsRes = await fetch(
            `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(
              scientificName,
            )}&per_page=6`,
          )

          const obsJson = await obsRes.json()
          observations = obsJson.results ?? []
        }
      } catch {
        observations = []
      }
    }

    return { species, observations }
  },

  pendingComponent: () => <Loader dataTitle="species details" />,

  component: SpeciesDetails,
})
