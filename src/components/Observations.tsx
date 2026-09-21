import { useEffect, useState } from 'react'
import { AudioLines, Calendar, MapPin, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useThrottledCallback } from '@tanstack/react-pacer'

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
import { FIRST_OBSERVATION_YEAR, SKELETON_COUNT } from '@/data/constants'
import { observationsQuery } from '@/lib/inat'

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

// Media filter temporarily hidden from the UI (see commented-out Select below).
// const MEDIA_OPTIONS: Array<{ value: MediaType; label: string }> = [
//   { value: 'all', label: 'All Media' },
//   { value: 'photos', label: 'Photos' },
//   { value: 'audio', label: 'Audio' },
// ]

// Stable, filter-independent descending year range for the Year dropdown.
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - FIRST_OBSERVATION_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i),
)

const Observations = () => {
  const [selectedGroup, setSelectedGroup] = useState<TaxonGroup>('all')
  // Media filter hidden from UI for now; stays wired into the query (always
  // 'all') so re-enabling only means restoring the setter + the Select below.
  const [mediaType] = useState<MediaType>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const isUnfiltered =
    selectedGroup === 'all' && mediaType === 'all' && selectedYear === 'all'
  const { ref, inView } = useInView({
    rootMargin: '200px',
  })

  // The unfiltered entry is prefetched by the route loader; filtered
  // combinations fetch on first use. Same cache either way.
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(
      observationsQuery({
        group: selectedGroup,
        mediaType,
        year: selectedYear,
      }),
    )

  // flatten pages (data is undefined while a freshly-filtered query loads)
  const observations = data?.pages.flatMap((page) => page.results) ?? []
  const totalResults = data?.pages[0]?.total_results ?? 0

  // Cap chained page requests at 1/s so fling-scrolling past the sentinel
  // can't burst-fetch against iNaturalist.
  const throttledFetchNextPage = useThrottledCallback(fetchNextPage, {
    wait: 1000,
    leading: true,
    trailing: false,
  })

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      throttledFetchNextPage()
    }
  }, [inView, hasNextPage, isFetching, throttledFetchNextPage])

  // Genuinely empty feed (no filters applied) → friendly empty state.
  if (isUnfiltered && !isFetching && observations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
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

          <div className="flex flex-row gap-2 sm:flex-wrap sm:items-center">
            <Select
              value={selectedGroup}
              onValueChange={(value) => setSelectedGroup(value as TaxonGroup)}
            >
              <SelectTrigger
                aria-label="Filter by group"
                className="flex-1 cursor-pointer sm:w-48 sm:flex-none"
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

            {/* Media filter temporarily hidden from the UI (kept for re-enabling):
            <Select
              value={mediaType}
              onValueChange={(value) => setMediaType(value as MediaType)}
            >
              <SelectTrigger
                aria-label="Filter by media type"
                className="flex-1 cursor-pointer sm:w-48 sm:flex-none"
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
            */}

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger
                aria-label="Filter by year"
                className="flex-1 cursor-pointer sm:w-48 sm:flex-none"
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
