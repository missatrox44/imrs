import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, Mountain } from 'lucide-react'
import type { ComponentType } from 'react'
import type { GazetteerMapProps } from '@/components/GazetteerMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GAZETTEER_ENTRIES } from '@/data/gazetteer'
import { formatCoordinates } from '@/lib/formatCoordinates'
import { formatElevation } from '@/lib/formatElevation'
import { SearchInput } from '@/components/SearchInput'
import { cn } from '@/lib/utils'

const Gazetteer = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [MapComponent, setMapComponent] =
    useState<ComponentType<GazetteerMapProps> | null>(null)

  // Dynamically import leaflet map only on the client
  useEffect(() => {
    import('@/components/GazetteerMap').then((m) => {
      setMapComponent(() => m.GazetteerMap)
    })
  }, [])

  const filteredAndSortedEntries = useMemo(() => {
    return GAZETTEER_ENTRIES.filter((entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [searchTerm])

  // Clear selectedId when it's no longer in filtered results
  useEffect(() => {
    if (
      selectedId &&
      !filteredAndSortedEntries.some((e) => e.id === selectedId)
    ) {
      setSelectedId(null)
    }
  }, [filteredAndSortedEntries, selectedId])

  // Scroll card into view when pin is clicked
  useEffect(() => {
    const el = selectedId ? cardRefs.current[selectedId] : null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedId])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            IMRS Gazetteer
          </h1>
          <p className="text-muted-foreground md:text-balance">
            A comprehensive list of notable locations and features on Indio
            Mountains Research Station
          </p>
        </div>

        {/* Desktop: side-by-side | Mobile: stacked */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map panel */}
          <div className="h-[40vh] lg:h-[calc(80vh-6rem)] lg:w-1/2 xl:w-3/5 lg:sticky lg:top-6 rounded-sm border overflow-hidden">
            {MapComponent ? (
              <MapComponent
                entries={filteredAndSortedEntries}
                selectedId={selectedId}
                onPinClick={setSelectedId}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                Loading map…
              </div>
            )}
          </div>

          {/* Cards panel */}
          <div className="lg:w-1/2 xl:w-2/5 lg:h-[calc(80vh-6rem)] lg:overflow-y-auto">
            <div className="sticky top-0 z-10 bg-background pb-4">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search locations"
              />
            </div>

            <section className="space-y-4">
              {filteredAndSortedEntries.length > 0 ? (
                filteredAndSortedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    ref={(el) => {
                      cardRefs.current[entry.id] = el
                    }}
                  >
                    <Card
                      className={cn(
                        'hover:shadow-md transition-all cursor-pointer',
                        entry.id === selectedId &&
                          'ring-2 ring-accent shadow-md',
                      )}
                      onClick={() => setSelectedId(entry.id)}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{entry.name}</CardTitle>
                        {entry.alternateNames?.length ? (
                          <p className="text-sm text-muted-foreground italic">
                            aka {entry.alternateNames.join(', ')}
                          </p>
                        ) : null}
                      </CardHeader>
                      <CardContent>
                        <div>
                          <div className="flex-1 space-y-3">
                            <p className="text-muted-foreground">
                              {entry.description}
                            </p>

                            <div className="flex flex-wrap gap-2 text-sm">
                              {entry.latitude && entry.longitude && (
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  <MapPin className="w-3 h-3" />
                                  {formatCoordinates(
                                    entry.latitude,
                                    entry.longitude,
                                  )}
                                </Badge>
                              )}

                              {entry.elevationMeters && (
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  <Mountain className="w-3 h-3" />
                                  {formatElevation(entry.elevationMeters)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No locations found matching "{searchTerm}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>

            {filteredAndSortedEntries.length > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {filteredAndSortedEntries.length} of{' '}
                {GAZETTEER_ENTRIES.length} locations
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Gazetteer
