// Reskin of Gazetteer (Figma 80:1716). State and data flow mirror
// components/Gazetteer.tsx; only presentation changes. The Leaflet map itself
// (GazetteerMap) is shared with the legacy page.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useInView } from 'react-intersection-observer'
import { useReducedMotion } from 'framer-motion'
import { Layers, Maximize2, Minimize2 } from 'lucide-react'
import type { ComponentType } from 'react'
import type { GazetteerMapProps } from '@/components/GazetteerMap'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { GAZETTEER_ENTRIES } from '@/data/gazetteer'
import { IMRS_BackToTop } from '@/components/IMRS_BackToTop'
import { IMRS_Page_Hero } from '@/components/IMRS_Page_Hero'
import { IMRS_SearchInput } from '@/components/IMRS_SearchInput'
import { IMRS_GazetteerMapLegend } from '@/components/IMRS_GazetteerMapLegend'
import { IMRS_GazetteerCardList } from '@/components/IMRS_GazetteerCardList'
import {
  IMRS_GazetteerMobileSheet,
  SHEET_MID,
  SHEET_PEEK,
} from '@/components/IMRS_GazetteerMobileSheet'

const BULLET_CLASS =
  'flex items-center gap-[10px] before:size-2 before:shrink-0 before:rounded-full before:bg-brand-green-light'

