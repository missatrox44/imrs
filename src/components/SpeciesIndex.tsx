import { useState } from 'react'
import {
  ChevronRight,
  ImageOff,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Species } from '@/types/species'
import type { Category } from '@/types/category'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader } from '@/components/Loader'
// import { AdvancedSearch } from '@/components/AdvancedSearch';
import { getCategoryIcon } from '@/lib/getCategoryIcon'
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
      console.log('Species data:', res)
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
              Comprehensive database of species documented at IMRS.
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: Species) => (
                      <Link
                        key={item.id}
                        to="/species/$speciesId"
                        params={{ speciesId: String(item.id) }}
                        className="h-full"
                      >
                        <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer h-full">
                          <CardContent className="p-4 sm:p-6 h-full">
                            <div className="flex flex-col h-full justify-between">
                              {/* Top content */}
                              <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  {/* Scientific + Common Name */}
                                  <div className="flex flex-col gap-1 mb-2">
                                    <div className="flex items-center gap-2">
                                      {item.category && (
                                        <span className="text-muted-foreground">
                                          {getCategoryIcon(item.category)}
                                        </span>
                                      )}
                                      <h3 className="scientific-name text-lg font-medium truncate">
                                        {item.genus} {item.species}
                                      </h3>
                                    </div>

                                    {item.species_common_name && (
                                      <span className="text-foreground font-semibold truncate">
                                        {item.species_common_name}
                                      </span>
                                    )}
                                  </div>

                                  {/* Taxonomic Path */}
                                  <p className="text-xs text-muted-foreground font-mono mb-2 truncate">
                                    {item.phylum} › {item.class_name} ›{' '}
                                    {item.order_name} › {item.family}
                                  </p>

                                  {/* <div className="flex flex-wrap items-center gap-2 mb-2">
                                  {item.phylum && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-normal opacity-70 border-dashed"
                                    >
                                      {item.phylum}
                                    </Badge>
                                  )}
                                  {item.class_name && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-normal opacity-70 border-dashed"
                                    >
                                      {item.class_name}
                                    </Badge>
                                  )}
                                </div> */}

                                  {/* Family Badge */}
                                  {(item.family_common_name || item.family) && (
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {item.family_common_name ?? item.family}
                                      </Badge>
                                    </div>
                                  )}
                                  {/* {item.family && (
                                    <Badge variant="outline" className="text-xs">
                                      Family: {item.family}
                                    </Badge>
                                  )} */}

                                  {/* Notes */}
                                  {/* {item.note && (
                                  <p className="text-muted-foreground text-sm line-clamp-2">
                                    {item.note}
                                  </p>
                                )} */}
                                </div>
                              </div>

                              {/* <div className="flex justify-end pt-4">
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div> */}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className=" border bg-card">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50px]">
                              Type
                            </th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                              Scientific Name
                            </th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                              Common Name
                            </th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">
                              Family
                            </th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden lg:table-cell">
                              Order
                            </th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50px]"></th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {items.map((item: Species) => (
                            <tr
                              key={item.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group"
                            >
                              <td className="p-4 align-middle">
                                {item.category &&
                                  getCategoryIcon(item.category)}
                              </td>
                              <td className="p-4 align-middle font-medium">
                                <Link
                                  to="/species/$speciesId"
                                  params={{ speciesId: String(item.id) }}
                                  className="hover:underline flex items-center gap-2"
                                >
                                  <span className="scientific-name">
                                    {item.genus} {item.species}
                                  </span>
                                </Link>
                              </td>
                              <td className="p-4 align-middle">
                                {item.species_common_name || '-'}
                              </td>
                              <td className="p-4 align-middle hidden md:table-cell">
                                {item.family}
                                {item.family_common_name && (
                                  <span className="text-muted-foreground ml-1">
                                    ({item.family_common_name})
                                  </span>
                                )}
                              </td>
                              <td className="p-4 align-middle hidden lg:table-cell">
                                {item.order_name}
                              </td>
                              <td className="p-4 align-middle">
                                <Link
                                  to="/species/$speciesId"
                                  params={{ speciesId: String(item.id) }}
                                >
                                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
