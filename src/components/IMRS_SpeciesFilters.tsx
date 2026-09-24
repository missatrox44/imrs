// "Filters & Sorting" panel. Rendered both
// inline in a desktop aside and inside a mobile drawer; the page owns the
// landmark and open/close state.
import { PanelLeftClose } from 'lucide-react'
import type { Category } from '@/types/category'
import type {
  RankOption,
  TaxonRankKey,
  TaxonSelection,
} from '@/types/speciesIndex'
import { ALL_CATEGORIES, TAXONOMIC_RANKS } from '@/data/constants'
import { CATEGORY_LABELS, categoryPillStyle } from '@/lib/categoryPill'
import { getCategoryIcon } from '@/lib/getCategoryIcon'
import { IMRS_TaxonRankGroup } from '@/components/IMRS_TaxonRankGroup'

const PLURAL_LABELS: Record<TaxonRankKey, string> = {
  kingdom: 'Kingdoms',
  phylum: 'Phyla',
  class_name: 'Classes',
  order_name: 'Orders',
  family: 'Families',
  genus: 'Genera',
}

const PILL_CLASS =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 font-brand-mono text-xs leading-6 focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none'
const PILL_INACTIVE_CLASS =
  'border border-brand-ink bg-transparent text-brand-ink hover:bg-brand-sand'

type Props = {
  category: Category
  onCategoryChange: (c: Category) => void
  selection: TaxonSelection
  rankOptions: Record<TaxonRankKey, Array<RankOption>>
  onRankChange: (key: TaxonRankKey, value: string | null) => void
  onClose: () => void
  closeLabel: string
}

export const IMRS_SpeciesFilters = ({
  category,
  onCategoryChange,
  selection,
  rankOptions,
  onRankChange,
  onClose,
  closeLabel,
}: Props) => (
  <div>
    <div className="flex items-center justify-between">
      <h2 className="font-brand-sans text-[32px] leading-[31px] tracking-[0.04em] text-brand-ink">
        Filters &amp; Sorting
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="cursor-pointer rounded-sm text-brand-ink focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
      >
        <PanelLeftClose className="size-6" aria-hidden="true" />
      </button>
    </div>

    <div className="mt-6">
      <h3 className="font-brand-sans text-xl leading-[31px] tracking-[0.04em] text-brand-ink">
        Species
      </h3>
      <div
        role="group"
        aria-label="Species category"
        className="mt-2 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={category === 'all'}
          onClick={() => onCategoryChange('all')}
          className={
            PILL_CLASS + ' ' + (category === 'all' ? '' : PILL_INACTIVE_CLASS)
          }
          style={category === 'all' ? categoryPillStyle('all') : undefined}
        >
          {CATEGORY_LABELS.all}
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={category === cat}
            onClick={() => onCategoryChange(cat)}
            className={
              PILL_CLASS + ' ' + (category === cat ? '' : PILL_INACTIVE_CLASS)
            }
            style={category === cat ? categoryPillStyle(cat) : undefined}
          >
            <span aria-hidden="true">{getCategoryIcon(cat)}</span>
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
    </div>

    <h2 className="mt-10 font-brand-sans text-[32px] leading-[31px] tracking-[0.04em] text-brand-ink">
      Taxonomic Filters
    </h2>
    <div className="mt-4 flex flex-col">
      {TAXONOMIC_RANKS.map(({ key, label }, i) => (
        <div
          key={key}
          className={
            i === 0 ? 'py-4 first:pt-0' : 'border-t border-brand-ink/30 py-4'
          }
        >
          <IMRS_TaxonRankGroup
            label={label}
            pluralLabel={PLURAL_LABELS[key]}
            options={rankOptions[key]}
            value={selection[key]}
            onChange={(value) => onRankChange(key, value)}
            defaultOpen={key === 'kingdom'}
            italic={key === 'genus'}
          />
        </div>
      ))}
    </div>
  </div>
)
