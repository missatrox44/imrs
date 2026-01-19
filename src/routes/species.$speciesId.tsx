import { createFileRoute } from '@tanstack/react-router'
import type { Species } from '@/types/species'
import type { Observation } from '@/types/observation'

import { Loader } from '@/components/Loader'
import { SpeciesDetails } from '@/components/SpeciesDetails'

export const Route = createFileRoute('/species/$speciesId')({
  // Fetch the species + recent observations for this ID
  loader: async ({ params }) => {
    const { speciesId } = params
    const res = await fetch('/api/species')
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


  head: ({ loaderData }) => {
      if (!loaderData || !loaderData.species) {
    return {}
  }
    const { species } = loaderData

    const scientificName = [species.genus, species.species]
      .filter(Boolean)
      .join(' ')

    return {
      title: `${scientificName} | IMRS`,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Taxon',
            name: scientificName,
            alternateName: species.species_common_name || undefined,
            taxonRank: 'Species',
            isPartOf: {
              '@type': 'Dataset',
              name: 'IMRS Biodiversity Records',
            },
          }),
        },
      ],
    }
  },


  pendingComponent: () => <Loader dataTitle="species details" />,

  component: SpeciesDetails,
})
