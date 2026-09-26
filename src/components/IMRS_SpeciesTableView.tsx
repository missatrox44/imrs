// No design frame; container queries (not
// viewport breakpoints) drive column visibility since this table sits beside
// a sidebar — the parent page wraps results in an `@container` element.
import { memo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import type { Species } from '@/types/species'
import { getCategoryIcon } from '@/lib/getCategoryIcon'
import { speciesPath } from '@/lib/speciesSlug'
import { capitalize } from '@/components/speciesFilter'
import { IMRS_ScientificName } from '@/components/IMRS_ScientificName'

const ROW_HEIGHT = 57

// Columns (base→@3xl→@5xl):
// base:  icon | scientific | common | class | chevron  (5)
// @3xl:  icon | scientific | common | class | family | chevron  (6)
// @5xl:  icon | scientific | common | phylum | class | order | family | chevron  (8)
const rowGridClass =
  'grid grid-cols-[3rem_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_3rem] @3xl:grid-cols-[3rem_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_3rem] @5xl:grid-cols-[3rem_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_3rem]'

const headerCellClass =
  'h-12 px-4 flex items-center font-brand-mono text-xs uppercase tracking-[0.04em] text-brand-gray'

const IMRS_SpeciesRow = memo(function IMRS_SpeciesRow({
  item,
  index,
  translateY,
}: {
  item: Species
  index: number
  translateY: number
}) {
  return (
    <div
      role="row"
      data-index={index}
      className={`group border-b border-brand-ink/10 last:border-b-0 hover:bg-brand-sand/60 ${rowGridClass}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${ROW_HEIGHT}px`,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div role="cell" className="flex items-center p-4 text-brand-ink">
        {item.category && (
          <span aria-hidden="true">{getCategoryIcon(item.category)}</span>
        )}
      </div>
      <div
        role="cell"
        className="relative flex min-w-0 items-center p-4 font-brand-mono text-brand-green-dark"
      >
        <Link
          to="/species/$speciesId"
          params={{ speciesId: speciesPath(item) }}
          // No hover preload: the detail loader calls iNaturalist, and
          // scanning the table would burn through its rate limit.
          preload={false}
          className="truncate before:absolute before:inset-0 before:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green"
        >
          <span className="relative z-20 group-hover:underline">
            {item.genus ? (
              <IMRS_ScientificName
                name={`${item.genus} ${item.species ?? ''}`}
              />
            ) : (
              '-'
            )}
          </span>
        </Link>
      </div>
      <div
        role="cell"
        className="flex min-w-0 items-center p-4 font-brand-sans tracking-[0.04em] text-brand-green-dark"
      >
        <span className="truncate">{item.species_common_name || '-'}</span>
      </div>
      <div
        role="cell"
        className="hidden min-w-0 items-center p-4 font-brand-sans tracking-[0.04em] text-brand-green-dark @5xl:flex"
      >
        <span className="truncate">
          {item.phylum ? capitalize(item.phylum) : '-'}
        </span>
      </div>
      <div
        role="cell"
        className="flex min-w-0 items-center p-4 font-brand-sans tracking-[0.04em] text-brand-green-dark"
      >
        <span className="truncate">
          {item.class_name ? capitalize(item.class_name) : '-'}
        </span>
      </div>
      <div
        role="cell"
        className="hidden min-w-0 items-center p-4 font-brand-sans tracking-[0.04em] text-brand-green-dark @5xl:flex"
      >
        <span className="truncate">
          {item.order_name ? capitalize(item.order_name) : '-'}
        </span>
      </div>
      <div
        role="cell"
        className="hidden min-w-0 items-center p-4 font-brand-sans tracking-[0.04em] text-brand-green-dark @3xl:flex"
      >
        <span className="truncate">
          {item.family ? capitalize(item.family) : '-'}
        </span>
      </div>
      <div role="cell" className="flex items-center p-4">
        <ChevronRight
          className="relative z-20 size-4 text-brand-gray group-hover:text-brand-green-dark"
          aria-hidden="true"
        />
      </div>
    </div>
  )
})

export const IMRS_SpeciesTableView = ({ items }: { items: Array<Species> }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    // Document offset, not offsetTop: offsetTop is relative to the nearest
    // positioned ancestor, which undercounts by the hero and toolbar height.
    scrollMargin: parentRef.current
      ? parentRef.current.getBoundingClientRect().top + window.scrollY
      : 0,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      className="overflow-hidden rounded-lg bg-brand-light"
      role="table"
      aria-label="Species index results"
    >
      <div role="rowgroup">
        <div
          role="row"
          className={`border-b border-brand-ink/10 ${rowGridClass}`}
        >
          <div role="columnheader" className={headerCellClass}>
            Type
          </div>
          <div role="columnheader" className={headerCellClass}>
            Scientific Name
          </div>
          <div role="columnheader" className={headerCellClass}>
            Common Name
          </div>
          <div
            role="columnheader"
            className={`${headerCellClass} hidden @5xl:flex`}
          >
            Phylum
          </div>
          <div role="columnheader" className={headerCellClass}>
            Class
          </div>
          <div
            role="columnheader"
            className={`${headerCellClass} hidden @5xl:flex`}
          >
            Order
          </div>
          <div
            role="columnheader"
            className={`${headerCellClass} hidden @3xl:flex`}
          >
            Family
          </div>
          <div role="columnheader" className={headerCellClass}>
            <span className="sr-only">Details</span>
          </div>
        </div>
      </div>

      <div
        ref={parentRef}
        role="rowgroup"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index]
          return (
            <IMRS_SpeciesRow
              key={item.id}
              item={item}
              index={virtualItem.index}
              translateY={virtualItem.start - virtualizer.options.scrollMargin}
            />
          )
        })}
      </div>
    </div>
  )
}
