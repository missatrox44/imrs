import { createFileRoute } from '@tanstack/react-router'
import Observations from '@/components/Observations'
import { Loader } from '@/components/Loader'

const PER_PAGE = 50

export const Route = createFileRoute('/observations')({
  ssr: 'data-only',

  loader: async () => {
    const url = new URL('https://api.inaturalist.org/v1/observations')
    url.search = new URLSearchParams({
      place_id: '225419',
      order: 'desc',
      order_by: 'observed_on',
      per_page: String(PER_PAGE),
      page: '1',
    }).toString()

    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch initial observations')
    }

    const data = await res.json()
    //     console.log('[iNat observation example]', data.results[0])

    return {
      page: 1,
      per_page: PER_PAGE,
      total_results: data.total_results,
      results: data.results,
    }
  },

  pendingComponent: () => <Loader dataTitle="observations" />,
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return <Observations initialPage={data} />
}
