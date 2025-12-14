import { useState } from 'react'
import { ArrowUpDown, Bird, Bug, ChevronRight, Filter, Flower2, ImageOff, Leaf, Rabbit, RotateCcw, Search, Shell, SlidersHorizontal, Turtle } from "lucide-react";
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Species } from '@/types/species'
import type { Category } from '@/types/category'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Loader } from "@/components/Loader";

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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'plants':
      return <Leaf className="w-4 h-4" />;
    case 'birds':
      return <Bird className="w-4 h-4" />;
    case 'mammals':
      return <Rabbit className="w-4 h-4" />;
    case 'reptiles':
      return <Turtle className="w-4 h-4" />;
    case 'amphibians':
      return <Shell className="w-4 h-4" />;
    case 'arthropods':
      return <Bug className="w-4 h-4" />;
    case 'fungi':
      return <Flower2 className="w-4 h-4" />;
    case 'worms':
      return <Shell className="w-4 h-4" />;
    default:
      return null;
  }
};

// TODO: add filter for different tags of common name stuff?

const SpeciesIndex = () => {
  const [activeTab, setActiveTab] = useState<Category>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: species = [], isLoading } = useQuery({
    queryKey: ['speciesData'],
    queryFn: async () => {
      const res = await fetch('/api/species')
      console.log("Species data:", res)
      if (!res.ok) throw new Error('Failed to fetch species')
      return res.json()
    },
    // staleTime: 0,  
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
      <Loader dataTitle="species catalog" />
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
          <div className="overflow-x-auto">
            <TabsList className="flex  w-max space-x-2" >
              {TABS.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat === 'all'
                    ? `View All (${getCategoryCount(cat)})`
                    : `${cat[0].toUpperCase() + cat.slice(1)} (${getCategoryCount(cat)})`}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground animate-pulse lg:hidden">
            Scroll right to see more →
          </p>
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
                        <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">


                              <div className="flex-1 min-w-0">
                                {/* Scientific + Common Name */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
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
                                  {item.phylum} › {item.class_name} › {item.order_name} › {item.family}
                                </p>

                                {/* Phylum & Class */}
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

                                {/* Order & Family */}
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  {(item.family_common_name || item.family) && (
                                    <Badge variant="secondary" className="text-xs">
                                      {item.family_common_name ?? item.family}
                                    </Badge>
                                  )}
                                  {/* {item.family && (
                                    <Badge variant="outline" className="text-xs">
                                      Family: {item.family}
                                    </Badge>
                                  )} */}
                                </div>

                                {/* Notes */}
                                {/* {item.note && (
                                  <p className="text-muted-foreground text-sm line-clamp-2">
                                    {item.note}
                                  </p>
                                )} */}
                              </div>

                              <ChevronRight className="shrink-0 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors self-center" />
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
