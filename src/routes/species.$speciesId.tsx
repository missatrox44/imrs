import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import type { DisplayObservation } from '@/types/observation'

import { Loader } from '@/components/Loader'
import { SpeciesDetails } from '@/components/SpeciesDetails'
import { fetchAllSpecies } from '@/server/speciesService'
import { fetchObservations } from '@/lib/inat'
import { PLACE_ID, SITE_URL } from '@/data/constants'
import { getPhotoUrl } from '@/lib/getPhotoUrl'
import { parseSpeciesId, speciesPath } from '@/lib/speciesSlug'

export const Route = createFileRoute('/species/$speciesId')({
  // Fetch the species + recent observations for this ID
  loader: async ({ params }) => {
    const id = parseSpeciesId(params.speciesId)
    if (id == null) {
      throw notFound()
    }

    const all = await fetchAllSpecies()

    const species = all.find((s) => s.id === id)

    if (!species) {
      throw notFound()
    }

    // Canonicalize the URL: bare-ID or stale-slug hits 301 to the slug form.
    const canonical = speciesPath(species)
    if (params.speciesId !== canonical) {
      throw redirect({
        to: '/species/$speciesId',
        params: { speciesId: canonical },
        statusCode: 301,
      })
    }

    let observations: Array<DisplayObservation> = []

    // Build a scientific name from genus + species
    const scientificName = [species.genus, species.species]
      .filter(Boolean)
      .join(' ')

    if (scientificName.length > 0) {
      try {
        const imrs = await fetchObservations({
          taxon_name: scientificName,
          place_id: PLACE_ID,
          photos: true,
          per_page: 4,
        })
        const imrsTagged = imrs.results.map((o) => ({ ...o, atImrs: true }))
        if (imrsTagged.length < 4) {
          const general = await fetchObservations({
            taxon_name: scientificName,
            photos: true,
            per_page: 8,
          })
          const imrsIds = new Set(imrsTagged.map((o) => o.id))
          const fill = general.results
            .filter((o) => !imrsIds.has(o.id))
            .map((o) => ({ ...o, atImrs: false }))
          observations = [...imrsTagged, ...fill].slice(0, 4)
        } else {
          observations = imrsTagged.slice(0, 4)
        }
      } catch {
        // Keep the page renderable even if iNaturalist is unreachable.
        observations = []
      }
    }

    return { species, observations }
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {}
    }
    const { species, observations } = loaderData

    const scientificName = [species.genus, species.species]
      .filter(Boolean)
      .join(' ')

    const canonicalUrl = `${SITE_URL}/species/${speciesPath(species)}`
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
