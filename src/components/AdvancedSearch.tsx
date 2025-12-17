import { ArrowUpDown, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

// Define the filter state type
export interface TaxonomicFilters {
  kingdom: string
  phylum: string
  class: string
  order: string
  family: string
  genus: string
  sortOrder: 'asc' | 'desc'
}

// Props interface
interface AdvancedSearchProps {
  filters: TaxonomicFilters
  onFilterChange: (filterName: keyof TaxonomicFilters, value: string) => void
  onReset: () => void
  // Optional: pass in available options if you want dynamic filtering
  availableOptions?: {
    kingdoms?: Array<string>
    phylums?: Array<string>
    classes?: Array<string>
    orders?: Array<string>
    families?: Array<string>
    genuses?: Array<string>
  }
}

export function AdvancedSearch({
  filters,
  onFilterChange,
  onReset,
  availableOptions
}: AdvancedSearchProps) {
  return (
    <>
      <div className="bg-card border border-border p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Advanced Filters & Sorting
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Kingdom Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Kingdom
            </label>
            <Select
              value={filters.kingdom || 'all'}
              onValueChange={(value) => onFilterChange('kingdom', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Kingdoms</SelectItem>
                {availableOptions?.kingdoms?.map(kingdom => (
                  <SelectItem key={kingdom} value={kingdom}>
                    {kingdom.charAt(0).toUpperCase() + kingdom.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phylum Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Phylum
            </label>
            <Select
              value={filters.phylum || 'all'}
              onValueChange={(value) => onFilterChange('phylum', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phyla</SelectItem>
                {availableOptions?.phylums?.map(phylum => (
                  <SelectItem key={phylum} value={phylum}>
                    {phylum.charAt(0).toUpperCase() + phylum.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Filter */}
          {/* Class Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Class
            </label>
            <Select
              value={filters.class || 'all'}
              onValueChange={(value) => onFilterChange('class', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {availableOptions?.classes?.map(cls => (
                  <SelectItem key={cls} value={cls}>
                    {cls.charAt(0).toUpperCase() + cls.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Order
            </label>
            <Select
              value={filters.order || 'all'}
              onValueChange={(value) => onFilterChange('order', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {availableOptions?.orders?.map(order => (
                  <SelectItem key={order} value={order}>
                    {order.charAt(0).toUpperCase() + order.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Family Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Family
            </label>
            <Select
              value={filters.family || 'all'}
              onValueChange={(value) => onFilterChange('family', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                {availableOptions?.families?.map(family => (
                  <SelectItem key={family} value={family}>
                    {family.charAt(0).toUpperCase() + family.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genus Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Genus
            </label>
            <Select
              value={filters.genus || 'all'}
              onValueChange={(value) => onFilterChange('genus', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genera</SelectItem>
                {availableOptions?.genuses?.map(genus => (
                  <SelectItem key={genus} value={genus}>
                    {genus.charAt(0).toUpperCase() + genus.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Species Filter */}
          {/* <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Species
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Species</SelectItem>
                <SelectItem value="specific">Specific epithet...</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        {/* Sort Options Row */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Sort by:
            </span>
          </div>


          <Select
            value={filters.sortOrder}
            onValueChange={(value: 'asc' | 'desc') => onFilterChange('sortOrder', value)}
          >
            <SelectTrigger className="h-8 w-[120px] text-xs">
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
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={onReset}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Filters
          </Button>
        </div>
      </div>
    </>
  )
}
