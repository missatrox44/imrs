// Observations filter bar + infinite grid.
import { useEffect, useRef, useState } from 'react'
import { AudioLines, Calendar, MapPin, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useThrottledCallback } from '@tanstack/react-pacer'
import { useReducedMotion } from 'framer-motion'

import type { TaxonGroup } from '@/types/taxon'
import EmptyState from '@/components/EmptyState'
import { IMRS_BackToTop } from '@/components/IMRS_BackToTop'
import { IMRS_ObservationsFilters } from '@/components/IMRS_ObservationsFilters'
import { IMRS_ObservationCardSkeleton } from '@/components/IMRS_ObservationCardSkeleton'
import { formatDate } from '@/lib/formatDate'
import { getObservationGroup } from '@/lib/getObservationGroup'
import { getPhotoUrl } from '@/lib/getPhotoUrl'
import { getSoundUrl } from '@/lib/getSoundUrl'
import { observationsQuery } from '@/lib/inat'
import { cn } from '@/lib/utils'
import { SKELETON_COUNT } from '@/data/constants'
import { IMRS_ScientificName } from '@/components/IMRS_ScientificName'

// iNaturalist rank_level: genus is 20; genus and below are italic.
const GENUS_RANK_LEVEL = 20

// Static class strings so Tailwind v4 emits them.
const GROUP_BAR_CLASS: Record<TaxonGroup, string> = {
  all: 'bg-brand-sand',
  plants: 'bg-category-plants',
  mammals: 'bg-category-mammals',
  birds: 'bg-category-birds',
  reptiles: 'bg-category-reptiles',
  amphibians: 'bg-category-amphibians',
  insects: 'bg-category-arthropods',
  arachnid: 'bg-category-arthropods',
  invertebrates: 'bg-category-inverts',
  fish: 'bg-category-fish',
  fungi: 'bg-category-fungi',
}

type MediaType = 'all' | 'photos' | 'audio'

const META_ROW_CLASS = 'flex items-center gap-2 whitespace-nowrap'

