import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Mountain } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { GazetteerEntry } from "@/types/gazetteer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GAZETTEER_ROLODEX } from "@/data/gazetteer";
import { formatElevation } from "@/lib/formatElevation";
import { formatCoordinates } from "@/lib/formatCoordinates";

export const hasCoordinates = (
  entry: GazetteerEntry
): entry is GazetteerEntry & { latitude: number; longitude: number } =>
  typeof entry.latitude === "number" &&
  typeof entry.longitude === "number";

export const GazetteerRolodex = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedEntries = useMemo(() => {
    return [...GAZETTEER_ROLODEX].sort((a, b) => a.name.localeCompare(b.name));
  }, []);


  const nextCard = () => {
    setActiveIndex((prev) => 
      prev < sortedEntries.length - 1 ? prev + 1 : 0
    );
  };

  const prevCard = () => {
    setActiveIndex((prev) => 
      prev > 0 ? prev - 1 : sortedEntries.length - 1
    );
  };

  return (
    <section className="text-center mt-20 container mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-4">Explore Locations</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
        Discover the diverse locations on Indio Mountains Research Station
      </p>

      {/* Rolodex Card Stack */}
      <div className="relative flex flex-col items-center">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevCard}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[80px] text-center">
            {activeIndex + 1} of {sortedEntries.length}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextCard}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Card Stack Container */}
        <div className="relative w-full max-w-lg h-[340px] perspective-1000">
          <AnimatePresence mode="popLayout">
            {sortedEntries.map((entry, index) => {
              const offset = index - activeIndex;
              const isVisible = Math.abs(offset) <= 2;
              
              if (!isVisible) return null;

              return (
                <motion.div
                  key={entry.id}
                  className="absolute inset-0 w-full"
                  initial={{ 
                    rotateX: offset > 0 ? -15 : 15, 
                    y: offset * 20,
                    scale: 1 - Math.abs(offset) * 0.05,
                    opacity: 0 
                  }}
                  animate={{ 
                    rotateX: offset * -8,
                    y: offset * 25,
                    scale: 1 - Math.abs(offset) * 0.05,
                    zIndex: 10 - Math.abs(offset),
                    opacity: 1 - Math.abs(offset) * 0.3
                  }}
                  exit={{ 
                    rotateX: offset < 0 ? -15 : 15,
                    opacity: 0 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    pointerEvents: offset === 0 ? "auto" : "none"
                  }}
                >
                  <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden h-full">
                    {/* Card Header Tab */}
                    <div className="bg-muted/50 border-b border-border px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {entry.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-foreground">
                        {entry.name}
                      </h3>

                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {entry.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          
                          <MapPin className="w-3 h-3" />
                          {formatCoordinates(entry.latitude, entry.longitude)}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Mountain className="w-3 h-3" />
                          {formatElevation(entry.elevationMeters)}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Footer - Lines like an index card */}
                    <div className="px-6 pb-4 space-y-2">
                      <div className="h-px bg-border/50" />
                      <div className="h-px bg-border/50" />
                      <div className="h-px bg-border/50" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick Navigation Dots */}
        {sortedEntries.length > 1 && (
          <div className="flex gap-2 mt-6">
            {sortedEntries.slice(0, 10).map((entry, index) => (
              <button
                key={entry.id}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex 
                    ? "bg-primary" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to ${entry.name}`}
              />
            ))}
            {sortedEntries.length > 10 && (
              <span className="text-xs text-muted-foreground ml-1">+{sortedEntries.length - 10}</span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button asChild size="lg" className="mt-8">
          <Link to="/gazetteer" className="flex items-center gap-2">
            View All Locations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
