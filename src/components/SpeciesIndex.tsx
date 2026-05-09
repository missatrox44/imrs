import { useCallback, useEffect, useState } from 'react'
import {
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useNavigate } from '@tanstack/react-router'
import { SpeciesGridView } from './SpeciesGridView'
import type { Species } from '@/types/species'
import type { Category } from '@/types/category'
import { SpeciesTableView } from '@/components/SpeciesTableView'
import { Card, CardContent } from '@/components/ui/card'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import { SearchInput } from '@/components/SearchInput'
import {
  applySearchTerm,
  applyTaxonomicFilters,
  filterByCategory,
  sortSpecies,
} from '@/components/speciesFilter'
import { Route } from '@/routes/species.index'

export type TaxonomicFilters = {
  kingdom: string | null
  phylum: string | null
  class_name: string | null
  order_name: string | null
  family: string | null
  genus: string | null
}

const EMPTY_TAXONOMIC_FILTERS: TaxonomicFilters = {
  kingdom: null,
  phylum: null,
  class_name: null,
  order_name: null,
  family: null,
  genus: null,
}

const SpeciesIndex = () => {
  const { category } = Route.useSearch()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [taxonomicFilters, setTaxonomicFilters] = useState<TaxonomicFilters>(EMPTY_TAXONOMIC_FILTERS)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const isMobile = useMediaQuery('(max-width: 767px)')

  const setCategory = (cat: Category) => {
    navigate({ to: '/species', search: { category: cat } })
  }

  const species: Array<Species> = Route.useLoaderData()

  const handleResetFilters = useCallback(() => {
    setCategory('all')
    setTaxonomicFilters(EMPTY_TAXONOMIC_FILTERS)
    setSortDirection('asc')
  }, [])

  const getFilteredItems = (cat: Category) => {
    const byCategory = filterByCategory(species, cat)
    const byTaxonomy = applyTaxonomicFilters(byCategory, taxonomicFilters)
    return applySearchTerm(byTaxonomy, searchTerm)
  }

  const filtered = getFilteredItems(category)
  const sorted = sortSpecies(filtered, sortDirection)

  const getCategoryCount = (cat: Category) => {
    return getFilteredItems(cat).length
  }

  useEffect(() => {
    if (isMobile && view !== 'grid') {
      setView('grid')
    }
  }, [isMobile, view])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Species Index</h1>
            <p className="text-muted-foreground">
              Comprehensive database of species documented on IMRS.
            </p>
          </div>

          <div
            className="hidden md:flex items-center gap-2 bg-muted/50 p-1 border"
            role="group"
            aria-label="View mode"
          >
            <button
              onClick={() => setView('grid')}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              className={`p-2 transition-all ${view === 'grid'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView('table')}
              aria-label="Table view"
              aria-pressed={view === 'table'}
              className={`p-2 transition-all ${view === 'table'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <TableIcon className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search species index"
          />
        </div>

        <AdvancedSearch
          activeCategory={category}
          onCategoryChange={setCategory}
          getCategoryCount={getCategoryCount}
          species={species}
          taxonomicFilters={taxonomicFilters}
          onTaxonomicFilterChange={setTaxonomicFilters}
          onResetFilters={handleResetFilters}
          sortDirection={sortDirection}
          onSortChange={setSortDirection}
        />

        <div
          className="mb-4 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          Showing {sorted.length}{' '}
          {category === 'all' ? 'species' : category}
        </div>

        {sorted.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No results found for "${searchTerm}" in ${category}.`
                  : category === 'all'
                    ? 'No species data available.'
                    : `No ${category} data available.`}
              </p>
            </CardContent>
          </Card>
        ) : view === 'grid' ? (
          <SpeciesGridView items={sorted} />
        ) : (
          <SpeciesTableView items={sorted} />
        )}
      </div>
    </main>
  )
}

export default SpeciesIndex
