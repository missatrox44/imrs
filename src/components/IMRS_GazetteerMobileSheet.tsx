// No design frame: a vaul snap-point sheet over the full-screen map, on the
// paper background with the reskin cards.
import { useEffect, useRef, useState } from 'react'
import { Drawer as Vaul } from 'vaul'
import { useReducedMotion } from 'framer-motion'
import type { GazetteerEntry } from '@/types/gazetteer'
import { IMRS_BackToTop } from '@/components/IMRS_BackToTop'
import { IMRS_SearchInput } from '@/components/IMRS_SearchInput'
import { IMRS_GazetteerCardList } from '@/components/IMRS_GazetteerCardList'

const SHEET_SNAP_POINTS: Array<number | string> = ['180px', 0.5, 1]
export const SHEET_PEEK = SHEET_SNAP_POINTS[0]
export const SHEET_MID = SHEET_SNAP_POINTS[1]

interface Props {
  open: boolean
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

export const IMRS_GazetteerMobileSheet = ({
  open,
  searchTerm,
  onSearchChange,
  entries,
  totalCount,
  selectedId,
  onSelect,
  cardRefs,
  snap,
  setSnap,
}: Props) => {
  const listEl = useRef<HTMLDivElement>(null)
  const searchEl = useRef<HTMLDivElement>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // KEY-DECISION 2026-09-26: vaul 1.1.2 leaves Radix's modal `pointer-events: none` on <body> when
  // `open` is controlled; reset it as vaul does internally, or the map and its exit button go dead.
  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      document.body.style.pointerEvents = 'auto'
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  // The list scrolls inside the sheet, so "Back to top" rewinds that
  // container and hands focus back to the search field.
  const scrollToTop = () => {
    listEl.current?.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    })
    searchEl.current?.querySelector('input')?.focus({ preventScroll: true })
  }

  return (
    <Vaul.Root
      open={open}
      dismissible={false}
      modal={false}
      snapPoints={SHEET_SNAP_POINTS}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <Vaul.Portal>
        <Vaul.Content className="fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[88dvh] flex-col overflow-clip rounded-t-[32px] bg-brand-sand text-brand-ink shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
          <img
            src="/footer-texture.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
          />
          <Vaul.Handle className="relative mx-auto mt-3 mb-3 h-1.5 w-12 shrink-0 rounded-full bg-brand-green/40" />
          <Vaul.Title className="sr-only">Locations</Vaul.Title>
          <Vaul.Description className="sr-only">
            Search and browse notable locations at Indio Mountains Research
            Station. Drag this panel up to see the full list.
          </Vaul.Description>

          <div
            ref={searchEl}
            className="relative shrink-0 px-4 pb-3"
            data-vaul-no-drag
          >
            <IMRS_SearchInput
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search locations"
            />
          </div>

          <div
            ref={listEl}
            onScroll={(e) => setShowBackToTop(e.currentTarget.scrollTop > 300)}
            className="relative flex-1 overflow-y-auto px-4 pb-8"
            data-vaul-no-drag
          >
            <IMRS_GazetteerCardList
              entries={entries}
              totalCount={totalCount}
              selectedId={selectedId}
              onSelect={onSelect}
              cardRefs={cardRefs}
              searchTerm={searchTerm}
            />
          </div>
        </Vaul.Content>
        {/* Outside the transformed sheet so the pill fixes to the viewport; the zero-size wrapper only lifts it above the sheet's z-50. */}
        <div className="fixed z-[60]">
          <IMRS_BackToTop
            visible={open && showBackToTop}
            onClick={scrollToTop}
          />
        </div>
      </Vaul.Portal>
    </Vaul.Root>
  )
}
