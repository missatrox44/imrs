import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ImageOff,
  MapPin,
  User,
} from 'lucide-react'
import type { Observation } from '@/types/observation'
import type { Species } from '@/types/species'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Route } from '@/routes/species.$speciesId'
import { formatDate } from '@/lib/formatDate'
import { getPhotoUrl } from '@/lib/getPhotoUrl'

interface TaxonomyRow {
  rank: string
  scientificName: string
  commonName: string | null
  level: number
}

export function SpeciesDetails() {
  const { species, observations } = Route.useLoaderData()

  const obsCount = useMemo(() => observations.length, [observations])

  // eslint-disable-next-line no-shadow
  const buildTaxonomyHierarchy = (species: Species): Array<TaxonomyRow> => {
    const rows: Array<TaxonomyRow> = []

    if (species.kingdom) {
      rows.push({
        rank: 'Kingdom',
        scientificName: species.kingdom,
        commonName: null,
        level: 0,
      })
    }
    if (species.phylum) {
      rows.push({
        rank: 'Phylum',
        scientificName: species.phylum,
        commonName: species.phylum_common_name ?? null,
        level: 1,
      })
    }
    if (species.sub_phylum) {
      rows.push({
        rank: 'Subphylum',
        scientificName: species.sub_phylum,
        commonName: species.sub_phylum_common_name ?? null,
        level: 2,
      })
    }
    if (species.class_name) {
      rows.push({
        rank: 'Class',
        scientificName: species.class_name,
        commonName: species.class_common_name ?? null,
        level: 2,
      })
    }
    if (species.sub_class) {
      rows.push({
        rank: 'Subclass',
        scientificName: species.sub_class,
        commonName: species.sub_class_common_name ?? null,
        level: 3,
      })
    }
    if (species.order_name) {
      rows.push({
        rank: 'Order',
        scientificName: species.order_name,
        commonName: species.order_common_name ?? null,
        level: 3,
      })
    }
    if (species.sub_order) {
      rows.push({
        rank: 'Suborder',
        scientificName: species.sub_order,
        commonName: species.sub_order_common_name ?? null,
        level: 4,
      })
    }
    if (species.family) {
      rows.push({
        rank: 'Family',
        scientificName: species.family,
        commonName: species.family_common_name ?? null,
        level: 4,
      })
    }
    if (species.sub_family) {
      rows.push({
        rank: 'Subfamily',
        scientificName: species.sub_family,
        commonName: species.sub_family_common_name ?? null,
        level: 5,
      })
    }
    if (species.genus) {
      rows.push({
        rank: 'Genus',
        scientificName: species.genus,
        commonName: null,
        level: 5,
      })
    }
    if (species.species) {
      rows.push({
        rank: 'Species',
        scientificName: species.species,
        commonName: null,
        level: 6,
      })
    }

    return rows
  }

  if (!species) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Species Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The requested species could not be found in our database.
              </p>
              <Button asChild>
                <Link to="/species">Back to Species Index</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const scientificName = `${species.genus} ${species.species}`
  const taxonomyRows = buildTaxonomyHierarchy(species)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/species">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Species Index
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit capitalize">
                    {species.category}
                  </Badge>
                  <h1 className="scientific-name text-2xl font-medium">
                    {scientificName}
                  </h1>
                  <h2 className="text-3xl font-bold text-foreground">
                    {species.species_common_name}
                  </h2>
                  {species.authorship && (
                    <p className="text-sm text-muted-foreground">
                      Authorship: {species.authorship}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Description & Notes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.note}
                    </p>
                  </div>

                  {/* Collection Info */}
                  {(species.collectors_field_numbers || species.records) && (
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-3">
                        Collection Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {species.collectors_field_numbers && (
                          <div className="bg-muted/50 rounded-md p-3">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Field Number
                            </div>
                            <div className="font-mono text-sm">
                              {species.collectors_field_numbers}
                            </div>
                          </div>
                        )}
                        {species.records && (
                          <div className="bg-muted/50 rounded-md p-3">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Records
                            </div>
                            <div className="font-mono text-sm">
                              {species.records}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Observations */}

            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Recent Observations</CardTitle>
              </CardHeader>

              <CardContent>
                {obsCount === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No iNaturalist observations recorded for this species at
                      IMRS yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {observations
                      .slice(0, 4)
                      .map((observation: Observation) => (
                        <Link
                          key={observation.id}
                          to={observation.uri || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Card className="border hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                            <CardContent className="p-4">
                              {(() => {
                                const photoUrl = getPhotoUrl(observation.photos)
                                return photoUrl ? (
                                  <div className="aspect-square overflow-hidden rounded-md mb-3">
                                    <img
                                      src={photoUrl}
                                      alt={
                                        observation.species_guess ||
                                        'Observation'
                                      }
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        ;(
                                          e.target as HTMLImageElement
                                        ).style.display = 'none'
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-square flex items-center justify-center rounded-md mb-3 bg-muted/10 text-muted-foreground">
                                    <ImageOff className="w-6 h-6" />
                                  </div>
                                )
                              })()}

                              <div className="space-y-2">
                                {/* User */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  <span>
                                    {observation.user?.login || 'Anonymous'}
                                  </span>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {formatDate(observation.observed_on_string)}
                                  </span>
                                </div>

                                {/* Location */}
                                {observation.place_guess && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span className="line-clamp-1">
                                      {observation.place_guess}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Taxonomic Classification</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {taxonomyRows.map((row, index) => (
                    <div
                      key={row.rank}
                      className="px-4 py-3 hover:bg-muted/30 transition-colors"
                      style={{ paddingLeft: `${1 + row.level * 0.5}rem` }}
                    >
                      <div className="flex items-start gap-2">
                        <ChevronRight className="w-3 h-3 mt-1.5 text-muted-foreground/50 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                              {row.rank}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span
                              className={`font-medium ${row.rank === 'Species' || row.rank === 'Genus' ? 'scientific-name' : ''}`}
                            >
                              {row.scientificName}
                            </span>
                            {row.commonName && (
                              <span className="text-sm text-muted-foreground">
                                ({row.commonName})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Extra Details */}
            {/* <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Documentation Status
                  </span>
                  <Badge variant="secondary">Catalogued</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Observations</span>
                  <span className="font-medium text-right">{obsCount}</span>
                </div>
                {species.authorship && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Authorship
                    </span>
                    <span className="font-medium text-right">
                      {species.authorship}
                    </span>
                  </div>
                )}
                {species.collectors_field_numbers && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Collector&#39;s Field #
                    </span>
                    <span className="font-medium text-right">
                      {species.collectors_field_numbers}
                    </span>
                  </div>
                )}

              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
