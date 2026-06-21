import { useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from '@uidotdev/usehooks'
import { Layers } from 'lucide-react'
import type { ComponentType } from 'react'
import type { GazetteerMapProps } from '@/components/GazetteerMap'
import { GAZETTEER_ENTRIES } from '@/data/gazetteer'
import { SearchInput } from '@/components/SearchInput'
import { MapLegend } from '@/components/GazetteerMapLegend'
import { GazetteerCardList } from '@/components/GazetteerCardList'
import {
  GazetteerMobileSheet,
  SHEET_MID,
  SHEET_PEEK,
} from '@/components/GazetteerMobileSheet'

const Gazetteer = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const [MapComponent, setMapComponent] =
    useState<ComponentType<GazetteerMapProps> | null>(null)
  const isMobile = useMediaQuery('(max-width: 1023.98px)')
  const [snap, setSnap] = useState<number | string | null>(SHEET_PEEK)

  // Dynamically import leaflet map only on the client
  useEffect(() => {
    import('@/components/GazetteerMap').then((m) => {
      setMapComponent(() => m.GazetteerMap)
    })
  }, [])

  const filteredAndSortedEntries = useMemo(() => {
    return GAZETTEER_ENTRIES.filter((entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [searchTerm])

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

  // Clicking the already-selected entry toggles it off.
  const toggleSelected = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id))

  // On mobile, selecting a card drops the sheet to half height so the
  // flown-to pin is visible above it; deselecting leaves the sheet as-is.
  const handleMobileSelect = (id: string) => {
    const isSelecting = selectedId !== id
    setSelectedId(isSelecting ? id : null)
    if (isSelecting) setSnap(SHEET_MID)
  }

  // The mobile view is a full-screen map + sheet — lock page scroll so the
  // footer (rendered after <main> in the root layout) stays below the fold.
  useEffect(() => {
    if (!isMobile) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isMobile])

  const mapInner = MapComponent ? (
    <MapComponent
      entries={filteredAndSortedEntries}
      selectedId={selectedId}
      onPinClick={toggleSelected}
    />
  ) : (
    <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
      Loading map…
    </div>
  )

  if (isMobile) {
    return (
      <main className="bg-background">
        <h1 className="sr-only">IMRS Gazetteer</h1>
        <div className="isolate z-0 h-[calc(100dvh-4rem)] w-full">
          {mapInner}
          <p className="sr-only">
            Use Tab to navigate map pins. Arrow keys pan the map when focused.
            Press Enter or Space on a card in the list to highlight its pin.
          </p>
        </div>
        <GazetteerMobileSheet
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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            IMRS Gazetteer
          </h1>
          <p className="text-muted-foreground md:text-balance">
            A comprehensive list of notable locations and features on Indio
            Mountains Research Station
          </p>
        </div>

        {/* Desktop: side-by-side | Mobile: stacked */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map column: legend + map */}
          <div className="lg:w-1/2 xl:w-3/5 lg:sticky lg:top-6 flex flex-col gap-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-1.5">
                Click the layers icon
                <Layers className="size-3.5 shrink-0" aria-hidden="true" />
                (top-right of the map) to:
              </p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Switch between Satellite and Street (2D) views</li>
                <li>Toggle the Roads overlay on or off</li>
              </ul>
            </div>
            <MapLegend />
            <div className="isolate h-[40vh] min-h-[320px] lg:h-[calc(80vh-6rem)] rounded-sm border overflow-hidden">
              {mapInner}
              <p className="sr-only">
                Use Tab to navigate map pins. Arrow keys pan the map when
                focused. Press Enter or Space on a card in the list to highlight
                its pin.
              </p>
            </div>
          </div>

          {/* Cards panel */}
          <div className="lg:w-1/2 xl:w-2/5 lg:relative">
            <div className="lg:absolute lg:inset-0 lg:overflow-y-auto">
              <div className="sticky top-0 z-10 bg-background pb-4">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search locations"
                />
              </div>

              <GazetteerCardList
                entries={filteredAndSortedEntries}
                totalCount={GAZETTEER_ENTRIES.length}
                selectedId={selectedId}
                onSelect={toggleSelected}
                cardRefs={cardRefs}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Gazetteer
