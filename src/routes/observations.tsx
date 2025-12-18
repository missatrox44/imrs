import { createFileRoute } from '@tanstack/react-router'
import Observations from '@/components/Observations'
import { Loader } from '@/components/Loader'

export const Route = createFileRoute('/observations')({
  ssr: 'data-only',
  loader: async () => {
    const res = await fetch(
      'https://api.inaturalist.org/v1/observations?place_id=225419&per_page=50&order=desc&order_by=observed_on'
    )

    if (!res.ok) {
      throw new Error('Failed to fetch observations')
    }

    return res.json()
  },
  pendingComponent: () => <Loader dataTitle="observations" />,
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()
  return <Observations observations={data.results} />
}