import { createFileRoute } from '@tanstack/react-router'
import Observations from '@/components/Observations'
import { Loader } from '@/components/Loader'
import { ORDER, ORDER_BY, PER_PAGE, PLACE_ID, iNaturalistUrl } from '@/data/constants'


export const Route = createFileRoute('/observations')({
  ssr: 'data-only',

  loader: async () => {
    iNaturalistUrl.search = new URLSearchParams({
      place_id: PLACE_ID,
      order: ORDER,
      order_by: ORDER_BY,
      per_page: String(PER_PAGE),
      page: '1',
    }).toString()

    const res = await fetch(iNaturalistUrl)
    if (!res.ok) {
      throw new Error('Failed to fetch initial observations')
    }

    const data = await res.json()
        // console.log('[iNat observation example]', data.results[0])

    return {
      page: 1,
      per_page: PER_PAGE,
      total_results: data.total_results,
      results: data.results,
    }
  },
  head: () => ({
    title: 'Recent Observations | IMRS',
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Recent Biodiversity Observations',
          description:
            'Recent flora and fauna observations recorded at Indio Mountains Research Station via iNaturalist.',
        }),
      },
    ],
  }),
  
  pendingComponent: () => <Loader dataTitle="observations" />,
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return <Observations initialPage={data} />
}
