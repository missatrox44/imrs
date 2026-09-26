import { memo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { m, useReducedMotion } from 'framer-motion'
import { useDebouncer } from '@tanstack/react-pacer'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { Species } from '@/types/species'
import { SOURCE_LABELS, getMostAtRiskRank } from '@/lib/conservation'
import { speciesPath } from '@/lib/speciesSlug'
import { capitalize } from '@/components/speciesFilter'
import { useSpeciesHoverImage } from '@/lib/useSpeciesHoverImage'
import { IMRS_ScientificName } from '@/components/IMRS_ScientificName'

const HOVER_INTENT_MS = 150

const ESTIMATED_ROW_HEIGHT = 260

// Literal map so Tailwind sees the generated class names.
const GRID_COLS_CLASS: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

const IMRS_SpeciesCard = memo(function IMRS_SpeciesCard({
  item,
}: {
  item: Species
}) {
  const status = getMostAtRiskRank(item)
  const shouldReduceMotion = useReducedMotion()

  // Hover/focus intent: only flip `active` after a short delay so sweeping the
  // mouse across the grid doesn't fire a burst of iNaturalist requests.
  const [active, setActive] = useState(false)
  const hoverIntent = useDebouncer(() => setActive(true), {
    wait: HOVER_INTENT_MS,
  })

  const activate = () => hoverIntent.maybeExecute()
  const deactivate = () => {
    hoverIntent.cancel()
    setActive(false)
  }

  const { url } = useSpeciesHoverImage(item, active)
  const onPhoto = active && !!url

  const scientificName = `${item.genus ?? ''} ${item.species ?? ''}`.trim()
  const hasCommonName = !!item.species_common_name

  const familyLabel =
    item.family_common_name || (item.family && capitalize(item.family))
  const breadcrumb = [
    item.phylum,
    item.class_name,
    item.order_name,
    item.family,
  ].flatMap((crumb) => {
    const trimmed = crumb?.trim()
    return trimmed ? [capitalize(trimmed)] : []
  })

  const textColor = onPhoto ? 'text-brand-light' : 'text-brand-green-dark'
  const pillBorder = onPhoto ? 'border-brand-light' : 'border-brand-green-dark'

  return (
    <Link
      to="/species/$speciesId"
      params={{ speciesId: speciesPath(item) }}
      state={{ fromSpeciesIndex: true }}
      // No hover preload: the detail loader calls iNaturalist, and scanning
      // the grid would burn through its rate limit.
      preload={false}
      className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-lg bg-brand-light px-5 pt-5 pb-4 md:px-6 md:pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-20 h-2 rounded-t-lg"
        style={{
          backgroundColor: item.category
            ? `var(--color-category-${item.category})`
            : 'var(--color-brand-green)',
        }}
      />

      {url && (
        <m.div
          className="pointer-events-none absolute inset-0"
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
            className="size-full object-cover"
            onError={(e) => {
              ;(e.currentTarget.parentElement as HTMLElement).style.display =
                'none'
            }}
          />
          {/* black/55 floor keeps 12px white text ≥4.5:1 even over a pure-white photo. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/55" />
        </m.div>
      )}

      <div className="relative z-10 flex h-full flex-col gap-5">
        {(status || familyLabel) && (
          <div className="flex flex-wrap items-center gap-2">
            {status && (
              <span
                className={`rounded-full border px-2.5 font-brand-mono text-xs leading-6 ${pillBorder} ${textColor}`}
              >
                <span aria-hidden="true">{status.code}</span>
                <span className="sr-only">
                  {`${SOURCE_LABELS[status.source]} ${status.code}: ${status.label}`}
                </span>
              </span>
            )}
            {familyLabel && (
              <span
                className={`rounded-full border px-2.5 font-brand-mono text-xs leading-6 ${pillBorder} ${textColor}`}
              >
                {familyLabel}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {hasCommonName ? (
            <>
              <h2
                className={`font-brand-sans text-[clamp(1.5rem,1.1rem+1vw,2rem)] leading-[31px] tracking-[0.04em] ${textColor}`}
              >
                {item.species_common_name}
              </h2>
              {scientificName && (
                <p
                  className={`font-brand-mono text-base tracking-[0.04em] ${textColor}`}
                >
                  <IMRS_ScientificName name={scientificName} />
                </p>
              )}
            </>
          ) : (
            <h2
              className={`font-brand-sans text-[clamp(1.5rem,1.1rem+1vw,2rem)] leading-[31px] tracking-[0.04em] ${textColor}`}
            >
              {scientificName ? (
                <IMRS_ScientificName name={scientificName} />
              ) : (
                'Unidentified species'
              )}
            </h2>
          )}
        </div>

        <div
          className={`border-t ${onPhoto ? 'border-brand-light/15' : 'border-brand-green-dark/15'}`}
        />

        <div className="mt-auto flex items-end justify-between gap-4">
          <p
            className={`flex flex-wrap items-center gap-1 font-brand-mono text-xs leading-6 ${onPhoto ? 'text-brand-light' : 'text-brand-gray'}`}
          >
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb}-${i}`} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight className="size-3" aria-hidden="true" />
                )}
                {crumb}
              </span>
            ))}
          </p>
          <ArrowRight
            className={`size-6 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none ${onPhoto ? 'text-brand-light' : 'text-brand-ink'}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  )
})

export const IMRS_SpeciesGridView = ({
  items,
  columns,
}: {
  items: Array<Species>
  columns: 1 | 2 | 3
}) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const rowCount = Math.ceil(items.length / columns)

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 4,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
    // mounting mid-page (table→grid, scroll kept) measures rows during render; flushSync there errors.
    useFlushSync: false,
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
        const startIndex = virtualRow.index * columns
        const rowItems = items.slice(startIndex, startIndex + columns)
        const translateY = virtualRow.start - virtualizer.options.scrollMargin

        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className={`grid gap-6 pb-6 ${GRID_COLS_CLASS[columns]}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${translateY}px)`,
            }}
          >
            {rowItems.map((item) => (
              <IMRS_SpeciesCard key={item.id} item={item} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
