import { useState } from 'react'
import {
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SpeciesGridView } from './SpeciesGridView'
import type { Species } from '@/types/species'
import type { Category } from '@/types/category'
import { SpeciesTableView } from '@/components/SpeciesTableView'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader } from '@/components/Loader'
// import { AdvancedSearch } from '@/components/AdvancedSearch';
import { ALL_CATEGORIES } from '@/data/constants'
import { SearchInput } from '@/components/SearchInput'


const TABS: Array<Category> = ['all', ...ALL_CATEGORIES]

const SpeciesIndex = () => {
  const [activeTab, setActiveTab] = useState<Category>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'grid' | 'table'>('grid')

  const { data: species = [], isLoading } = useQuery({
    queryKey: ['speciesData'],
    queryFn: async () => {
      const res = await fetch('/api/species')
      // console.log('Species data:', res)
      if (!res.ok) throw new Error('Failed to fetch species')
      return res.json()
    },
    // staleTime: 0,
  })

  // Filter based on search term as well
  const filterSpecies = (items: Array<Species>) => {
    if (!searchTerm) return items
    const lowerTerm = searchTerm.toLowerCase()
    return items.filter(
      (s) =>
        (s.genus && s.genus.toLowerCase().includes(lowerTerm)) ||
        (s.species && s.species.toLowerCase().includes(lowerTerm)) ||
        (s.species_common_name &&
          s.species_common_name.toLowerCase().includes(lowerTerm)) ||
        (s.family && s.family.toLowerCase().includes(lowerTerm)),
    )
  }

  const getFilteredItems = (category: Category) => {
    const items =
      category === 'all'
        ? species
        : species.filter((s: Species) => s.category === category)
    return filterSpecies(items)
  }

  const filtered = getFilteredItems(activeTab)

  const getCategoryCount = (category: Category) => {
    return getFilteredItems(category).length
  }

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

          <div className="flex items-center gap-2 bg-muted/50 p-1 border">
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

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Category)}
        >
          <div className="overflow-x-auto mb-6">
            <TabsList className="flex w-max space-x-2">
              {TABS.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat === 'all'
                    ? `View All (${getCategoryCount(cat)})`
                    : `${cat[0].toUpperCase() + cat.slice(1)} (${getCategoryCount(cat)})`}
                </TabsTrigger>
              ))}
            </TabsList>
            <p className="mt-2 text-xs text-muted-foreground animate-pulse lg:hidden">
              Scroll right to see more →
            </p>
          </div>

          {/* <AdvancedSearch /> */}

          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filtered.length}{' '}
            {activeTab === 'all' ? 'species' : activeTab}
          </div>

          {TABS.map((category) => {
            const items = getFilteredItems(category)

            return (
              <TabsContent key={category} value={category}>
                {items.length === 0 ? (
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

                  <SpeciesGridView items={items} />

                ) : (
                  <SpeciesTableView items={items} />
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </main>
  )
}

export default SpeciesIndex
