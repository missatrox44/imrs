import { useMemo, useState } from 'react'
import { MapPin, Mountain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
import { GAZETTEER_ENTRIES } from '@/data/gazetteer'
import { formatCoordinates } from '@/lib/formatCoordinates'
import { formatElevation } from '@/lib/formatElevation'
import { SearchInput } from '@/components/SearchInput'

const Gazetteer = () => {
  const [searchTerm, setSearchTerm] = useState('')
  // const [selectedImage, setSelectedImage] = useState<{
  //   url: string
  //   name: string
  // } | null>(null)

  const filteredAndSortedEntries = useMemo(() => {
    return GAZETTEER_ENTRIES.filter((entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [searchTerm])

  // Entries with images
  // const entriesWithImages = ['echo-spring', 'red-tank', 'echo-peak']

  // const getImageUrl = (id: string) => {
  //   const seed = id.split('-').join('')
  //   return `https://picsum.photos/seed/${seed}/300/200`
  // }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              IMRS Gazetteer
            </h1>
            <p className="text-muted-foreground md:text-balance">
              A comprehensive list of notable locations and features within the
              Indio Mountains Research Station
            </p>
          </div>
          <div className="mb-6">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search locations"
            />
          </div>
          {/* <h1>{filteredAndSortedEntries.length}</h1> */}
          <div className="space-y-4">
            {filteredAndSortedEntries.length > 0 ? (
              filteredAndSortedEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{entry.name}</CardTitle>
                    {entry.alternateNames?.length ? (
                      <p className="text-sm text-muted-foreground italic">
                        aka {entry.alternateNames.join(', ')}
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    {/* <div
                      className={
                        entriesWithImages.includes(entry.id)
                          ? 'flex flex-col md:flex-row gap-4'
                          : ''
                      }
                    > */}
                     <div>
                      <div className="flex-1 space-y-3">
                        <p className="text-muted-foreground">
                          {entry.description}
                        </p>

                        <div className="flex flex-wrap gap-2 text-sm">
                          {entry.latitude && entry.longitude && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <MapPin className="w-3 h-3" />
                              {formatCoordinates(
                                entry.latitude,
                                entry.longitude,
                              )}
                            </Badge>
                          )}

                          {entry.elevationMeters && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Mountain className="w-3 h-3" />
                              {formatElevation(entry.elevationMeters)}
                            </Badge>
                          )}
                        </div>
                      </div>
{/* 
                      {entriesWithImages.includes(entry.id) && (
                        <div className="shrink-0">
                          <img
                            src={getImageUrl(entry.id)}
                            alt={entry.name}
                            className="w-full md:w-75 h-50 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() =>
                              setSelectedImage({
                                url: getImageUrl(entry.id),
                                name: entry.name,
                              })
                            }
                          />
                        </div>
                      )} */}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No locations found matching "{searchTerm}"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {filteredAndSortedEntries.length > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedEntries.length} of{' '}
              {GAZETTEER_ENTRIES.length} locations
            </div>
          )}
        </div>
      </main>

      {/* <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <img
              src={selectedImage?.url}
              alt={selectedImage?.name}
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}

export default Gazetteer
