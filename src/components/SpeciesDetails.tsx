import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ArrowLeft, Calendar, MapPin, User } from 'lucide-react'
import type { Observation } from '@/types/observation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Route } from '@/routes/species.$speciesId'

export function SpeciesDetails() {
  const { species, observations } = Route.useLoaderData()

  const getPhotoUrl = (photos?: Array<{ url: string }>) =>
    photos?.[0]?.url ? photos[0].url.replace('square', 'small') : null

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'Unknown date'

  const obsCount = useMemo(() => observations.length, [observations])

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
            {/* <Card className="gradient-card shadow-card">
              <CardHeader>
                <div className="space-y-2">
                  <h1 className="scientific-name text-2xl font-medium flex flex-wrap items-baseline gap-2">
                    <span>
                      {species.genus} {species.species}
                    </span>
                    {species.authorship && (
                      <span className="text-lg not-italic text-muted-foreground">
                        {species.authorship}
                      </span>
                    )}
                  </h1>

                  {species.species_common_name && (
                    <h2 className="text-3xl font-bold text-foreground">
                      {species.species_common_name}
                    </h2>
                  )}

                  {species.family && (
                    <Badge variant="secondary" className="w-fit">
                      {species.family}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {[
                  ['Phylum', species.phylum_common_name],
                  ['Subphylum', species.sub_phylum_common_name],
                  ['Class', species.class_common_name],
                  ['Subclass', species.sub_class_common_name],
                  ['Order', species.order_common_name],
                  ['Suborder', species.sub_order_common_name],
                  ['Family', species.family_common_name],
                  ['Subfamily', species.sub_family_common_name],
                ].filter(([, v]) => v).length > 0 && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">
                      Common Taxonomic Names
                    </h3>
                    <div className="space-y-2">
                      {[
                        ['Phylum', species.phylum_common_name],
                        ['Subphylum', species.sub_phylum_common_name],
                        ['Class', species.class_common_name],
                        ['Subclass', species.sub_class_common_name],
                        ['Order', species.order_common_name],
                        ['Suborder', species.sub_order_common_name],
                        ['Family', species.family_common_name],
                        ['Subfamily', species.sub_family_common_name],
                      ]
                        .filter(([_, value]) => value)
                        .map(([label, value]) => (
                          <p key={label} className="text-muted-foreground">
                            <span className="font-medium">{label}:</span>{' '}
                            {value}
                          </p>
                        ))}
                    </div>
                  </section>
                )}

                {species.collectors_field_numbers && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-1">
                      Collector’s Field #
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.collectors_field_numbers}
                    </p>
                  </section>
                )}

                {species.note && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">
                      Notes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.note}
                    </p>
                  </section>
                )}

                {species.records && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">
                      Records
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.records}
                    </p>
                  </section>
                )}
              </CardContent>
            </Card> */}

            <Card className="gradient-card shadow-card">
              <CardHeader>
                <div className="space-y-2">
                  <h1 className="scientific-name text-2xl font-medium flex flex-wrap items-baseline gap-2">
                    <span>
                      {species.genus} {species.species}
                    </span>
                    {species.authorship && (
                      <span className="text-lg not-italic text-muted-foreground">
                        {species.authorship}
                      </span>
                    )}
                  </h1>

                  {species.species_common_name && (
                    <h2 className="text-3xl font-bold text-foreground">
                      {species.species_common_name}
                    </h2>
                  )}

                  {species.family && (
                    <Badge variant="secondary" className="w-fit">
                      {species.family}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {species.collectors_field_numbers && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-1">
                      Collector’s Field #
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.collectors_field_numbers}
                    </p>
                  </section>
                )}

                {species.note && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">
                      Notes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.note}
                    </p>
                  </section>
                )}

                {species.records && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">
                      Records
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.records}
                    </p>
                  </section>
                )}
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
                              {getPhotoUrl(observation.photos) && (
                                <div className="aspect-square overflow-hidden rounded-md mb-3">
                                  <img
                                    src={getPhotoUrl(observation.photos)!}
                                    alt={
                                      observation.species_guess || 'Observation'
                                    }
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      ;(
                                        e.target as HTMLImageElement
                                      ).style.display = 'none'
                                    }}
                                  />
                                </div>
                              )}

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
                <CardTitle>Taxonomy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ['Kingdom', species.kingdom],
                  ['Phylum', species.phylum],
                  ['Subphylum', species.sub_phylum],
                  ['Class', species.class_name],
                  ['Subclass', species.sub_class],
                  ['Order', species.order_name],
                  ['Suborder', species.sub_order],
                  ['Family', species.family],
                  ['Subfamily', species.sub_family],
                  ['Genus', species.genus],
                  ['Species', species.species],
                ]
                  .filter(([_, value]) => value) // Only show rows with values
                  .map(([label, value]) => (
                    <div key={label as string}>
                      <div className="text-sm text-muted-foreground">
                        {label}
                      </div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ))}
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
