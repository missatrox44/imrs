import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/components/Home';

export const Route = createFileRoute('/')({
  component: App,
  head: () => ({
    title: 'IMRS Biodiversity Explorer',
    meta: [
      {
        name: 'description',
        content:
          'A living archive of flora and fauna observations from Indio Mountains Research Station.',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'IMRS Biodiversity Explorer',
          description:
            'An open biodiversity archive powered by iNaturalist observations from Indio Mountains Research Station.',
          url: 'https://imrs.vercel.app/',
        }),
      },
    ],
  }),
})


function App() {
  return (
    <>
      <Home />
    </>
  )
}
