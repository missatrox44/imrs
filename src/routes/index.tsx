import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '@/data/constants'
import { Home } from '@/components/Home'

export const Route = createFileRoute('/')({
  component: App,
  head: () => ({
    meta: [
      { title: 'IMRS Biodiversity Explorer' },
      {
        name: 'description',
        content:
          'Explore species, recent iNaturalist observations, and weather data from the Indio Mountains Research Station — a 40,000-acre desert research preserve in West Texas.',
      },
    ],
    links: [{ rel: 'canonical', href: SITE_URL + '/' }],
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
