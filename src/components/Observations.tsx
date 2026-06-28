import { useEffect, useState } from 'react'
import { AudioLines, Calendar, MapPin, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import type { Observation } from '@/types/observation'
import type { TaxonGroup } from '@/types/taxon'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
// import { Loader } from '@/components/Loader'
import EmptyState from '@/components/EmptyState'
import { formatDate } from '@/lib/formatDate'
import { getCategoryIcon } from '@/lib/getCategoryIcon'
import { getPhotoUrl } from '@/lib/getPhotoUrl'
import { getSoundUrl } from '@/lib/getSoundUrl'
import { ObservationCardSkeleton } from '@/components/ObservationCardSkeleton'
import {
  FIRST_OBSERVATION_YEAR,
  GC_TIME,
  PER_PAGE,
  SKELETON_COUNT,
  STALE_TIME,
} from '@/data/constants'
import { fetchObservations } from '@/lib/inat'
import { GROUP_TO_TAXON_ID } from '@/types/taxon'

// Filterable groups shown in the dropdown (fungi, fish, and other
// invertebrates are intentionally omitted for now).
const GROUP_OPTIONS: Array<{ value: TaxonGroup; label: string }> = [
  { value: 'plants', label: 'Plants' },
  { value: 'mammals', label: 'Mammals' },
  { value: 'birds', label: 'Birds' },
  { value: 'reptiles', label: 'Reptiles' },
  { value: 'amphibians', label: 'Amphibians' },
  { value: 'insects', label: 'Insects' },
  { value: 'arachnid', label: 'Arachnids' },
]

type MediaType = 'all' | 'photos' | 'audio'

const MEDIA_OPTIONS: Array<{ value: MediaType; label: string }> = [
  { value: 'all', label: 'All Media' },
  { value: 'photos', label: 'Photos' },
  { value: 'audio', label: 'Audio' },
]

// Stable, filter-independent descending year range for the Year dropdown.
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - FIRST_OBSERVATION_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i),
)

interface ObservationsPage {
  page: number
  per_page: number
  total_results: number
  results: Array<Observation>
}
interface ObservationsProps {
  initialPage: ObservationsPage
}

