import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'
import type { SpeciesSearch, TaxonSelection } from '@/types/speciesIndex'
// Legacy index (plain header + AdvancedSearch), replaced by IMRS_SpeciesIndex (Figma 80:1396).
// import SpeciesIndex from '@/components/SpeciesIndex'
import { IMRS_SpeciesIndex as SpeciesIndex } from '@/components/IMRS_SpeciesIndex'
import { Loader } from '@/components/Loader'
import { fetchAllSpecies } from '@/server/speciesService'
import { SITE_URL, TAXONOMIC_RANKS } from '@/data/constants'

const SEARCH_DEFAULTS = { category: 'all', view: 'grid', sort: 'asc' } as const

export const Route = createFileRoute('/species/')({
  // Partial input keeps `search={{ category: 'all' }}` links valid; output is complete.
  validateSearch: (
    search: Partial<SpeciesSearch> & SearchSchemaInput,
  ): SpeciesSearch => {
    const ranks: TaxonSelection = {}
    for (const { key } of TAXONOMIC_RANKS) {
      const value: unknown = search[key]
      if (typeof value === 'string' && value.trim()) ranks[key] = value.trim()
    }
    return {
      category: search.category || 'all',
      view: search.view === 'table' ? 'table' : 'grid',
      sort: search.sort === 'desc' ? 'desc' : 'asc',
      ...ranks,
    }
  },
  search: { middlewares: [stripSearchParams(SEARCH_DEFAULTS)] },

  ssr: 'data-only',

  loader: () => fetchAllSpecies(),

  pendingComponent: () => <Loader dataTitle="species catalog" />,
  component: SpeciesIndex,
  head: () => ({
    meta: [
      { title: 'Species Index | IMRS' },
      {
        name: 'description',
        content:
          'Searchable index of 1,200+ species documented at Indio Mountains Research Station, organized by kingdom, phylum, class, order, family, and genus.',
      },
    ],
    links: [{ rel: 'canonical', href: SITE_URL + '/species' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Species Index',
          description:
            'A searchable index of species documented at Indio Mountains Research Station.',
        }),
      },
    ],
  }),
})
