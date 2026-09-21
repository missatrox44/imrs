// Reskin of SearchInput (Figma 80:1781): 48px light pill with the icon inset 21px.
import { useId } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const IMRS_SearchInput = ({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}: Props) => {
  const id = useId()
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search
        className="absolute top-1/2 left-[21px] size-6 -translate-y-1/2 text-brand-ink"
        aria-hidden="true"
      />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={100}
        className="h-12 w-full rounded-2xl bg-brand-light pr-12 pl-[57px] font-brand-sans text-base tracking-[0.04em] text-brand-ink outline-none placeholder:text-brand-ink focus-visible:ring-1 focus-visible:ring-brand-green"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-sm p-1 text-brand-ink hover:text-brand-green focus-visible:ring-1 focus-visible:ring-brand-green focus-visible:outline-none"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
