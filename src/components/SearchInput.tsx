import { useId } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}: SearchInputProps) => {
  const id = useId()
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"
        aria-hidden="true"
      />
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 100))}
        placeholder={placeholder}
        className={value ? 'pl-10 pr-10' : 'pl-10'}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
