import { createFileRoute } from '@tanstack/react-router'
import SpeciesIndex from '@/components/SpeciesIndex'

export const Route = createFileRoute('/species/')({
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
