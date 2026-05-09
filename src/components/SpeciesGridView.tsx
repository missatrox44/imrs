import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import type { Species } from '@/types/species'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCategoryIcon } from '@/lib/getCategoryIcon'

const ESTIMATED_ROW_HEIGHT = 160

export const SpeciesGridView = ({ items }: { items: Array<Species> }) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isSm = useMediaQuery('(min-width: 640px)')
  const lanes = isLg ? 3 : isSm ? 2 : 1

  const rowCount = Math.ceil(items.length / lanes)

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 4,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: 'relative',
        width: '100%',
      }}
    >
      {virtualItems.map((virtualRow) => {
        const startIndex = virtualRow.index * lanes
        const rowItems = items.slice(startIndex, startIndex + lanes)

        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${
                virtualRow.start - virtualizer.options.scrollMargin
              }px)`,
            }}
          >
            {rowItems.map((item) => (
              <Link
                key={item.id}
                to="/species/$speciesId"
                params={{ speciesId: String(item.id) }}
                className="h-full block group"
              >
                <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer h-full hover:bg-muted/50">
                  <CardContent className="p-4 sm:p-6 h-full">
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1 mb-2">
                            <div className="flex items-center gap-2">
                              {item.category && (
                                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                  {getCategoryIcon(item.category)}
                                </span>
                              )}
                              <h3 className="scientific-name text-lg font-medium truncate group-hover:underline">
                                {item.genus || item.species ? (
                                  `${item.genus ?? ''} ${item.species ?? ''}`.trim()
                                ) : (
                                  <em>Species not identified</em>
                                )}
                              </h3>
                            </div>

                            {item.species_common_name && (
                              <span className="text-foreground font-semibold truncate">
                                {item.species_common_name}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground font-mono mb-2 truncate">
                            {[
                              item.phylum,
                              item.class_name,
                              item.order_name,
                              item.family,
                            ]
                              .map((crumb) => crumb?.trim())
                              .filter(Boolean)
                              .join(' › ')}
                          </p>

                          {(item.family_common_name || item.family) && (
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.family_common_name || item.family}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )
      })}
    </div>
  )
}
