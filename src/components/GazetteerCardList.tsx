import { MapPin, Mountain } from 'lucide-react'
import type { GazetteerEntry } from '@/types/gazetteer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCoordinates } from '@/lib/formatCoordinates'
import { formatElevation } from '@/lib/formatElevation'
import { cn } from '@/lib/utils'

interface GazetteerCardListProps {
  entries: Array<GazetteerEntry>
  totalCount: number
  selectedId: string | null
  onSelect: (id: string) => void
  cardRefs: React.MutableRefObject<Record<string, HTMLLIElement | null>>
  searchTerm: string
}

export const GazetteerCardList = ({
  entries,
  totalCount,
  selectedId,
  onSelect,
  cardRefs,
  searchTerm,
}: GazetteerCardListProps) => {
  return (
    <>
      <section>
        {entries.length > 0 ? (
          <ul className="space-y-4">
            {entries.map((entry) => (
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
                  onClick={() => onSelect(entry.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(entry.id)
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
                        {entry.latitude != null && entry.longitude != null && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <MapPin className="size-3" />
                            {formatCoordinates(entry.latitude, entry.longitude)}
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

      {entries.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {entries.length} of {totalCount} locations
        </div>
      )}
    </>
  )
}
