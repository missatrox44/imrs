// Static filter row for the observations feed (Figma 80:1185). Sits on the
// section's paper background; the feed owns the state and passes it down.
import type { Ref } from 'react'

import type { TaxonGroup } from '@/types/taxon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCategoryIcon } from '@/lib/getCategoryIcon'
import { FIRST_OBSERVATION_YEAR } from '@/data/constants'

// Filterable groups shown in the dropdown (fungi, fish, and other
// invertebrates are intentionally omitted for now).
const GROUP_OPTIONS: Array<{ value: TaxonGroup; label: string }> = [
  { value: 'plants', label: 'Plants' },
  { value: 'mammals', label: 'Mammals' },
  { value: 'birds', label: 'Birds' },
  { value: 'reptiles', label: 'Reptiles' },
  { value: 'amphibians', label: 'Amphibians' },
  { value: 'insects', label: 'Insects' },
  { value: 'arachnid', label: 'Arachnids' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - FIRST_OBSERVATION_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i),
)

export const TRIGGER_CLASS =
  'h-auto w-full cursor-pointer rounded-[4px] border-0 bg-brand-light px-4 py-0.5 font-brand-sans text-base tracking-[0.04em] text-brand-ink shadow-none focus:ring-1 focus:ring-brand-green sm:w-[198px] [&>svg]:size-3 [&>svg]:opacity-100'
export const CONTENT_CLASS =
  'rounded-[4px] border-0 bg-brand-light shadow-[0_4px_22px_rgba(0,0,0,0.14)] [&>[data-radix-select-viewport]]:p-0'
export const ITEM_CLASS =
  'rounded-none border-b border-brand-ink/10 px-4 py-2 font-brand-sans text-base tracking-[0.04em] text-brand-ink last:border-b-0 hover:bg-brand-green hover:text-brand-light data-[highlighted]:bg-brand-green data-[highlighted]:text-brand-light focus:bg-brand-green focus:text-brand-light'

type Props = {
  ref?: Ref<HTMLDivElement>
  selectedGroup: TaxonGroup
  selectedYear: string
  onGroupChange: (group: TaxonGroup) => void
  onYearChange: (year: string) => void
  /** Shown only when a filter is active. */
  totalResults: number | null
}

export const IMRS_ObservationsFilters = ({
  ref,
  selectedGroup,
  selectedYear,
  onGroupChange,
  onYearChange,
  totalResults,
}: Props) => (
  // scroll-mt keeps the row clear of the sticky header when "Back to top"
  // scrolls it into view (header is 77px + 16px/32px top padding).
  <div
    ref={ref}
    className="mb-8 flex flex-wrap items-center gap-4 scroll-mt-28 lg:gap-6 lg:scroll-mt-36"
  >
    <Select
      value={selectedGroup}
      onValueChange={(value) => onGroupChange(value as TaxonGroup)}
    >
      <SelectTrigger aria-label="Filter by group" className={TRIGGER_CLASS}>
        <SelectValue placeholder="Filter by group" />
      </SelectTrigger>
      <SelectContent className={CONTENT_CLASS}>
        <SelectItem value="all" className={ITEM_CLASS}>
          All Groups
        </SelectItem>
        {GROUP_OPTIONS.map(({ value, label }) => (
          <SelectItem key={value} value={value} className={ITEM_CLASS}>
            <span className="flex items-center gap-2">
              {getCategoryIcon(value)}
              {label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={selectedYear} onValueChange={onYearChange}>
      <SelectTrigger aria-label="Filter by year" className={TRIGGER_CLASS}>
        <SelectValue placeholder="Filter by year" />
      </SelectTrigger>
      <SelectContent className={CONTENT_CLASS}>
        <SelectItem value="all" className={ITEM_CLASS}>
          All Years
        </SelectItem>
        {YEAR_OPTIONS.map((year) => (
          <SelectItem key={year} value={year} className={ITEM_CLASS}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {totalResults !== null && (
      <span
        className="font-brand-mono text-base tracking-[0.04em] text-brand-gray"
        role="status"
        aria-live="polite"
      >
        Showing {totalResults} matching observations
      </span>
    )}
  </div>
)
