import { createFileRoute, useRouter } from '@tanstack/react-router'
import Observations from '@/components/Observations'
import { Loader } from '@/components/Loader'
import { PER_PAGE, SITE_URL } from '@/data/constants'
import { fetchObservations } from '@/lib/inat'

export const Route = createFileRoute('/observations')({
  ssr: 'data-only',

  loader: async () => {
    const data = await fetchObservations({ page: 1, per_page: PER_PAGE })

    return {
      page: 1,
      per_page: PER_PAGE,
      total_results: data.total_results,
      results: data.results,
    }
  },
  head: () => ({
    meta: [
      { title: 'Recent Observations | IMRS' },
      {
        name: 'description',
        content:
          'Live feed of the latest flora and fauna sightings recorded at Indio Mountains Research Station via iNaturalist, updated daily with photos and observer notes.',
      },
    ],
    links: [{ rel: 'canonical', href: SITE_URL + '/observations' }],
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
  errorComponent: ObservationsErrorComponent,
  component: RouteComponent,
})

function ObservationsErrorComponent() {
  const router = useRouter()

  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-card text-card-foreground border border-border p-10 shadow-card space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Observations Unavailable
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          We couldn&#39;t reach iNaturalist to load recent observations. This is
          usually temporary — please try again in a moment.
        </p>
        <div className="flex gap-4 items-center flex-wrap pt-4">
          <button
            onClick={() => router.invalidate()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border border-border font-medium tracking-wide shadow-card transition-colors hover:bg-primary-hover cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  )
}

function RouteComponent() {
  const data = Route.useLoaderData()

  return <Observations initialPage={data} />
}
