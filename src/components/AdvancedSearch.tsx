import { ArrowUpDown, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Category } from '@/types/category'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getCategoryIcon } from '@/lib/getCategoryIcon'
import { ALL_CATEGORIES } from '@/data/constants'

interface AdvancedSearchProps {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
  getCategoryCount: (category: Category) => number
}

export function AdvancedSearch({ activeCategory, onCategoryChange, getCategoryCount }: AdvancedSearchProps) {

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
        {[
          { label: 'Kingdom', items: ['Animalia', 'Plantae'] },
          { label: 'Phylum', items: ['Chordata', 'Arthropoda'] },
          { label: 'Class', items: ['Mammalia', 'Aves'] },
          { label: 'Order', items: ['Squamata', 'Carnivora'] },
          { label: 'Family', items: ['Colubridae', 'Fabaceae'] },
          { label: 'Genus', items: ['Crotalus', 'Quercus'] },
          // { label: 'Species', items: ['Specific epithet…'] },
        ].map(({ label, items }) => (
          <div key={label} className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> {label}
            </label>

            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {label}s</SelectItem>
                {items.map((item) => (
                  <SelectItem key={item} value={item.toLowerCase()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            Sort by:
          </span>
        </div>

        <Select>
          <SelectTrigger className="h-8 w-30 text-xs">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A → Z</SelectItem>
            <SelectItem value="desc">Z → A</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCategoryChange('all')}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
