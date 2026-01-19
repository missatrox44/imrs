import { createFileRoute } from '@tanstack/react-router'
import Gazetteer from '@/components/Gazetteer'

export const Route = createFileRoute('/gazetteer')({
  component: RouteComponent,
  head: () => ({
    title: 'Gazetteer | IMRS',
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
    </>)
}
