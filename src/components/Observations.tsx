import { useState } from "react";
import { Calendar, MapPin, User, } from "lucide-react";
import { Link } from '@tanstack/react-router';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Observation {
  id: number;
  species_guess?: string;
  user?: {
    login: string;
  };
  observed_on_string?: string;
  photos?: Array<{
    url: string;
  }>;
  place_guess?: string;
  uri?: string;
}

const Observations = () => {
  const [filter, setFilter] = useState("all");

  const { data = { results: [] }, isLoading } = useQuery({
  queryKey: ["observationData"],
  queryFn: async () => {
    const res = await fetch(
      "https://api.inaturalist.org/v1/observations?place_id=225419&per_page=50&order=desc&order_by=observed_on"
    );
    if (!res.ok) throw new Error("Failed to fetch observations");
    return res.json();
  },
});


// const observations: Array<Observation> = data?.results ?? [];
const observations = data.results;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPhotoUrl = (photos?: Array<{ url: string }>) => {
    if (!photos || photos.length === 0) return null;
    return photos[0].url.replace('square', 'medium');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading observations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Recent Observations</h1>
            <p className="text-muted-foreground">
              Biodiversity observations from Indio Mountains Research Station
            </p>
          </div>

          {/* <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="plants">Plants</SelectItem>
              <SelectItem value="birds">Birds</SelectItem>
              <SelectItem value="reptiles">Reptiles</SelectItem>
              <SelectItem value="insects">Insects</SelectItem>
              <SelectItem value="mammals">Mammals</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        {observations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No observations found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {observations.map((observation: Observation) => (
              <Link to={observation.uri || '#'} key={observation.id} target="_blank" rel="noopener noreferrer">
                <Card
                  key={observation.id}
                  className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
                >
                  {getPhotoUrl(observation.photos) && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={getPhotoUrl(observation.photos)!}
                        alt={observation.species_guess || 'Unknown species'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {observation.species_guess || 'Unknown Species'}
                    </h3>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{observation.user?.login || 'Anonymous'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(observation.observed_on_string)}</span>
                    </div>

                    {observation.place_guess && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{observation.place_guess}</span>
                      </div>
                    )}

                    <Badge variant="secondary" className="w-fit">
                      ID #{observation.id}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Observations;