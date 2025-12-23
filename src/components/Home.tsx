import { BookOpen, Eye } from "lucide-react";
import { Link } from '@tanstack/react-router'
import { StatsCounter } from "./StatsCounter";
import { GazetteerRolodex } from "./GazetteerRolodex";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ImageCarousel";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            IMRS Biodiversity
            <span className="gradient-hero bg-clip-text text-foreground"> Explorer</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-balance">
            Explore the biodiversity of Indio Mountains Research Station (IMRS).
            Discover species and view recent observations from this unique desert ecosystem.
          </p>
        </section>

        {/* Action Cards */}
        <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="gradient-card shadow-md hover:shadow-xl transition-shadow duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Recent Observations
              </h2>
              <p className="text-muted-foreground mb-6">
                Browse the latest wildlife and plant observations from researchers and visitors on IMRS.
              </p>
              <Button asChild size="lg" className="w-full">
                <Link to="/observations">View Observations</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-md hover:shadow-xl transition-shadow duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Species Index
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore our comprehensive database of documented species found within the research station property.
              </p>
              <Button asChild variant="secondary" size="lg" className="w-full">
                <Link to="/species">Browse Species</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <StatsCounter />
        <ImageCarousel />
        <GazetteerRolodex />
      </main>
    </div>
  );
};
