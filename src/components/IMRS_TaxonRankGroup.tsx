// One accordion section of the "Taxonomic Filters" list. Single-select
// per rank via real radios so screen readers get arrow-key nav for free.
import { useId, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import type { RankOption } from '@/types/speciesIndex'

const RADIO_CLASS =
  'appearance-none size-3 shrink-0 rounded-[2px] border-[0.5px] border-brand-ink checked:bg-brand-green checked:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none'

type Props = {
  label: string
  pluralLabel: string
  options: Array<RankOption>
  value: string | undefined
  onChange: (value: string | null) => void
  defaultOpen?: boolean
  /** Genus names are italic by nomenclature convention. */
  italic?: boolean
}

export const IMRS_TaxonRankGroup = ({
  label,
  pluralLabel,
  options,
  value,
  onChange,
  defaultOpen = false,
  italic = false,
}: Props) => {
  const name = useId()
  const filterId = useId()
  const [open, setOpen] = useState(defaultOpen || value != null)
  const [filter, setFilter] = useState('')

  const valueClass = italic ? 'italic' : ''

  const showFilterInput = options.length > 10
  const lowerFilter = filter.toLowerCase()
  const visibleOptions = showFilterInput
    ? options.filter(
        (opt) =>
          opt.value.toLowerCase().includes(lowerFilter) || opt.value === value,
      )
    : options

  return (
    <details
      className="group list-none [&::-webkit-details-marker]:hidden"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        <span className="flex items-baseline gap-2">
          <span className="font-brand-sans text-xl tracking-[0.04em] text-brand-ink leading-[31px]">
            {label}
          </span>
          {!open && value != null && (
            <span
              className={`font-brand-mono text-xs text-brand-gray ${valueClass}`}
            >
              {value}
            </span>
          )}
        </span>
        <ChevronUp
          className="size-6 shrink-0 text-brand-ink transition-transform group-open:rotate-0 rotate-180"
          aria-hidden="true"
        />
      </summary>

      <fieldset className="mt-[10px]">
        <legend className="sr-only">{label}</legend>

        {options.length === 0 ? (
          <p className="font-brand-mono text-xs text-brand-gray">
            No {pluralLabel.toLowerCase()} in this selection
          </p>
        ) : (
          <>
            {showFilterInput && (
              <div className="mb-2">
                <label htmlFor={filterId} className="sr-only">
                  {`Filter ${pluralLabel.toLowerCase()}`}
                </label>
                <input
                  id={filterId}
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={`Filter ${pluralLabel.toLowerCase()}…`}
                  className="h-8 w-full rounded-md bg-brand-light px-3 font-brand-sans text-sm text-brand-ink focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                />
              </div>
            )}

            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  className={RADIO_CLASS}
                  checked={value === undefined}
                  onChange={() => onChange(null)}
                />
                <span className="font-brand-sans text-base leading-6 tracking-[0.04em] text-brand-ink">
                  All {pluralLabel}
                </span>
              </label>

              {visibleOptions.length === 0 ? (
                <p className="font-brand-mono text-xs text-brand-gray">
                  No matches
                </p>
              ) : (
                <div className="flex max-h-60 flex-col gap-[5px] overflow-y-auto pr-4 fade-bottom">
                  {visibleOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                        className={RADIO_CLASS}
                      />
                      <span
                        className={`font-brand-sans text-base leading-6 tracking-[0.04em] text-brand-ink ${valueClass}`}
                      >
                        {opt.value}
                      </span>
                      <span className="ml-auto font-brand-mono text-xs tabular-nums text-brand-gray">
                        {opt.count}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </fieldset>
    </details>
  )
}
