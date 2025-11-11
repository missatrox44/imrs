// src/routes/species.$speciesId.tsx
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ArrowLeft, Calendar, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Species {
  id: number
  scientific_name: string
  common_name: string
  family: string
  notes: string
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
        const obsRes = await fetch(
          `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(
            species.scientific_name,
          )}&per_page=6`,
        )
        const obsJson = await obsRes.json()
        observations = obsJson.results ?? []
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

function SpeciesDetailPage() {
  const { species, observations } = Route.useLoaderData()

  const getPhotoUrl = (photos?: Array<{ url: string }>) => {
    if (!photos?.length) return null
    return photos[0].url.replace('square', 'small')
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

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
          <div className="lg:col-span-2 space-y-6">
            {/* Species Information */}
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <div className="space-y-2">
                  <h1 className="scientific-name text-2xl font-medium">
                    {species.scientific_name}
                  </h1>
                  <h2 className="text-3xl font-bold text-foreground">
                   Common Name: {species.common_name}
                  </h2>
                  <Badge variant="secondary" className="w-fit">
                    {species.family}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Description & Notes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {species.notes}
                    </p>
                  </div>
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
                      No observations yet at IMRS for this species.
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
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Taxonomy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Scientific Name
                  </div>
                  <div className="scientific-name">
                    {species.scientific_name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Common Name
                  </div>
                  <div className="font-medium">{species.common_name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Family</div>
                  <div className="font-medium">{species.family}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Research Status</CardTitle>
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
                  <span className="font-medium">{obsCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}