// Every filter lives in the URL; the filter panel is an inline aside at xl
// and a left drawer below it.
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useInView } from 'react-intersection-observer'
import { useReducedMotion } from 'framer-motion'
import { PanelLeftOpen } from 'lucide-react'
import { Drawer as Vaul } from 'vaul'
import type { Species } from '@/types/species'
import type { Category } from '@/types/category'
import type {
  SpeciesSearch,
  TaxonRankKey,
  TaxonSelection,
} from '@/types/speciesIndex'
import { TAXONOMIC_RANKS } from '@/data/constants'
import {
  applySearchTerm,
  applyTaxonomicFilters,
  filterByCategory,
  getRankOptions,
  setRank,
  sortSpecies,
} from '@/components/speciesFilter'
import { IMRS_Page_Hero } from '@/components/IMRS_Page_Hero'
import { IMRS_SpeciesToolbar } from '@/components/IMRS_SpeciesToolbar'
import { IMRS_ActiveFilterChips } from '@/components/IMRS_ActiveFilterChips'
import { IMRS_SpeciesFilters } from '@/components/IMRS_SpeciesFilters'
import { IMRS_SpeciesGridView } from '@/components/IMRS_SpeciesGridView'
import { IMRS_SpeciesTableView } from '@/components/IMRS_SpeciesTableView'
import { IMRS_BackToTop } from '@/components/IMRS_BackToTop'
import { Route } from '@/routes/species.index'

function pickSelection(search: SpeciesSearch): TaxonSelection {
  const selection: TaxonSelection = {}
  for (const { key } of TAXONOMIC_RANKS) {
    if (search[key]) selection[key] = search[key]
  }
  return selection
}

