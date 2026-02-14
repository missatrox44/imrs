import { createFileRoute } from '@tanstack/react-router'
import type { Category } from '@/types/category'
import SpeciesIndex from '@/components/SpeciesIndex'
import { Loader } from '@/components/Loader'

export const Route = createFileRoute('/species/')({
  ssr: 'data-only',

  validateSearch: (search: Record<string, unknown>): { category: Category } => ({
    category: (search.category || 'all') as Category,
  }),

  loader: async () => {
    const res = await fetch('/api/species')
    if (!res.ok) throw new Error('Failed to fetch species')
    return res.json()
  },

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
