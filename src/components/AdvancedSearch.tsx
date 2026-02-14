import { useMemo } from 'react'
import { ArrowUpDown, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Category } from '@/types/category'
import type { Species } from '@/types/species'
import type { TaxonomicFilters } from '@/components/SpeciesIndex'
import { ALL_CATEGORIES, TAXONOMIC_RANKS } from '@/data/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getCategoryIcon } from '@/lib/getCategoryIcon'

interface AdvancedSearchProps {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
  getCategoryCount: (category: Category) => number
  species: Array<Species>
  taxonomicFilters: TaxonomicFilters
  onTaxonomicFilterChange: (filters: TaxonomicFilters) => void
  onResetFilters: () => void
  sortDirection: 'asc' | 'desc'
  onSortChange: (direction: 'asc' | 'desc') => void
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function getUniqueValues(items: Array<Species>, key: keyof Species): Array<string> {
  const values = new Set<string>()
  for (const item of items) {
    const val = item[key]
    if (val && typeof val === 'string' && val.trim()) {
      values.add(capitalize(val.trim()))
    }
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b))
}

export function AdvancedSearch({
  activeCategory,
  onCategoryChange,
  getCategoryCount,
  species,
  taxonomicFilters,
  onTaxonomicFilterChange,
  onResetFilters,
  sortDirection,
  onSortChange,
}: AdvancedSearchProps) {

  // Compute cascading options for each taxonomic rank
  const taxonomicOptions = useMemo(() => {
    // Start with species filtered by category
    const baseItems = activeCategory === 'all'
      ? species
      : species.filter((s) => s.category === activeCategory)

    const options: Record<string, Array<string>> = {}

    for (let i = 0; i < TAXONOMIC_RANKS.length; i++) {
      const rank = TAXONOMIC_RANKS[i]
      // Filter by all higher-rank selections
      let filtered = baseItems
      for (let j = 0; j < i; j++) {
        const higherRank = TAXONOMIC_RANKS[j]
        const selectedValue = taxonomicFilters[higherRank.key]
        if (selectedValue) {
          filtered = filtered.filter(
            (s) => s[higherRank.key as keyof Species]?.toString().toLowerCase() === selectedValue.toLowerCase(),
          )
        }
      }
      options[rank.key] = getUniqueValues(filtered, rank.key as keyof Species)
    }

    return options
  }, [species, activeCategory, taxonomicFilters])

  const handleFilterChange = (rankKey: keyof TaxonomicFilters, value: string | null) => {
    const newFilters = { ...taxonomicFilters }
    newFilters[rankKey] = value

    // Clear all lower-rank selections
    const rankIndex = TAXONOMIC_RANKS.findIndex((r) => r.key === rankKey)
    for (let i = rankIndex + 1; i < TAXONOMIC_RANKS.length; i++) {
      newFilters[TAXONOMIC_RANKS[i].key] = null
    }

    onTaxonomicFilterChange(newFilters)
  }

  return (
    <div className="bg-card border border-border p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          Filters & Sorting
        </span>
      </div>

      {/* Quick Category Filters */}
      <div className="mb-4 pb-4 border-b border-border">
        <label className="text-xs text-muted-foreground font-medium mb-2 block">
          Quick Category (click to filter)
        </label>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className="h-7 text-xs capitalize"
          >
            All Species ({getCategoryCount('all')})
          </Button>

          {ALL_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="h-7 text-xs capitalize gap-1"
            >
              {getCategoryIcon(category)}
              {category} ({getCategoryCount(category)})
            </Button>
          ))}
        </div>
      </div>

      {/* Taxonomic Filters */}
      <label className="text-xs text-muted-foreground font-medium mb-2 block">
        Taxonomic Filters
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {TAXONOMIC_RANKS.map(({ key, label }) => {
          const options = taxonomicOptions[key]
          const selectedValue = taxonomicFilters[key]

          return (
            <div key={key} className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Filter className="w-3 h-3" /> {label}
              </label>

              <Select
                value={selectedValue ?? 'all'}
                onValueChange={(val) =>
                  handleFilterChange(key, val === 'all' ? null : val)
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {label.endsWith('y') ? `${label.slice(0, -1)}ies` : label.endsWith('s') ? `${label}es` : `${label}s`}</SelectItem>
                  {options.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        })}
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            Sort species by:
          </span>
        </div>

        <Select
          value={sortDirection}
          onValueChange={(val) => onSortChange(val as 'asc' | 'desc')}
        >
          <SelectTrigger className="h-8 w-30 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A → Z</SelectItem>
            <SelectItem value="desc">Z → A</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
