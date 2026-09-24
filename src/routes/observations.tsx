import { createFileRoute, useRouter } from '@tanstack/react-router'
import { IMRS_ObservationsFeed as ObservationsFeed } from '@/components/IMRS_ObservationsFeed'
import { IMRS_Page_Hero } from '@/components/IMRS_Page_Hero'
import { Loader } from '@/components/Loader'
import { SITE_URL } from '@/data/constants'
import { observationsQuery } from '@/lib/inat'

export const Route = createFileRoute('/observations')({
  ssr: 'data-only',

  // Prefetch page 1 of the unfiltered feed into the Query cache; the
  // component's useInfiniteQuery reads the same entry, so nothing is fetched
  // twice and no data is threaded through props.
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(
      observationsQuery({ group: 'all', mediaType: 'all', year: 'all' }),
    )
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
  component: ObservationsPage,
})

function ObservationsPage() {
  return (
    <main>
      {/* Hero sits outside the feed so the empty state keeps the page <h1>. */}
      <IMRS_Page_Hero
        image="/imgs/hero-observations.webp"
        imageWidth={1600}
        imageHeight={1200}
        title={
          <>
            Recent
            <br />
            Observations
          </>
        }
        subtitle={
          <>
            Biodiversity observations on Indio Mountains Research Station from{' '}
            <a
              className="underline"
              rel="noreferrer noopener"
              target="_blank"
              href="https://www.inaturalist.org/"
            >
              iNaturalist<span className="sr-only"> (opens in new tab)</span>
            </a>
            .
          </>
        }
      />
      <ObservationsFeed />
    </main>
  )
}

function ObservationsErrorComponent() {
  const router = useRouter()

  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full rounded-[20px] bg-brand-light p-8 sm:p-10 shadow-[0px_4px_10px_rgba(0,0,0,0.13)] space-y-6 font-brand-sans tracking-[0.04em] text-brand-ink">
        <h1 className="text-[32px] leading-[31px]">Observations Unavailable</h1>
        <p className="leading-[1.55]">
          We couldn&#39;t reach iNaturalist to load recent observations. This is
          usually temporary — please try again in a moment.
        </p>
        <div className="flex gap-4 items-center flex-wrap pt-4">
          <button
            onClick={() => router.invalidate()}
            className="inline-flex items-center gap-2 rounded-pill border-[0.5px] border-brand-ink bg-brand-green px-6 py-3 font-brand-mono text-base leading-[31px] text-brand-cream transition-colors hover:bg-brand-green-dark cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  )
}