const Observations = ({ initialPage }: ObservationsProps) => {
  const [selectedGroup, setSelectedGroup] = useState<TaxonGroup>('all')
  const [mediaType, setMediaType] = useState<MediaType>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const isUnfiltered =
    selectedGroup === 'all' && mediaType === 'all' && selectedYear === 'all'
  const { ref, inView } = useInView({
    rootMargin: '200px',
  })

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['observations', selectedGroup, mediaType, selectedYear],

      initialPageParam: 1,

      queryFn: async ({ pageParam, signal }) => {
        const response = await fetchObservations(
          {
            page: pageParam,
            per_page: PER_PAGE,
            taxon_id:
              selectedGroup === 'all'
                ? undefined
                : GROUP_TO_TAXON_ID[selectedGroup],
            photos: mediaType === 'photos' ? true : undefined,
            sounds: mediaType === 'audio' ? true : undefined,
            year: selectedYear === 'all' ? undefined : selectedYear,
          },
          signal,
        )

        // IMPORTANT: must match initialData.pages shape
        return {
          page: pageParam,
          per_page: PER_PAGE,
          total_results: response.total_results,
          results: response.results,
        }
      },

      // Seed page 1 from SSR loader — only for the unfiltered view, so filtered
      // queries fetch fresh from the API rather than reusing the seeded page.
      // Function form keeps `data` typed as possibly undefined (it is, while a
      // filtered query loads its first page).
      initialData: () =>
        isUnfiltered ? { pages: [initialPage], pageParams: [1] } : undefined,

      getNextPageParam: (lastPage) => {
        const loaded = lastPage.page * lastPage.per_page
        // iNaturalist caps results at a 10,000-record window
        if (loaded >= 10_000) return undefined
        return loaded < lastPage.total_results ? lastPage.page + 1 : undefined
      },

      // monthly updates → long cache
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    })

  // flatten pages (data is undefined while a freshly-filtered query loads)
  const observations = data?.pages.flatMap((page) => page.results) ?? []
  const totalResults = data?.pages[0]?.total_results ?? 0

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage])

  // Genuinely empty feed (no filters applied) → friendly empty state.
  if (isUnfiltered && !isFetching && observations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Recent Observations
          </h1>
          <p className="text-muted-foreground">
            Biodiversity observations on Indio Mountains Research Station from{' '}
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="https://www.inaturalist.org/"
            >
              iNaturalist<span className="sr-only"> (opens in new tab)</span>
            </a>
            .
          </p>
          <p className="text-muted-foreground font-bold">
            Click any observation card to view full observation details.
          </p>
        </section>

        <div className="sticky top-16 z-40 bg-background py-4 flex flex-col gap-3">
          {!isUnfiltered && (
            <span
              className="text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              Showing {totalResults} matching observations
            </span>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Select
              value={selectedGroup}
              onValueChange={(value) => setSelectedGroup(value as TaxonGroup)}
            >
              <SelectTrigger
                aria-label="Filter by group"
                className="w-48 cursor-pointer"
              >
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {GROUP_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(value)}
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={mediaType}
              onValueChange={(value) => setMediaType(value as MediaType)}
            >
              <SelectTrigger
                aria-label="Filter by media type"
                className="w-48 cursor-pointer"
              >
                <SelectValue placeholder="Filter by media type" />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger
                aria-label="Filter by year"
                className="w-48 cursor-pointer"
              >
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <section>
          {observations.length === 0 ? (
            isFetching ? (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <li key={`skeleton-${i}`}>
                    <ObservationCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="py-12 text-center text-muted-foreground"
                role="status"
              >
                No observations match these filters.
              </p>
            )
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {observations.map((observation) => {
                const photoUrl = getPhotoUrl(observation.photos)
                const sound = getSoundUrl(observation.sounds)
                const label =
                  observation.species_guess ||
                  observation.taxon?.preferred_common_name ||
                  `observation #${observation.id}`

                return (
                  <li key={observation.id}>
                    <Card className="h-full flex flex-col gradient-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden">
                      <Link
                        to={observation.uri || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 flex-col"
                      >
                        <span className="sr-only">
                          {observation.species_guess ||
                            observation.taxon?.preferred_common_name ||
                            'Observation'}{' '}
                          (opens in new tab)
                        </span>
                        {photoUrl ? (
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={photoUrl}
                              alt={
                                observation.species_guess ||
                                observation.taxon?.preferred_common_name ||
                                observation.taxon?.name ||
                                `Observation #${observation.id}`
                              }
                              loading="lazy"
                              decoding="async"
                              width={500}
                              height={500}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display =
                                  'none'
                              }}
                            />
                          </div>
                        ) : (
                          sound && (
                            <div className="aspect-square flex items-center justify-center bg-muted">
                              <AudioLines
                                className="size-16 text-muted-foreground"
                                aria-hidden="true"
                              />
                            </div>
                          )
                        )}

                        <CardHeader className="pb-3 space-y-1">
                          <h2 className="font-semibold text-foreground line-clamp-2">
                            {observation.species_guess ||
                              observation.taxon?.preferred_common_name ||
                              'Unknown Species'}
                          </h2>

                          {observation.taxon?.name && (
                            <p className="italic text-sm text-muted-foreground line-clamp-1">
                              {observation.taxon.name}
                            </p>
                          )}
                        </CardHeader>

                        <CardContent className="space-y-3 mt-auto">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="size-4" />
                            <span>
                              {observation.user?.login || 'Anonymous'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            <span>
                              {formatDate(observation.observed_on_string)}
                            </span>
                          </div>

                          {observation.place_guess && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="size-4" />
                              <span className="line-clamp-1">
                                {observation.place_guess}
                              </span>
                            </div>
                          )}

                          <Badge variant="secondary" className="w-fit">
                            ID #{observation.id}
                          </Badge>
                        </CardContent>
                      </Link>

                      {sound && (
                        <div className="px-6 pb-4">
                          {/* iNaturalist sound recordings ship no caption track;
                            the aria-label below provides the accessible name. */}
                          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                          <audio
                            controls
                            preload="none"
                            className="w-full"
                            aria-label={`Audio recording for ${label}`}
                          >
                            <source src={sound.url} type={sound.type} />
                          </audio>
                        </div>
                      )}
                    </Card>
                  </li>
                )
              })}

              {isFetchingNextPage &&
                Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <li key={`skeleton-${i}`}>
                    <ObservationCardSkeleton />
                  </li>
                ))}
            </ul>
          )}

          {isFetchingNextPage && (
            <span className="sr-only" role="status">
              Loading more observations
            </span>
          )}
        </section>

        {/* infinite scroll sentinel */}
        <div ref={ref} className="h-12" />

        {/* {isFetchingNextPage && (
          <div className="mt-8">
            <Loader dataTitle="more observations" />
          </div>
        )} */}
      </main>
    </div>
  )
}

export default Observations