export const IMRS_ObservationsFeed = () => {
  const [selectedGroup, setSelectedGroup] = useState<TaxonGroup>('all')
  // Media filter hidden from UI; stays wired into the query (always 'all').
  const [mediaType] = useState<MediaType>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const isUnfiltered =
    selectedGroup === 'all' && mediaType === 'all' && selectedYear === 'all'
  const { ref, inView } = useInView({ rootMargin: '200px' })
  const filtersEl = useRef<HTMLDivElement>(null)
  const { ref: filtersInViewRef, inView: filtersInView } = useInView({
    initialInView: true,
  })
  const shouldReduceMotion = useReducedMotion()

  const scrollToFilters = () => {
    const el = filtersEl.current
    if (!el) return
    el.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    el.querySelector<HTMLElement>('button')?.focus({ preventScroll: true })
  }

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

  const observations = data?.pages.flatMap((page) => page.results) ?? []
  const totalResults = data?.pages[0]?.total_results ?? 0

  // Cap chained page requests at 1/s so fling-scrolling past the sentinel
  // can't burst-fetch against iNaturalist.
  const throttledFetchNextPage = useThrottledCallback(fetchNextPage, {
    wait: 1000,
    leading: true,
    trailing: false,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      throttledFetchNextPage()
    }
  }, [inView, hasNextPage, isFetching, throttledFetchNextPage])

  if (isUnfiltered && !isFetching && observations.length === 0) {
    return <EmptyState />
  }

  const skeletons = Array.from({ length: SKELETON_COUNT }).map((_, i) => (
    <li key={`skeleton-${i}`}>
      <IMRS_ObservationCardSkeleton />
    </li>
  ))

  return (
    // The rounded top only reads against the hero photo, so the section rides
    // up over it — 106px at the 1440 frame, halved below lg with the radius.
    <section className="relative -mt-[53px] overflow-clip rounded-t-[32px] bg-brand-paper pt-16 pb-16 lg:-mt-[106px] lg:rounded-t-[64px] lg:pt-[120px]">
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
      />

      <div className="relative px-4 sm:px-8 lg:px-16">
        <IMRS_ObservationsFilters
          ref={(node) => {
            filtersEl.current = node
            filtersInViewRef(node)
          }}
          selectedGroup={selectedGroup}
          selectedYear={selectedYear}
          onGroupChange={setSelectedGroup}
          onYearChange={setSelectedYear}
          totalResults={isUnfiltered ? null : totalResults}
        />

        {observations.length === 0 ? (
          isFetching ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
              {skeletons}
            </ul>
          ) : (
            <p
              className="py-12 text-center font-brand-mono text-base tracking-[0.04em] text-brand-gray"
              role="status"
            >
              No observations match these filters.
            </p>
          )
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
            {observations.map((observation) => {
              const photoUrl = getPhotoUrl(observation.photos)
              const sound = getSoundUrl(observation.sounds)
              const label =
                observation.species_guess ||
                observation.taxon?.preferred_common_name ||
                `observation #${observation.id}`
              const group =
                getObservationGroup(observation.taxon?.ancestor_ids) ?? 'all'

              return (
                <li key={observation.id}>
                  <article className="relative flex h-full flex-col gap-8 overflow-hidden rounded-lg bg-brand-light p-6 pt-8 transition-shadow duration-300 hover:shadow-[0_4px_22px_rgba(0,0,0,0.14)]">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 top-0 h-2',
                        GROUP_BAR_CLASS[group],
                      )}
                    />
                    <Link
                      to={observation.uri || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 flex-col gap-8"
                    >
                      <span className="sr-only">
                        {label} (opens in new tab)
                      </span>

                      {photoUrl ? (
                        <div className="h-[201px] w-full overflow-hidden rounded-lg">
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
                            className="size-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display =
                                'none'
                            }}
                          />
                        </div>
                      ) : (
                        sound && (
                          <div className="flex h-[201px] w-full items-center justify-center rounded-lg bg-brand-sand">
                            <AudioLines
                              className="size-16 text-brand-green-dark"
                              aria-hidden="true"
                            />
                          </div>
                        )
                      )}

                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 text-brand-ink">
                          <h2 className="line-clamp-2 font-brand-sans text-2xl leading-tight tracking-[0.04em] lg:text-[32px] lg:leading-[31px]">
                            {observation.species_guess ||
                              observation.taxon?.preferred_common_name ||
                              'Unknown Species'}
                          </h2>
                          {observation.taxon?.name && (
                            <p className="line-clamp-1 font-brand-mono text-base tracking-[0.04em]">
                              {(observation.taxon.rank_level ?? Infinity) <=
                              GENUS_RANK_LEVEL ? (
                                <IMRS_ScientificName
                                  name={observation.taxon.name}
                                />
                              ) : (
                                observation.taxon.name
                              )}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-2 gap-y-2.5 font-brand-sans text-base tracking-[0.04em] text-brand-green-dark">
                          <span className={META_ROW_CLASS}>
                            <User className="size-4" aria-hidden="true" />
                            {observation.user?.login || 'Anonymous'}
                          </span>
                          <span className={META_ROW_CLASS}>
                            <Calendar className="size-4" aria-hidden="true" />
                            {formatDate(observation.observed_on_string)}
                          </span>
                          {observation.place_guess && (
                            <span className={cn(META_ROW_CLASS, 'w-full')}>
                              <MapPin
                                className="size-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="min-w-0 truncate">
                                {observation.place_guess}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="mt-auto w-fit rounded-[14px] bg-brand-sand px-[13px] py-px font-brand-sans text-base tracking-[0.04em] text-brand-ink">
                        ID #{observation.id}
                      </span>
                    </Link>

                    {sound && (
                      // iNaturalist sound recordings ship no caption track;
                      // the aria-label below provides the accessible name.
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <audio
                        controls
                        preload="none"
                        className="w-full"
                        aria-label={`Audio recording for ${label}`}
                      >
                        <source src={sound.url} type={sound.type} />
                      </audio>
                    )}
                  </article>
                </li>
              )
            })}

            {isFetchingNextPage && skeletons}
          </ul>
        )}

        {isFetchingNextPage && (
          <span className="sr-only" role="status">
            Loading more observations
          </span>
        )}

        <div ref={ref} className="h-12" />
      </div>

      <IMRS_BackToTop visible={!filtersInView} onClick={scrollToFilters} />
    </section>
  )
}
