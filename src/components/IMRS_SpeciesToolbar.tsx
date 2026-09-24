// Species index toolbar (search, sort, view toggle, filters trigger): sits
// above the results grid/table. Sort trigger reuses the Observations select
// styling so both pages match.
import { LayoutGrid, Rows3, SlidersHorizontal } from 'lucide-react'

import type { SortDirection, SpeciesView } from '@/types/speciesIndex'
import { IMRS_SearchInput } from '@/components/IMRS_SearchInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CONTENT_CLASS,
  ITEM_CLASS,
  TRIGGER_CLASS,
} from '@/components/IMRS_ObservationsFilters'

type Props = {
  searchTerm: string
  onSearchChange: (value: string) => void
  sort: SortDirection
  onSortChange: (sort: SortDirection) => void
  view: SpeciesView
  onViewChange: (view: SpeciesView) => void
  showViewToggle: boolean
  onOpenFilters?: () => void
  activeFilterCount: number
}

export const IMRS_SpeciesToolbar = ({
  searchTerm,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  showViewToggle,
  onOpenFilters,
  activeFilterCount,
}: Props) => (
  // Below xl the search takes a full-width row; the controls wrap under it.
  <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-center xl:justify-between">
    <IMRS_SearchInput
      value={searchTerm}
      onChange={onSearchChange}
      placeholder="Search species index"
      className="w-full xl:w-auto xl:max-w-[978px] xl:flex-1"
    />

    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={sort}
        onValueChange={(value) => onSortChange(value as SortDirection)}
      >
        <SelectTrigger
          aria-label="Sort species"
          className={`${TRIGGER_CLASS} min-w-0 flex-1 sm:flex-none`}
        >
          <SelectValue placeholder="Sort Species by" />
        </SelectTrigger>
        <SelectContent className={CONTENT_CLASS}>
          <SelectItem value="asc" className={ITEM_CLASS}>
            Name A → Z
          </SelectItem>
          <SelectItem value="desc" className={ITEM_CLASS}>
            Name Z → A
          </SelectItem>
        </SelectContent>
      </Select>

      {onOpenFilters && (
        <button
          type="button"
          onClick={onOpenFilters}
          aria-haspopup="dialog"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-brand-light px-4 py-0.5 font-brand-sans text-base tracking-[0.04em] text-brand-ink focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <>
              <span className="rounded-full bg-brand-green px-1.5 font-brand-mono text-xs text-brand-light">
                {activeFilterCount}
              </span>
              <span className="sr-only">, {activeFilterCount} active</span>
            </>
          )}
        </button>
      )}

      {showViewToggle && (
        <div
          role="group"
          aria-label="View mode"
          className="inline-flex rounded-full border border-brand-ink p-0.5"
        >
          <button
            type="button"
            aria-pressed={view === 'grid'}
            onClick={() => onViewChange('grid')}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 font-brand-mono text-xs leading-6 focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none ${
              view === 'grid'
                ? 'bg-brand-green text-brand-light'
                : 'text-brand-ink hover:bg-brand-sand'
            }`}
          >
            <LayoutGrid className="size-3.5" aria-hidden="true" />
            Grid
          </button>
          <button
            type="button"
            aria-pressed={view === 'table'}
            onClick={() => onViewChange('table')}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 font-brand-mono text-xs leading-6 focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none ${
              view === 'table'
                ? 'bg-brand-green text-brand-light'
                : 'text-brand-ink hover:bg-brand-sand'
            }`}
          >
            <Rows3 className="size-3.5" aria-hidden="true" />
            Table
          </button>
        </div>
      )}
    </div>
  </div>
)
