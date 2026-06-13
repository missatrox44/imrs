import { memo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import type { Species } from '@/types/species'
import { getCategoryIcon } from '@/lib/getCategoryIcon'

const ROW_HEIGHT = 57

// Columns (base→md→lg):
// base: icon | name | common | class | chevron  (5)
// md:   icon | name | common | class | family | chevron  (6)
// lg:   icon | name | common | phylum | class | order | family | chevron  (8)
const rowGridClass =
  'grid grid-cols-[3rem_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_3rem] md:grid-cols-[3rem_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_3rem] lg:grid-cols-[3rem_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_3rem]'

const headerCellClass =
  'h-12 px-4 flex items-center font-medium text-muted-foreground text-sm'

const SpeciesRow = memo(function SpeciesRow({
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
      className={`border-b transition-colors hover:bg-muted/50 group cursor-pointer ${rowGridClass}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${ROW_HEIGHT}px`,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div role="cell" className="p-4 flex items-center">
        {item.category && getCategoryIcon(item.category)}
      </div>
      <div
        role="cell"
        className="p-4 flex items-center font-medium relative min-w-0"
      >
        <Link
          to="/species/$speciesId"
          params={{ speciesId: String(item.id) }}
          className="before:absolute before:inset-0 before:z-10 truncate"
        >
          <span className="scientific-name relative z-20 group-hover:underline">
            {item.genus ? `${item.genus} ${item.species}` : '-'}
          </span>
        </Link>
      </div>
      <div role="cell" className="p-4 flex items-center truncate">
        {item.species_common_name || '-'}
      </div>
      <div role="cell" className="p-4 hidden lg:flex items-center truncate">
        {item.phylum || '-'}
      </div>
      <div role="cell" className="p-4 flex items-center truncate">
        {item.class_name || '-'}
      </div>
      <div role="cell" className="p-4 hidden lg:flex items-center truncate">
        {item.order_name || '-'}
      </div>
      <div role="cell" className="p-4 hidden md:flex items-center truncate">
        {item.family || '-'}
      </div>
      <div role="cell" className="p-4 flex items-center">
        <ChevronRight
          className="size-4 text-muted-foreground group-hover:text-primary relative z-20"
          aria-hidden="true"
        />
      </div>
    </div>
  )
})

export const SpeciesTableView = ({ items }: { items: Array<Species> }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      className="border bg-card"
      role="table"
      aria-label="Species index results"
    >
      <div role="rowgroup">
        <div role="row" className={`border-b ${rowGridClass}`}>
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
            className={`${headerCellClass} hidden lg:flex`}
          >
            Phylum
          </div>
          <div role="columnheader" className={headerCellClass}>
            Class
          </div>
          <div
            role="columnheader"
            className={`${headerCellClass} hidden lg:flex`}
          >
            Order
          </div>
          <div
            role="columnheader"
            className={`${headerCellClass} hidden md:flex`}
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
            <SpeciesRow
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
