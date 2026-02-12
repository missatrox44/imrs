import { useEffect, useMemo, useState } from 'react'
import { Calendar, MapPin, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import type { Observation } from '@/types/observation'
import type { TaxonGroup } from '@/types/taxon';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge'
// import { Loader } from '@/components/Loader'
import EmptyState from '@/components/EmptyState'
import { formatDate } from '@/lib/formatDate'
import { getPhotoUrl } from '@/lib/getPhotoUrl'
import { ObservationCardSkeleton } from '@/components/ObservationCardSkeleton'
import { GC_TIME, ORDER, ORDER_BY, PER_PAGE, PLACE_ID, SKELETON_COUNT, STALE_TIME, iNaturalistUrl } from '@/data/constants'
import { GROUP_TO_TAXON_ID } from '@/types/taxon'


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
  const { ref, inView } = useInView({
    rootMargin: '200px',
  })

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['observations'],

      initialPageParam: 1,

      queryFn: async ({ pageParam }) => {

        iNaturalistUrl.search = new URLSearchParams({
          place_id: PLACE_ID,
          order: ORDER,
          order_by: ORDER_BY,
          per_page: String(PER_PAGE),
          page: String(pageParam),
        }).toString()

        const res = await fetch(iNaturalistUrl)

        if (!res.ok) {
          throw new Error('Failed to fetch more observations')
        }

        // eslint-disable-next-line no-shadow
        const data = await res.json()

        // IMPORTANT: must match initialData.pages shape
        return {
          page: pageParam,
          per_page: PER_PAGE,
          total_results: data.total_results,
          results: data.results,
        }
      },

      // Seed page 1 from SSR loader
      initialData: {
        pages: [initialPage],
        pageParams: [1],
      },

      getNextPageParam: (lastPage) => {
        const loaded = lastPage.page * lastPage.per_page
        return loaded < lastPage.total_results ? lastPage.page + 1 : undefined
      },

      // monthly updates → long cache
      staleTime: STALE_TIME,
      gcTime: GC_TIME
    })

  // flatten pages
  const observations = data.pages.flatMap((page) => page.results)

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage])


  const filteredObservations = useMemo(() => {
    if (selectedGroup === 'all') return observations

    const targetTaxonId = GROUP_TO_TAXON_ID[selectedGroup]
    if (!targetTaxonId) return observations

    return observations.filter(obs => {
      // Check if observation's taxon hierarchy includes the target group
      const taxonIds = obs.taxon?.ancestor_ids || []
      return taxonIds.includes(targetTaxonId)
    })
  }, [observations, selectedGroup])



  if (!observations.length) {
    return <EmptyState />
  }



  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Recent Observations
          </h1>
          <p className="text-muted-foreground">
            Biodiversity observations on Indio Mountains Research Station from <a rel="noreferrer noopener" target="_blank" href="https://www.inaturalist.org/" >iNaturalist</a>.
          </p>
          <p className="text-muted-foreground font-bold">
            Click any observation card to view full observation details.
          </p>

        </section>

        <div className="sticky top-16 z-40 bg-background py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {selectedGroup !== 'all' ? (
              <span className="text-sm text-muted-foreground">
                Showing {filteredObservations.length} of {observations.length} observations
              </span>
            ) : (
              <span />
            )}

            <Select
              value={selectedGroup}
              onValueChange={(value) => setSelectedGroup(value as TaxonGroup)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="plants">Plants</SelectItem>
                {/* <SelectItem value="fungi">Fungi</SelectItem> */}
                <SelectItem value="mammals">Mammals</SelectItem>
                <SelectItem value="birds">Birds</SelectItem>
                <SelectItem value="reptiles">Reptiles</SelectItem>
                <SelectItem value="amphibians">Amphibians</SelectItem>
                {/* <SelectItem value="fish">Fish</SelectItem> */}
                <SelectItem value="insects">Insects</SelectItem>
                <SelectItem value="arachnid">Arachnids</SelectItem>
                {/* <SelectItem value="invertebrates">Other Invertebrates</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredObservations.map((observation) => (
            <Link
              key={observation.id}
              to={observation.uri || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="h-full flex flex-col gradient-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden">
                {getPhotoUrl(observation.photos) && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getPhotoUrl(observation.photos)!}
                      alt={observation.species_guess || 'Unknown species'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        ; (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <CardHeader className="pb-3 space-y-1">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {observation.species_guess ||
                      observation.taxon?.preferred_common_name ||
                      'Unknown Species'}
                  </h3>

                  {observation.taxon?.name && (
                    <p className="italic text-sm text-muted-foreground line-clamp-1">
                      {observation.taxon.name}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-3 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{observation.user?.login || 'Anonymous'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(observation.observed_on_string)}</span>
                  </div>

                  {observation.place_guess && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {observation.place_guess}
                      </span>
                    </div>
                  )}

                  <Badge variant="secondary" className="w-fit">
                    ID #{observation.id}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}

          {isFetchingNextPage &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ObservationCardSkeleton key={`skeleton-${i}`} />
            ))}
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
