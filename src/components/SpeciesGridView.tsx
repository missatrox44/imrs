import { memo, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { m, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import type { Species } from '@/types/species'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConservationBadge } from '@/components/ConservationBadge'
import { getCategoryIcon } from '@/lib/getCategoryIcon'
import { getMostAtRiskRank } from '@/lib/conservation'
import { speciesPath } from '@/lib/speciesSlug'
import { useSpeciesHoverImage } from '@/lib/useSpeciesHoverImage'

const HOVER_INTENT_MS = 150

const ESTIMATED_ROW_HEIGHT = 160

const SpeciesCard = memo(function SpeciesCard({ item }: { item: Species }) {
  const status = getMostAtRiskRank(item)
  const shouldReduceMotion = useReducedMotion()

  // Hover/focus intent: only flip `active` after a short delay so sweeping the
  // mouse across the grid doesn't fire a burst of iNaturalist requests.
  const [active, setActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activate = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setActive(true), HOVER_INTENT_MS)
  }
  const deactivate = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setActive(false)
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const { url } = useSpeciesHoverImage(item, active)
  const onPhoto = active && !!url

  const scientificName =
    `${item.genus ?? ''} ${item.species ?? ''}`.trim() || 'Unidentified species'

  return (
    <Link
      to="/species/$speciesId"
      params={{ speciesId: speciesPath(item) }}
      className="h-full block group"
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
    >
      <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer h-full hover:bg-muted/50 relative overflow-hidden">
        {url && (
          <m.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: onPhoto ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <img
              src={url}
              alt={
                item.species_common_name
                  ? `${scientificName} (${item.species_common_name})`
                  : scientificName
              }
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.currentTarget.parentElement as HTMLElement).style.display =
                  'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          </m.div>
        )}
        <CardContent className="p-4 sm:p-6 h-full relative z-10">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    {item.category && (
                      <span
                        className={
                          onPhoto
                            ? 'text-white'
                            : 'text-muted-foreground group-hover:text-primary transition-colors'
                        }
                      >
                        {getCategoryIcon(item.category)}
                      </span>
                    )}
                    <h2
                      className={`scientific-name text-lg font-medium truncate group-hover:underline ${
                        onPhoto ? 'text-white' : ''
                      }`}
                    >
                      {item.genus || item.species ? (
                        `${item.genus ?? ''} ${item.species ?? ''}`.trim()
                      ) : (
                        <em>Species not identified</em>
                      )}
                    </h2>
                  </div>

                  {item.species_common_name && (
                    <span
                      className={`font-semibold truncate ${
                        onPhoto ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {item.species_common_name}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs font-mono mb-2 truncate ${
                    onPhoto ? 'text-white/90' : 'text-muted-foreground'
                  }`}
                >
                  {[item.phylum, item.class_name, item.order_name, item.family]
                    .flatMap((crumb) => {
                      const trimmed = crumb?.trim()
                      return trimmed ? [trimmed] : []
                    })
                    .join(' › ')}
                </p>

                {(status || item.family_common_name || item.family) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {status && (
                      <ConservationBadge rank={status} variant="compact" />
                    )}
                    {(item.family_common_name || item.family) && (
                      <Badge variant="secondary" className="text-xs">
                        {item.family_common_name || item.family}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})

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
        const translateY = virtualRow.start - virtualizer.options.scrollMargin

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
              transform: `translateY(${translateY}px)`,
            }}
          >
            {rowItems.map((item) => (
              <SpeciesCard key={item.id} item={item} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
