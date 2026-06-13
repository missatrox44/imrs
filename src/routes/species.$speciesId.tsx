import { createFileRoute, notFound } from '@tanstack/react-router'
import type { Observation } from '@/types/observation'

import { Loader } from '@/components/Loader'
import { SpeciesDetails } from '@/components/SpeciesDetails'
import { fetchAllSpecies } from '@/server/speciesService'
import { fetchObservations } from '@/lib/inat'
import { SITE_URL } from '@/data/constants'
import { getPhotoUrl } from '@/lib/getPhotoUrl'

export const Route = createFileRoute('/species/$speciesId')({
  // Fetch the species + recent observations for this ID
  loader: async ({ params }) => {
    const { speciesId } = params
    const all = await fetchAllSpecies()

    const species = all.find((s) => String(s.id) === String(speciesId))

    if (!species) {
      throw notFound()
    }

    let observations: Array<Observation> = []

    // Build a scientific name from genus + species
    const scientificName = [species.genus, species.species]
      .filter(Boolean)
      .join(' ')

    if (scientificName.length > 0) {
      try {
        const data = await fetchObservations({
          taxon_name: scientificName,
          per_page: 6,
        })
        observations = data.results
      } catch {
        // Keep the page renderable even if iNaturalist is unreachable.
        observations = []
      }
    }

    return { species, observations }
  },

  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {}
    }
    const { species, observations } = loaderData

    const scientificName = [species.genus, species.species]
      .filter(Boolean)
      .join(' ')

    const canonicalUrl = `${SITE_URL}/species/${params.speciesId}`
    const photoUrl = getPhotoUrl(observations[0]?.photos)

    const taxonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Taxon',
      name: scientificName,
      alternateName: species.species_common_name || undefined,
      taxonRank: 'Species',
      url: canonicalUrl,
      isPartOf: {
        '@type': 'Dataset',
        name: 'IMRS Biodiversity Records',
      },
    }
    if (photoUrl) {
      taxonLd.image = photoUrl
    }
    const firstTaxon = observations[0]?.taxon
    if (firstTaxon?.name === scientificName) {
      const taxonId = firstTaxon.id
      if (taxonId != null) {
        taxonLd.sameAs = `https://www.inaturalist.org/taxa/${taxonId}`
      }
    }

    const commonSuffix = species.species_common_name
      ? ` (${species.species_common_name})`
      : ''

    return {
      meta: [
        { title: `${scientificName} | IMRS` },
        {
          name: 'description',
          content: `Explore ${scientificName}${commonSuffix} — taxonomy, recent iNaturalist observations, and field photos from Indio Mountains Research Station.`,
        },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(taxonLd),
        },
      ],
    }
  },

  pendingComponent: () => <Loader dataTitle="species details" />,

  component: SpeciesDetails,
})
