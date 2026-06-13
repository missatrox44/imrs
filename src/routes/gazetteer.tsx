import { createFileRoute } from '@tanstack/react-router'
import Gazetteer from '@/components/Gazetteer'
import { SITE_URL } from '@/data/constants'

export const Route = createFileRoute('/gazetteer')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Gazetteer | IMRS' },
      {
        name: 'description',
        content:
          'Interactive map and directory of named geographic features, trails, springs, and research sites within Indio Mountains Research Station, with coordinates and elevations.',
      },
    ],
    links: [{ rel: 'canonical', href: SITE_URL + '/gazetteer' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: 'Indio Mountains Research Station',
          description:
            'Geographic reference points and locations within Indio Mountains Research Station.',
        }),
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <>
      <Gazetteer />
    </>
  )
}
