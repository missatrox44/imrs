import { useEffect, useMemo, useRef, useState } from 'react'
import { Layers, MapPin, Mountain, Star } from 'lucide-react'
import type { ComponentType } from 'react'
import type { GazetteerMapProps } from '@/components/GazetteerMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GAZETTEER_ENTRIES } from '@/data/gazetteer'
import { formatCoordinates } from '@/lib/formatCoordinates'
import { formatElevation } from '@/lib/formatElevation'
import { SearchInput } from '@/components/SearchInput'
import { cn } from '@/lib/utils'

const MapLegend = () => (
  <div
    className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
    role="group"
    aria-label="Map legend"
  >
    <span className="font-medium text-foreground">Legend:</span>
    <span className="flex items-center gap-1.5">
      <Star
        className="size-3.5 shrink-0"
        style={{ fill: 'hsl(42, 85%, 55%)', stroke: 'hsl(25, 20%, 15%)' }}
        aria-hidden="true"
      />
      Featured location
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="size-3 shrink-0 rounded-full"
        style={{
          background: 'hsl(25, 20%, 15%)',
          border: '2px solid hsl(42, 45%, 94%)',
        }}
        aria-hidden="true"
      />
      Location
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="h-0.5 w-5 shrink-0 rounded-full"
        style={{ background: 'hsl(205, 65%, 45%)' }}
        aria-hidden="true"
      />
      Rio Grande
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="w-5 shrink-0"
        style={{ borderTop: '2px dashed hsl(95, 70%, 50%)' }}
        aria-hidden="true"
      />
      Roads
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="size-3 shrink-0 rounded-[2px]"
        style={{
          border: '2px solid hsl(25, 20%, 15%)',
          background: 'hsl(35, 50%, 65%)',
        }}
        aria-hidden="true"
      />
      Station boundary
    </span>
  </div>
)

const Gazetteer = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({})
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
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            IMRS Gazetteer
          </h1>
          <p className="text-muted-foreground md:text-balance">
            A comprehensive list of notable locations and features on Indio
            Mountains Research Station
          </p>
        </div>

        {/* Desktop: side-by-side | Mobile: stacked */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map column: legend + map */}
          <div className="lg:w-1/2 xl:w-3/5 lg:sticky lg:top-6 flex flex-col gap-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-1.5">
                Click the layers icon
                <Layers className="size-3.5 shrink-0" aria-hidden="true" />
                (top-right of the map) to:
              </p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Switch between Satellite and Street (2D) views</li>
                <li>Toggle the Roads overlay on or off</li>
              </ul>
            </div>
            <MapLegend />
            <div className="isolate h-[40vh] min-h-[320px] lg:h-[calc(80vh-6rem)] rounded-sm border overflow-hidden">
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
              <p className="sr-only">
                Use Tab to navigate map pins. Arrow keys pan the map when
                focused. Press Enter or Space on a card in the list to highlight
                its pin.
              </p>
            </div>
          </div>

          {/* Cards panel */}
          <div className="lg:w-1/2 xl:w-2/5 lg:relative">
            <div className="lg:absolute lg:inset-0 lg:overflow-y-auto">
              <div className="sticky top-0 z-10 bg-background pb-4">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search locations"
                />
              </div>

              <section>
                {filteredAndSortedEntries.length > 0 ? (
                  <ul className="space-y-4">
                    {filteredAndSortedEntries.map((entry) => (
                      <li
                        key={entry.id}
                        ref={(el) => {
                          cardRefs.current[entry.id] = el
                        }}
                      >
                        <Card
                          className={cn(
                            'hover:shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            entry.id === selectedId &&
                              'ring-4 ring-accent shadow-lg bg-accent/10',
                          )}
                          onClick={() => setSelectedId(entry.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedId(entry.id)
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-pressed={entry.id === selectedId}
                        >
                          <CardHeader>
                            <CardTitle as="h2" className="text-xl">
                              {entry.name}
                            </CardTitle>
                            {entry.alternateNames?.length ? (
                              <p className="text-sm text-muted-foreground italic">
                                aka {entry.alternateNames.join(', ')}
                              </p>
                            ) : null}
                          </CardHeader>
                          <CardContent>
                            <div className="flex-1 space-y-3">
                              <p className="text-muted-foreground">
                                {entry.description}
                              </p>

                              <div className="flex flex-wrap gap-2 text-sm">
                                {entry.latitude != null &&
                                  entry.longitude != null && (
                                    <Badge
                                      variant="secondary"
                                      className="flex items-center gap-1"
                                    >
                                      <MapPin className="size-3" />
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
                                    <Mountain className="size-3" />
                                    {formatElevation(entry.elevationMeters)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
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
      </div>
    </main>
  )
}

export default Gazetteer
