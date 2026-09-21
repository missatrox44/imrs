// Reskin of GazetteerCardList (Figma 80:1737). Same selection contract; the
// selected card gets a 4px green border and its siblings drop to 50% opacity.
import { memo } from 'react'
import type { GazetteerEntry } from '@/types/gazetteer'
import { formatCoordinates } from '@/lib/formatCoordinates'
import { formatElevation } from '@/lib/formatElevation'
import { cn } from '@/lib/utils'

interface Props {
  entries: Array<GazetteerEntry>
  totalCount: number
  selectedId: string | null
  onSelect: (id: string) => void
  cardRefs: React.MutableRefObject<Record<string, HTMLLIElement | null>>
  searchTerm: string
}

// Memoized so keystrokes in the search box (which re-render the parent) don't
// re-render every card between debounce ticks.
export const IMRS_GazetteerCardList = memo(function IMRS_GazetteerCardList({
  entries,
  totalCount,
  selectedId,
  onSelect,
  cardRefs,
  searchTerm,
}: Props) {
  if (entries.length === 0) {
    return (
      <p
        className="rounded-lg bg-brand-light px-6 py-8 text-center font-brand-mono text-base tracking-[0.04em] text-brand-gray"
        role="status"
      >
        No locations found matching "{searchTerm}"
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {entries.map((entry) => {
          const isSelected = entry.id === selectedId
          const hasCoords = entry.latitude != null && entry.longitude != null
          return (
            <li
              key={entry.id}
              ref={(el) => {
                cardRefs.current[entry.id] = el
              }}
            >
              <div
                className={cn(
                  'flex cursor-pointer flex-col gap-4 rounded-lg border-4 border-transparent bg-brand-light px-[22px] pt-3 pb-[26px] text-brand-ink transition-[opacity,border-color] focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sand focus-visible:outline-none',
                  isSelected && 'border-brand-green',
                  selectedId && !isSelected && 'opacity-50 hover:opacity-100',
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
                aria-pressed={isSelected}
              >
                <div className="flex flex-col gap-2">
                  <h2 className="font-brand-sans text-xl leading-[31px] tracking-[0.04em]">
                    {entry.name}
                  </h2>
                  {entry.alternateNames?.length ? (
                    <p className="font-brand-mono text-base leading-6 tracking-[0.04em]">
                      aka {entry.alternateNames.join(', ')}
                    </p>
                  ) : null}
                </div>

                <p className="font-brand-sans text-base leading-6 tracking-[0.04em]">
                  {entry.description}
                </p>

                <hr className="border-0 border-t border-brand-sand" />

                {(hasCoords || entry.elevationMeters) && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base leading-6 tracking-[0.04em] text-brand-green-dark">
                    {hasCoords && (
                      <span className="flex items-center gap-2 font-brand-mono">
                        <img
                          src="/icons/marker.svg"
                          alt=""
                          width={15}
                          height={15}
                        />
                        {formatCoordinates(entry.latitude, entry.longitude)}
                      </span>
                    )}
                    {entry.elevationMeters && (
                      <span className="flex items-center gap-2 font-brand-sans">
                        <img
                          src="/icons/elevation.svg"
                          alt=""
                          width={13}
                          height={11}
                        />
                        {formatElevation(entry.elevationMeters)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-center font-brand-mono text-sm tracking-[0.04em] text-brand-gray">
        Showing {entries.length} of {totalCount} locations
      </p>
    </>
  )
})
