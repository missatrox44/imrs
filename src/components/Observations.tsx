import { useEffect } from 'react'
import { Calendar, MapPin, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import type { Observation } from '@/types/observation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/Loader'
import EmptyState from '@/components/EmptyState'
import { formatDate } from '@/lib/formatDate'
import { getPhotoUrl } from '@/lib/getPhotoUrl'

const PER_PAGE = 50

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
  const { ref, inView } = useInView({
    rootMargin: '200px',
  })

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['observations'],

      initialPageParam: 1,

      queryFn: async ({ pageParam }) => {
        const url = new URL('https://api.inaturalist.org/v1/observations')
        url.search = new URLSearchParams({
          place_id: '225419',
          order: 'desc',
          order_by: 'observed_on',
          per_page: String(PER_PAGE),
          page: String(pageParam),
        }).toString()

        const res = await fetch(url)

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
      staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
      gcTime: 1000 * 60 * 60 * 24 * 60, // 60 days
    })

  // flatten pages
  const observations = data.pages.flatMap((page) => page.results)

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage])

  if (!observations.length) {
    return <EmptyState />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Recent Observations
          </h1>
          <p className="text-muted-foreground">
            Biodiversity observations from Indio Mountains Research Station
          </p>
        </div>

        {/* <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="plants">Plants</SelectItem>
              <SelectItem value="birds">Birds</SelectItem>
              <SelectItem value="reptiles">Reptiles</SelectItem>
              <SelectItem value="insects">Insects</SelectItem>
              <SelectItem value="mammals">Mammals</SelectItem>
            </SelectContent>
          </Select> */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {observations.map((observation) => (
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
                        ;(e.target as HTMLImageElement).style.display = 'none'
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
        </div>

        {/* infinite scroll sentinel */}
        <div ref={ref} className="h-12" />

        {isFetchingNextPage && (
          <div className="mt-8">
            <Loader dataTitle="more observations" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Observations
