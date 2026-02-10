import { useCallback, useEffect, useState } from 'react'
import {
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useNavigate } from '@tanstack/react-router'
import { SpeciesGridView } from './SpeciesGridView'
import type { Species } from '@/types/species'
import type { Category } from '@/types/category'
import { SpeciesTableView } from '@/components/SpeciesTableView'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from '@/components/Loader'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import { SearchInput } from '@/components/SearchInput'
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

  const { data: species = [], isLoading } = useQuery({
    queryKey: ['speciesData'],
    queryFn: async () => {
      const res = await fetch('/api/species')
      if (!res.ok) throw new Error('Failed to fetch species')
      return res.json()
    },
  })

  const handleResetFilters = useCallback(() => {
    setCategory('all')
    setTaxonomicFilters(EMPTY_TAXONOMIC_FILTERS)
    setSortDirection('asc')
  }, [])

  // Filter based on search term and taxonomic filters
  const filterSpecies = (items: Array<Species>) => {
    let result = items

    // Apply taxonomic filters
    for (const [key, value] of Object.entries(taxonomicFilters)) {
      if (value) {
        result = result.filter(
          (s) => s[key as keyof Species]?.toString().toLowerCase() === value.toLowerCase(),
        )
      }
    }

    // Apply search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase()
      result = result.filter(
        (s) =>
          (s.genus && s.genus.toLowerCase().includes(lowerTerm)) ||
          (s.species && s.species.toLowerCase().includes(lowerTerm)) ||
          (s.species_common_name &&
            s.species_common_name.toLowerCase().includes(lowerTerm)) ||
          (s.family && s.family.toLowerCase().includes(lowerTerm)),
      )
    }

    return result
  }

  const getFilteredItems = (cat: Category) => {
    const items =
      cat === 'all'
        ? species
        : species.filter((s: Species) => s.category === cat)
    return filterSpecies(items)
  }

  const filtered = getFilteredItems(category)

  const sorted = filtered.slice().sort((a, b) => {
    const genusA = (a.genus ?? '').toLowerCase()
    const genusB = (b.genus ?? '').toLowerCase()
    const cmp = genusA.localeCompare(genusB) || (a.species ?? '').toLowerCase().localeCompare((b.species ?? '').toLowerCase())
    return sortDirection === 'asc' ? cmp : -cmp
  })

  const getCategoryCount = (cat: Category) => {
    return getFilteredItems(cat).length
  }

  useEffect(() => {
    if (isMobile && view !== 'grid') {
      setView('grid')
    }
  }, [isMobile, view])

  if (isLoading) {
    return <Loader dataTitle="species catalog" />
  }

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

          <div className="hidden md:flex items-center gap-2 bg-muted/50 p-1 border">
            <button
              onClick={() => setView('grid')}
              className={`p-2 transition-all ${view === 'grid'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 transition-all ${view === 'table'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
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

        <div className="mb-4 text-sm text-muted-foreground">
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
