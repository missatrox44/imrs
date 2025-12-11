import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Category =
  | "mammals"
  | "birds"
  | "reptiles"
  | "amphibians"
  | "plants"
  | "fungi"
  | "arthropods"
  | "worms"
  | "all";

export interface Species {
  id: number;
  category?: string;
  kingdom?: string;
  phylum?: string;
  phylum_common_name?: string;
  sub_phylum?: string;
  sub_phylum_common_name?: string;
  class_name?: string;
  class_common_name?: string;
  sub_class?: string;
  sub_class_common_name?: string;
  order_name?: string;
  order_common_name?: string;
  sub_order?: string;
  sub_order_common_name?: string;
  family?: string;
  family_common_name?: string;
  sub_family?: string;
  sub_family_common_name?: string;
  genus?: string;
  species?: string;
  authorship?: string;
  collectors_field_numbers?: string;
  note?: string;
  species_common_name?: string;
  records?: string;
}

const ALL_CATEGORIES: Array<Category> = [
  "mammals",
  "birds",
  "reptiles",
  "amphibians",
  "plants",
  "fungi",
  "arthropods",
  "worms",
];

const TABS: Array<Category> = ["all", ...ALL_CATEGORIES];

const SpeciesIndex = () => {
  const [activeTab, setActiveTab] = useState<Category>("mammals");


  const { data: species = [], isLoading } = useQuery({
    queryKey: ["speciesData"],
    queryFn: async () => {
      const res = await fetch("libsql://imrs-species-vercel-icfg-hl0kv2s95spa1ahb7kgdtop6.aws-us-east-1.turso.io");
      if (!res.ok) throw new Error("Failed to fetch species");
      return res.json();
    },
  });


  const filtered =
    activeTab === "all"
      ? species
      : species.filter((s: Species) => s.category === activeTab);

  const getCategoryCount = (category: Category) => {
    if (category === "all") return species.length;
    return species.filter((s: Species) => s.category === category).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading species index...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Species Index</h1>
        <p className="text-muted-foreground mb-6">
          Comprehensive database of species documented at IMRS.
        </p>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Category)}>
          <TabsList className="flex flex-wrap gap-2">
            {TABS.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat === "all"
                  ? `View All (${getCategoryCount(cat)})`
                  : `${cat[0].toUpperCase() + cat.slice(1)} (${getCategoryCount(cat)})`}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 mb-4 text-sm text-muted-foreground">
            {activeTab === "all" ? (
              <>Showing {filtered.length} species</>
            ) : (
              <>Showing {filtered.length} {activeTab}</>
            )}
          </div>
          {TABS.map((category) => {
            const items =
              category === "all"
                ? species
                : species.filter((s: Species) => s.category === category);

            return (
              <TabsContent key={category} value={category}>
                {items.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">
                        {category === "all" ? "No species data available." : `No ${category} data available.`}
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
                        <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                  <h3 className="scientific-name text-lg font-medium">
                                    {item.species}{" "} {item.genus}
                                  </h3>
                                  <span className="font-semibold">{item.species_common_name}</span>
                                </div>

                                <Badge variant="secondary">{item.family}</Badge>

                                <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                                  {item.note}
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
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default SpeciesIndex;