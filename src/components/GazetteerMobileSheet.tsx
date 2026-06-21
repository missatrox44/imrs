import { Drawer as Vaul } from 'vaul'
import { Layers } from 'lucide-react'
import type { GazetteerEntry } from '@/types/gazetteer'
import { SearchInput } from '@/components/SearchInput'
import { MapLegend } from '@/components/GazetteerMapLegend'
import { GazetteerCardList } from '@/components/GazetteerCardList'

export const SHEET_SNAP_POINTS: Array<number | string> = ['180px', 0.5, 1]
export const SHEET_PEEK = SHEET_SNAP_POINTS[0]
export const SHEET_MID = SHEET_SNAP_POINTS[1]

interface GazetteerMobileSheetProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  entries: Array<GazetteerEntry>
  totalCount: number
  selectedId: string | null
  onSelect: (id: string) => void
  cardRefs: React.MutableRefObject<Record<string, HTMLLIElement | null>>
  snap: number | string | null
  setSnap: (snap: number | string | null) => void
}

export const GazetteerMobileSheet = ({
  searchTerm,
  onSearchChange,
  entries,
  totalCount,
  selectedId,
  onSelect,
  cardRefs,
  snap,
  setSnap,
}: GazetteerMobileSheetProps) => {
  return (
    <Vaul.Root
      open
      dismissible={false}
      modal={false}
      snapPoints={SHEET_SNAP_POINTS}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <Vaul.Portal>
        <Vaul.Content
          className="
            fixed inset-x-0 bottom-0 z-40
            flex h-full max-h-[88dvh] flex-col
            rounded-t-xl border-t border-border
            bg-card text-card-foreground shadow-card
          "
        >
          <Vaul.Handle className="mx-auto mt-3 mb-2 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/40" />
          <Vaul.Title className="sr-only">Locations</Vaul.Title>
          <Vaul.Description className="sr-only">
            Search and browse notable locations at Indio Mountains Research
            Station. Drag this panel up to see the full list.
          </Vaul.Description>

          <div className="shrink-0 px-4 pb-3" data-vaul-no-drag>
            <SearchInput
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search locations"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8" data-vaul-no-drag>
            <div className="mb-4 space-y-2">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                Tap the layers icon
                <Layers className="size-3.5 shrink-0" aria-hidden="true" />
                (top-right of the map) to switch Satellite/Street views or
                toggle Roads.
              </p>
              <MapLegend />
            </div>

            <GazetteerCardList
              entries={entries}
              totalCount={totalCount}
              selectedId={selectedId}
              onSelect={onSelect}
              cardRefs={cardRefs}
              searchTerm={searchTerm}
            />
          </div>
        </Vaul.Content>
      </Vaul.Portal>
    </Vaul.Root>
  )
}