export const IMRS_Gazetteer = () => {
  const [searchTerm, setSearchTerm] = useState('')
  // Keep the input instant; debounce the value the map and list consume so
  // typing doesn't rebuild Leaflet markers on every keystroke.
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 200 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const [MapComponent, setMapComponent] =
    useState<ComponentType<GazetteerMapProps> | null>(null)
  const isMobile = useMediaQuery('(max-width: 1023.98px)')
  const [snap, setSnap] = useState<number | string | null>(SHEET_PEEK)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Inline mobile list: the pill shows once the search field has scrolled
  // above the viewport. The root margin turns the observed area into the
  // strip above the viewport top, so "in view" means "scrolled past".
  const searchEl = useRef<HTMLDivElement>(null)
  const { ref: searchInViewRef, inView: searchScrolledPast } = useInView({
    rootMargin: '100000px 0px -100% 0px',
  })
  const shouldReduceMotion = useReducedMotion()

  const scrollToSearch = () => {
    const el = searchEl.current
    if (!el) return
    el.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    el.querySelector('input')?.focus({ preventScroll: true })
  }

  // Dynamically import leaflet map only on the client
  useEffect(() => {
    import('@/components/GazetteerMap').then((m) => {
      setMapComponent(() => m.GazetteerMap)
    })
  }, [])

  const filteredAndSortedEntries = useMemo(() => {
    return GAZETTEER_ENTRIES.filter((entry) =>
      entry.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [debouncedSearchTerm])

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

  // Clicking the already-selected entry toggles it off. Stable identity so
  // the memoized map and card list don't re-render on parent renders.
  const toggleSelected = useCallback(
    (id: string) => setSelectedId((prev) => (prev === id ? null : id)),
    [],
  )

  // On mobile, selecting a card drops the sheet to half height so the
  // flown-to pin is visible above it; deselecting leaves the sheet as-is.
  const handleMobileSelect = (id: string) => {
    const isSelecting = selectedId !== id
    setSelectedId(isSelecting ? id : null)
    if (isSelecting) setSnap(SHEET_MID)
  }

  // Full-screen map + sheet: lock page scroll so the footer stays below the
  // fold, and nudge Leaflet to re-measure its container, which changed size
  // without a window resize.
  useEffect(() => {
    if (!isFullscreen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new Event('resize'))
    return () => {
      document.body.style.overflow = previous
      window.dispatchEvent(new Event('resize'))
    }
  }, [isFullscreen])

  const mapInner = MapComponent ? (
    <MapComponent
      entries={filteredAndSortedEntries}
      selectedId={selectedId}
      onPinClick={toggleSelected}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-brand-sand font-brand-mono text-base tracking-[0.04em] text-brand-gray">
      Loading map…
    </div>
  )

  const mapHint = (
    <p className="sr-only">
      Use Tab to navigate map pins. Arrow keys pan the map when focused. Press
      Enter or Space on a card in the list to highlight its pin.
    </p>
  )

  const hero = (
    <IMRS_Page_Hero
      image="/imgs/hero-gazetteer.webp"
      imageWidth={2272}
      imageHeight={846}
      title="IMRS Gazetteer"
      subtitle="A comprehensive list of notable locations and features on Indio Mountains Research Station"
    />
  )

  if (isMobile) {
    const fullscreenToggle = (
      <button
        type="button"
        onClick={() => setIsFullscreen((v) => !v)}
        aria-pressed={isFullscreen}
        aria-label={isFullscreen ? 'Exit full screen' : 'Full screen map'}
        // Sits under Leaflet's layers control (10px margin + 44px button + 10px gap).
        className="absolute top-16 right-[10px] z-[1001] flex size-[34px] cursor-pointer items-center justify-center rounded-[4px] border-2 border-black/20 bg-brand-light text-brand-ink hover:bg-brand-cream focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
      >
        {isFullscreen ? (
          <Minimize2 className="size-4" aria-hidden="true" />
        ) : (
          <Maximize2 className="size-4" aria-hidden="true" />
        )}
      </button>
    )

    return (
      <main className="text-brand-ink">
        {hero}

        {/* Paper section rides 53px up over the hero (half the desktop overlap and radius). */}
        <section className="relative -mt-[53px] overflow-clip rounded-t-[32px] bg-brand-paper px-4 pt-10 pb-16">
          <img
            src="/footer-texture.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
          />

          <div className="relative flex flex-col gap-3">
            <p className="flex flex-wrap items-center gap-1.5 font-brand-sans text-base leading-6 tracking-[0.04em]">
              Tap the layers icon
              <Layers className="size-5 shrink-0" aria-hidden="true" />
              (top-right of the map) to switch Satellite/Street views or toggle
              Roads.
            </p>
            <IMRS_GazetteerMapLegend />
          </div>

          <div className="relative mt-5 rounded-2xl bg-brand-sand p-3">
            <div
              className={
                isFullscreen
                  ? 'fixed inset-0 z-40 isolate'
                  : 'relative isolate h-[60dvh] overflow-hidden rounded-[5px]'
              }
            >
              {mapInner}
              {mapHint}
              {fullscreenToggle}
            </div>
          </div>

          {!isFullscreen && (
            <div className="relative mt-6 flex flex-col gap-4">
              {/* scroll-mt keeps the field clear of the sticky header (77px + 16px). */}
              <div
                ref={(node) => {
                  searchEl.current = node
                  searchInViewRef(node)
                }}
                className="scroll-mt-28"
              >
                <IMRS_SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search locations"
                />
              </div>
              <IMRS_GazetteerCardList
                entries={filteredAndSortedEntries}
                totalCount={GAZETTEER_ENTRIES.length}
                selectedId={selectedId}
                onSelect={toggleSelected}
                cardRefs={cardRefs}
                searchTerm={debouncedSearchTerm}
              />
            </div>
          )}
        </section>

        <IMRS_BackToTop
          visible={!isFullscreen && searchScrolledPast}
          onClick={scrollToSearch}
        />

        {/* Stays mounted: vaul only honors the peek snap point when it animates open. */}
        <IMRS_GazetteerMobileSheet
          open={isFullscreen}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          entries={filteredAndSortedEntries}
          totalCount={GAZETTEER_ENTRIES.length}
          selectedId={selectedId}
          onSelect={handleMobileSelect}
          cardRefs={cardRefs}
          snap={snap}
          setSnap={setSnap}
        />
      </main>
    )
  }

  return (
    <main>
      {hero}

      {/* Paper section rides 106px up over the hero so its rounded top reads against the photo. */}
      <section
        aria-labelledby="gazetteer-map-heading"
        className="relative -mt-[106px] overflow-clip rounded-t-[64px] bg-brand-paper pt-[120px] pb-[120px] text-brand-ink"
      >
        <img
          src="/footer-texture.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
        />

        <div className="relative px-8 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,755px)] lg:justify-between">
            <h2
              id="gazetteer-map-heading"
              className="font-brand-sans text-[56px] leading-[63px] tracking-[0.04em] text-brand-green-dark"
            >
              Map
            </h2>

            <div className="flex flex-col gap-4 font-brand-sans text-xl leading-[31px] tracking-[0.04em] lg:col-start-1 lg:row-start-2">
              <p className="flex flex-wrap items-center gap-1.5">
                Click the layers icon
                <Layers className="size-6 shrink-0" aria-hidden="true" />
                (top-right of the map) to:
              </p>
              <ul className="flex flex-col gap-[3px]">
                <li className={BULLET_CLASS}>
                  Switch between Satellite and Street (2D) views
                </li>
                <li className={BULLET_CLASS}>
                  Toggle the Roads overlay on or off
                </li>
              </ul>
            </div>

            <IMRS_SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search locations"
              className="self-start lg:col-start-2 lg:row-start-2"
            />
          </div>

          <div className="mt-5">
            <IMRS_GazetteerMapLegend />
          </div>
        </div>

        {/* Panel outdents 30px past the content gutter (Figma x=34 vs 64). */}
        <div className="relative mx-4 mt-8 flex flex-col gap-6 rounded-2xl bg-brand-sand p-6 lg:mx-[34px] lg:flex-row lg:px-[31px]">
          <div className="isolate h-[clamp(467px,55vh,640px)] flex-1 overflow-hidden rounded-[5px]">
            {mapInner}
            {mapHint}
          </div>

          {/* 491px of cards + 30px gap + 11px scrollbar track (Figma 80:1779). WebKit-only styling: a standard scrollbar-color would make Chrome ignore it. */}
          <div className="max-h-[clamp(467px,55vh,640px)] overflow-y-auto pr-[30px] lg:w-[532px] lg:shrink-0 [&::-webkit-scrollbar]:w-[11px] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-brand-green [&::-webkit-scrollbar-track]:rounded-[3px] [&::-webkit-scrollbar-track]:bg-brand-light">
            <IMRS_GazetteerCardList
              entries={filteredAndSortedEntries}
              totalCount={GAZETTEER_ENTRIES.length}
              selectedId={selectedId}
              onSelect={toggleSelected}
              cardRefs={cardRefs}
              searchTerm={debouncedSearchTerm}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
