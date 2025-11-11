// src/routes/species.$speciesId.tsx
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ArrowLeft, Calendar, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Species = {
  id: number
  scientific_name?: string
  common_name?: string
  family?: string
  kingdom?: string
  phylum?: string
  sub_phylum?: string
  class?: string
  order?: string
  genus?: string
  species?: string
  authorship?: string
  collectors_field_numbers?: string
  records?: string
  note?: string
  notes?: string
}

interface Observation {
  id: number
  species_guess?: string
  user?: { login: string }
  observed_on_string?: string
  photos?: Array<{ url: string }>
  place_guess?: string
}

export const Route = createFileRoute('/species/$speciesId')({
  // Fetch the species + recent observations for this ID
  loader: async ({ params }) => {
    const { speciesId } = params
    const res = await fetch('/data/species.json')
    const all: Array<Species> = await res.json()

    const species =
      all.find((s) => String(s.id) === String(speciesId)) ?? null

    let observations: Array<Observation> = []
    if (species) {
      try {
        if (species.scientific_name) {
          const obsRes = await fetch(
            `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(
              species.scientific_name,
            )}&per_page=6`,
          )
          const obsJson = await obsRes.json()
          observations = obsJson.results ?? []
        } else {
          observations = []
        }
      } catch {
        observations = []
      }
    }

    return { species, observations }
  },

  pendingComponent: () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading species details...</p>
          </div>
        </div>
      </div>
    </div>
  ),

  component: SpeciesDetailPage,
})

export function SpeciesDetailPage() {
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

  // const notes = species.note ?? '';
  // const records = species.records ?? '';

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
            {/* Species Information */}
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <div className="space-y-2">
                  <h1 className="scientific-name text-2xl font-medium">
                    {species.genus}{" "}{species.species}
                  </h1>
                  {species.common_name && (
                    <h2 className="text-3xl font-bold text-foreground">
                      {species.common_name}
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
                {/* Notes/Records */}
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
                      Record
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
                      No iNaturalist observations recorded for this species at IMRS yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {observations.slice(0, 4).map((observation) => (
                      <Card key={observation.id} className="border">
                        <CardContent className="p-4">
                          {getPhotoUrl(observation.photos) && (
                            <div className="aspect-square overflow-hidden rounded-lg mb-3">
                              <img
                                src={getPhotoUrl(observation.photos)!}
                                alt={
                                  observation.species_guess || 'Observation'
                                }
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    'none'
                                }}
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>
                                {observation.user?.login || 'Anonymous'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatDate(observation.observed_on_string)}
                              </span>
                            </div>
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Taxonomy card */}
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Taxonomy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ['Kingdom', species.kingdom],
                  ['Phylum', species.phylum],
                  ['Subphylum', species.sub_phylum],
                  ['Class', species.class],
                  ['Order', species.order],
                  ['Family', species.family],
                  ['Genus', species.genus],
                  ['Species', species.species],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label as string}>
                      <div className="text-sm text-muted-foreground">
                        {label}
                      </div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ) : null
                )}
                {/* Always show scientific name row */}
                {/* <div>
                  <div className="text-sm text-muted-foreground">
                    Scientific Name
                  </div>
                  <div className="scientific-name">
                    {species.genus} {species.species}
                  </div>
                </div> */}
                {/* {species.authorship && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Authorship
                    </div>
                    <div className="font-medium">{species.authorship}</div>
                  </div>
                )} */}
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  )
}