export const IMRS_SpeciesIndex = () => {
  const search = Route.useSearch()
  const species: Array<Species> = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 300 })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isXl = useMediaQuery('(min-width: 1280px)')
  const isSm = useMediaQuery('(min-width: 640px)')
  const shouldReduceMotion = useReducedMotion()
  const toolbarEl = useRef<HTMLDivElement>(null)
  const { ref: toolbarInViewRef, inView: toolbarInView } = useInView({
    initialInView: true,
  })

  const scrollToToolbar = () => {
    const el = toolbarEl.current
    if (!el) return
    el.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    el.querySelector<HTMLElement>('input')?.focus({ preventScroll: true })
  }

  const { category, sort } = search
  const view = isSm ? search.view : 'grid'
  const selection = pickSelection(search)

  const inCategory = useMemo(
    () => filterByCategory(species, category),
    [species, category],
  )
  const rankOptions = getRankOptions(inCategory, selection)
  const results = sortSpecies(
    applySearchTerm(
      applyTaxonomicFilters(inCategory, selection),
      debouncedSearchTerm,
    ),
    sort,
  )

  // filter/sort/view changes keep the scroll position; the router resets it by default.
  const setSelection = (next: TaxonSelection) =>
    navigate({
      search: { category, view: search.view, sort, ...next },
      resetScroll: false,
    })
  const setRankValue = (key: TaxonRankKey, value: string | null) =>
    setSelection(setRank(selection, key, value))
  // Rank options cascade from the category, so a new category starts clean.
  const setCategory = (next: Category) =>
    navigate({
      search: { category: next, view: search.view, sort },
      resetScroll: false,
    })
  const clearAll = () => setCategory('all')

  const activeFilterCount =
    (category === 'all' ? 0 : 1) + Object.keys(selection).length
  const columns = isXl ? (sidebarOpen ? 2 : 3) : isSm ? 2 : 1

  const filters = (onClose: () => void, closeLabel: string) => (
    <IMRS_SpeciesFilters
      category={category}
      onCategoryChange={setCategory}
      selection={selection}
      rankOptions={rankOptions}
      onRankChange={setRankValue}
      onClose={onClose}
      closeLabel={closeLabel}
    />
  )

  return (
    <main>
      <IMRS_Page_Hero
        image="/imgs/hero-species.webp"
        imageWidth={500}
        imageHeight={500}
        title="Species Index"
        subtitle="Comprehensive database of species documented on IMRS."
      />

      <section className="relative -mt-[53px] overflow-clip rounded-t-4xl bg-brand-paper pt-16 pb-16 md:pt-22 lg:-mt-[106px] lg:rounded-t-[64px] lg:pt-[120px]">
        <img
          src="/footer-texture.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
        />

        <div className="relative px-4 sm:px-8 lg:px-16">
          {/* scroll-mt clears the sticky header when Back to top lands here. */}
          <div
            ref={(node) => {
              toolbarEl.current = node
              toolbarInViewRef(node)
            }}
            className="scroll-mt-28 lg:scroll-mt-36"
          >
            <IMRS_SpeciesToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sort={sort}
              onSortChange={(next) =>
                navigate({
                  search: (prev) => ({ ...prev, sort: next }),
                  resetScroll: false,
                })
              }
              view={view}
              onViewChange={(next) =>
                navigate({
                  search: (prev) => ({ ...prev, view: next }),
                  resetScroll: false,
                })
              }
              showViewToggle={isSm}
              onOpenFilters={isXl ? undefined : () => setDrawerOpen(true)}
              activeFilterCount={activeFilterCount}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-brand-ink/40 pb-8 lg:mt-12 lg:pb-12">
            <IMRS_ActiveFilterChips
              category={category}
              selection={selection}
              onRemoveCategory={() => setCategory('all')}
              onRemoveRank={(key) => setRankValue(key, null)}
              onClearAll={clearAll}
            />
            <p
              className="ml-auto font-brand-mono text-base tracking-[0.04em] text-brand-gray"
              role="status"
              aria-live="polite"
            >
              Showing {results.length} species
            </p>
          </div>

          <div className="mt-8 flex items-start gap-6 lg:mt-12">
            {isXl &&
              (sidebarOpen ? (
                <aside
                  aria-label="Species filters"
                  className="sticky top-28 max-h-[calc(100dvh-8rem)] w-[clamp(300px,29%,417px)] shrink-0 overflow-y-auto pr-4 fade-bottom"
                >
                  {filters(() => setSidebarOpen(false), 'Hide filters')}
                </aside>
              ) : (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Show filters"
                  aria-expanded={false}
                  className="sticky top-28 shrink-0 cursor-pointer rounded-sm p-1 text-brand-ink hover:text-brand-green focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                >
                  <PanelLeftOpen className="size-6" aria-hidden="true" />
                </button>
              ))}

            <div className="@container min-w-0 flex-1">
              {results.length === 0 ? (
                <div className="rounded-lg bg-brand-light px-6 py-16 text-center">
                  <p className="font-brand-sans text-base tracking-[0.04em] text-brand-ink">
                    {debouncedSearchTerm
                      ? `No species match “${debouncedSearchTerm}” with these filters.`
                      : 'No species match these filters.'}
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="mt-4 cursor-pointer font-brand-mono text-xs leading-6 text-brand-gray hover:text-brand-ink hover:underline focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              ) : view === 'table' ? (
                <IMRS_SpeciesTableView items={results} />
              ) : (
                <IMRS_SpeciesGridView items={results} columns={columns} />
              )}
            </div>
          </div>
        </div>
      </section>

      <IMRS_BackToTop visible={!toolbarInView} onClick={scrollToToolbar} />

      {!isXl && (
        <Vaul.Root
          direction="left"
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        >
          <Vaul.Portal>
            <Vaul.Overlay className="fixed inset-0 z-40 bg-brand-ink/40" />
            <Vaul.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(420px,90vw)] flex-col overflow-y-auto bg-brand-paper p-6 text-brand-ink outline-none">
              <Vaul.Title className="sr-only">Species filters</Vaul.Title>
              <Vaul.Description className="sr-only">
                Filter the species index by category and taxonomic rank.
              </Vaul.Description>
              {filters(() => setDrawerOpen(false), 'Close filters')}
            </Vaul.Content>
          </Vaul.Portal>
        </Vaul.Root>
      )}
    </main>
  )
}
