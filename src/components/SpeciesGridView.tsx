import { Link } from '@tanstack/react-router'
import type { Species } from '@/types/species'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCategoryIcon } from '@/lib/getCategoryIcon'

export const SpeciesGridView = ({ items }: { items: Array<Species> }) => {
  return (
    <>
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
                      {/* <p className="text-xs text-muted-foreground font-mono mb-2 truncate">
                        {item.phylum} › {item.class_name} › {item.order_name} ›{' '}
                        {item.family}
                      </p> */}
                      {/* build breadcrumb as array, filter out missing values then join */}
                      <p className="text-xs text-muted-foreground font-mono mb-2 truncate">
                        {[
                          item.phylum,
                          item.class_name,
                          item.order_name,
                          item.family,
                        ]
                          .map((crumb) => crumb?.trim())
                          .filter(Boolean)
                          .join(' › ')}
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
                          <Badge variant="secondary" className="text-xs">
                            {item.family_common_name || item.family}
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
    </>
  )
}
