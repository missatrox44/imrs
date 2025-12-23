// TODO: Refactor for repsonviness and add to species detail page
// ? This is component is meant to be added to Species Detail Page in future
import { Link } from '@tanstack/react-router'
import {
  Calendar,
  MapPin,
  User,
} from 'lucide-react'
import type { Observation } from '@/types/observation'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/formatDate'
import { getPhotoUrl } from '@/lib/getPhotoUrl'

export function ObservationCarousel({observations, obsCount}: {observations: Array<Observation>, obsCount: number}) {
  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <CardTitle>Recent Observations</CardTitle>
      </CardHeader>

      <CardContent>
        {obsCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No iNaturalist observations recorded for this species on IMRS yet.
            </p>
          </div>
        ) : (
          <div className="w-full relative px-8">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {observations.slice(0, 6).map((observation: Observation) => (
                  <CarouselItem
                    key={observation.id}
                    className="pl-4 basis-full md:basis-1/2"
                  >
                    <Link
                      to={observation.uri || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <Card className="border hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-full">
                        <CardContent className="p-4 flex flex-col h-full">
                          {getPhotoUrl(observation.photos) && (
                            <div className="aspect-square overflow-hidden mb-3 shrink-0">
                              <img
                                src={getPhotoUrl(observation.photos)!}
                                alt={observation.species_guess || 'Observation'}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  ;(
                                    e.target as HTMLImageElement
                                  ).style.display = 'none'
                                }}
                              />
                            </div>
                          )}

                          <div className="space-y-2 grow">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {observation.user?.login || 'Anonymous'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3 shrink-0" />
                              <span>
                                {formatDate(observation.observed_on_string)}
                              </span>
                            </div>

                            {observation.place_guess && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="line-clamp-1">
                                  {observation.place_guess}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="w-10 h-10" />
              <CarouselNext className="w-10 h-10" />
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
