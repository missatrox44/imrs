import { useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Species } from '@/types/species'
import type { Category } from '@/types/category'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

const ALL_CATEGORIES: Array<Category> = [
  'mammals',
  'birds',
  'reptiles',
  'amphibians',
  'plants',
  'fungi',
  'arthropods',
  'worms',
]

const TABS: Array<Category> = ['all', ...ALL_CATEGORIES]

const SpeciesIndex = () => {
  const [activeTab, setActiveTab] = useState<Category>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: species = [], isLoading } = useQuery({
    queryKey: ['speciesData'],
    queryFn: async () => {
      // const res = await fetch('/api/species');
      const res = await fetch('/data/species.json')
      if (!res.ok) throw new Error('Failed to fetch species')
      return res.json()
    },
  })

  const filtered =
    activeTab === 'all'
      ? species
      : species.filter((s: Species) => s.category === activeTab)

  const getCategoryCount = (category: Category) => {
    if (category === 'all') return species.length
    return species.filter((s: Species) => s.category === category).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading species index...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Species Index</h1>
        <p className="text-muted-foreground mb-6">
          Comprehensive database of species documented at IMRS.
        </p>

        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search across all species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Category)}
        >
          <TabsList className="flex flex-wrap gap-2">
            {TABS.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat === 'all'
                  ? `View All (${getCategoryCount(cat)})`
                  : `${cat[0].toUpperCase() + cat.slice(1)} (${getCategoryCount(cat)})`}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 mb-4 text-sm text-muted-foreground">
            {activeTab === 'all' ? (
              <>Showing {filtered.length} species</>
            ) : (
              <>
                Showing {filtered.length} {activeTab}
              </>
            )}
          </div>
          {TABS.map((category) => {
            const items =
              category === 'all'
                ? species
                : species.filter((s: Species) => s.category === category)

            return (
              <TabsContent key={category} value={category}>
                {items.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">
                        {category === 'all'
                          ? 'No species data available.'
                          : `No ${category} data available.`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {items.map((item: Species) => (
                      <Link
                        key={item.id}
                        to="/species/$speciesId"
                        params={{ speciesId: String(item.id) }}
                      >
                        {/* <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                  <h3 className="scientific-name text-lg font-medium">
                                    {item.genus}{" "}{item.species}
                                  </h3>
                                  <span className="font-semibold">
                                    {item.species_common_name}
                                  </span>
                                </div>

                                <Badge variant="secondary">{item.family}</Badge>

                                <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                                  {item.note}
                                </p>
                              </div>

                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-4" />
                            </div>
                          </CardContent>
                        </Card> */}
                        <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                  <h3 className="scientific-name text-lg font-medium">
                                    {item.genus} {item.species}
                                  </h3>
                                  {item.species_common_name && (
                                      <span className="font-semibold">
                                    {item.species_common_name}
                                  </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {[
                                    item.phylum_common_name,
                                    item.sub_phylum_common_name,
                                    item.class_common_name,
                                    item.sub_class_common_name,
                                    item.order_common_name,
                                    item.sub_order_common_name,
                                    item.family_common_name,
                                    item.sub_family_common_name
                                  ]
                                    .filter(Boolean)
                                    .map((name, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                                        {name}
                                      </Badge>
                                    ))}
                                </div>
                                {item.family && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    {item.family}
                                  </Badge>
                                )}
                                {item.note && (
                                  <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                                    {item.note}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

export default SpeciesIndex
