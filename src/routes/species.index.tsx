import { createFileRoute } from '@tanstack/react-router'
import type { Category } from '@/types/category'
import SpeciesIndex from '@/components/SpeciesIndex'
import { Loader } from '@/components/Loader'
import { fetchAllSpecies } from '@/server/speciesService'
import { SITE_URL } from '@/data/constants'

export const Route = createFileRoute('/species/')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { category: Category } => ({
    category: (search.category || 'all') as Category,
  }),

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
