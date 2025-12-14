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

export function AdvancedSearch() {
  const [sortBy, setSortBy] = useState<'order' | 'family'>('order')
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
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Kingdoms</SelectItem>
                <SelectItem value="animalia">Animalia</SelectItem>
                <SelectItem value="plantae">Plantae</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phylum Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Phylum
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phyla</SelectItem>
                <SelectItem value="chordata">Chordata</SelectItem>
                <SelectItem value="tracheophyta">Tracheophyta</SelectItem>
                <SelectItem value="arthropoda">Arthropoda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Class Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Class
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="mammalia">Mammalia</SelectItem>
                <SelectItem value="reptilia">Reptilia</SelectItem>
                <SelectItem value="aves">Aves</SelectItem>
                <SelectItem value="magnoliopsida">Magnoliopsida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Order
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="squamata">Squamata</SelectItem>
                <SelectItem value="rodentia">Rodentia</SelectItem>
                <SelectItem value="carnivora">Carnivora</SelectItem>
                <SelectItem value="passeriformes">Passeriformes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Family Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Family
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                <SelectItem value="colubridae">Colubridae</SelectItem>
                <SelectItem value="viperidae">Viperidae</SelectItem>
                <SelectItem value="cricetidae">Cricetidae</SelectItem>
                <SelectItem value="fabaceae">Fabaceae</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Genus Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Genus
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genera</SelectItem>
                <SelectItem value="crotalus">Crotalus</SelectItem>
                <SelectItem value="peromyscus">Peromyscus</SelectItem>
                <SelectItem value="quercus">Quercus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Species Filter */}
          <div className="space-y-1">
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
          </div>
        </div>

        {/* Sort Options Row */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Sort by:
            </span>
          </div>

          {/* <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as typeof sortBy)}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="family">Family</SelectItem>
            </SelectContent>
          </Select> */}

          <Select>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">A → Z</SelectItem>
              <SelectItem value="desc">Z → A</SelectItem>
            </SelectContent>
          </Select>

          {/* <Select>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="kingdom">Kingdom</SelectItem>
              <SelectItem value="phylum">Phylum</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="family">Family</SelectItem>
            </SelectContent>
          </Select> */}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Filters
          </Button>
        </div>
      </div>
    </>
  )
}
