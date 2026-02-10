import { createFileRoute } from '@tanstack/react-router'
import SpeciesIndex from '@/components/SpeciesIndex'
import type { Category } from '@/types/category'

export const Route = createFileRoute('/species/')({
  validateSearch: (search: Record<string, unknown>): { category: Category } => ({
    category: (search.category as Category) || 'all',
  }),
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
