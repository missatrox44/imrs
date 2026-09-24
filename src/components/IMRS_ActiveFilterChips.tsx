// Row of active-filter chips above the species results.
import { X } from 'lucide-react'
import type { Category } from '@/types/category'
import type { TaxonRankKey, TaxonSelection } from '@/types/speciesIndex'
import { CATEGORY_LABELS, categoryPillStyle } from '@/lib/categoryPill'
import { getLineage } from '@/components/speciesFilter'

const CHIP_CLASS =
  'inline-flex items-center gap-2 rounded-full px-2.5 font-brand-mono text-xs leading-6 focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none'

type Props = {
  category: Category
  selection: TaxonSelection
  onRemoveCategory: () => void
  onRemoveRank: (key: TaxonRankKey) => void
  onClearAll: () => void
}

export const IMRS_ActiveFilterChips = ({
  category,
  selection,
  onRemoveCategory,
  onRemoveRank,
  onClearAll,
}: Props) => {
  const lineage = getLineage(selection)
  if (category === 'all' && lineage.length === 0) return null

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-4">
      {category !== 'all' && (
        <li>
          <button
            type="button"
            onClick={onRemoveCategory}
            aria-label={`Remove ${CATEGORY_LABELS[category]} filter`}
            className={CHIP_CLASS}
            style={categoryPillStyle(category)}
          >
            {CATEGORY_LABELS[category]}
            <X className="size-3" aria-hidden="true" />
          </button>
        </li>
      )}
      {lineage.map(({ key, label, value }) => (
        <li key={key}>
          <button
            type="button"
            onClick={() => onRemoveRank(key)}
            aria-label={`Remove ${label}: ${value} filter`}
            className={`${CHIP_CLASS} bg-brand-sand text-brand-ink ${key === 'genus' ? 'italic' : ''}`}
          >
            {value}
            <X className="size-3" aria-hidden="true" />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClearAll}
          className="font-brand-mono text-xs leading-6 text-brand-gray hover:text-brand-ink hover:underline focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
        >
          Clear All
        </button>
      </li>
    </ul>
  )
}
