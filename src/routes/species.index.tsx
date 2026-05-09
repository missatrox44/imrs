import { createFileRoute } from '@tanstack/react-router'
import type { Category } from '@/types/category'
import SpeciesIndex from '@/components/SpeciesIndex'
import { Loader } from '@/components/Loader'
import { fetchAllSpecies } from '@/server/speciesService'

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
    title: 'Species Index | IMRS',
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
