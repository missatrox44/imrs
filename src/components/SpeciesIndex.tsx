import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger,  } from "@/components/ui/tabs";

interface Species {
  id: number;
  scientific_name: string;
  common_name: string;
  family: string;
  notes: string;
  category: 'plants' | 'reptiles' | 'mammals' | 'birds';
}

const SpeciesIndex = () => {
  const [species, setSpecies] = useState<Array<Species>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'plants' | 'reptiles' | 'mammals' | 'birds'>('plants');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch('/data/species.json');
        const data = await response.json();
        setSpecies(data);
      } catch (error) {
        console.error('Error fetching species data:', error);
        setSpecies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, []);

  const filteredSpecies = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    // If there's a search term, search across all species
    if (searchTerm) {
      return species.filter(
        (s) =>
          s.scientific_name.toLowerCase().includes(searchLower) ||
          s.common_name.toLowerCase().includes(searchLower) ||
          s.family.toLowerCase().includes(searchLower) ||
          s.notes.toLowerCase().includes(searchLower)
      );
    }
    
    // Otherwise, filter by active tab category
    return species.filter((s) => s.category === activeTab);
  }, [species, searchTerm, activeTab]);

  const getCategoryCount = (category: 'plants' | 'reptiles' | 'mammals' | 'birds') => {
    return species.filter((s) => s.category === category).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading species index...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Species Index</h1>
          <p className="text-muted-foreground mb-6">
            Comprehensive database of species documented at the Indio Mountains Research Station
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

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="plants">Plants ({getCategoryCount('plants')})</TabsTrigger>
              <TabsTrigger value="reptiles">Reptiles ({getCategoryCount('reptiles')})</TabsTrigger>
              <TabsTrigger value="mammals">Mammals ({getCategoryCount('mammals')})</TabsTrigger>
              <TabsTrigger value="birds">Birds ({getCategoryCount('birds')})</TabsTrigger>
            </TabsList>

            <div className="mt-6 mb-4 text-sm text-muted-foreground">
              {searchTerm 
                ? `Showing ${filteredSpecies.length} matching results (from ${species.length} total)`
                : `Showing ${filteredSpecies.length} ${activeTab}`
              }
            </div>

            {['plants', 'reptiles', 'mammals', 'birds'].map((category) => (
              <TabsContent key={category} value={category}>
                {filteredSpecies.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? `No species found matching "${searchTerm}"` 
                          : `No ${category} data available.`
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredSpecies.map((speciesItem) => (
                      <Link key={speciesItem.id} to={`/species/${speciesItem.id}`}>
                        <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                  <h3 className="scientific-name text-lg font-medium">
                                    {speciesItem.scientific_name}
                                  </h3>
                                  <span className="text-foreground font-semibold">
                                    {speciesItem.common_name}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                  <Badge variant="secondary">
                                    {speciesItem.family}
                                  </Badge>
                                </div>
                                
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                  {speciesItem.notes}
                                </p>
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
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SpeciesIndex;