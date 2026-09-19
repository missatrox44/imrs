import { IMRS_StatsCounter as StatsCounter } from './IMRS_StatsCounter'
import { GazetteerRolodex } from './GazetteerRolodex'
import { IMRS_WeatherMiniDashboard as WeatherMiniDashboard } from './IMRS_WeatherMiniDashboard'
import { IMRS_DocumentedWildlife as DocumentedWildlife } from './IMRS_DocumentedWildlife'

export const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Legacy hero + action cards, replaced by IMRS_DocumentedWildlife (Figma 80:1006).
          Restore imports if re-enabled: BookOpen, Eye (lucide-react); Link (@tanstack/react-router);
          Button (@/components/ui/button); Card, CardContent (@/components/ui/card).
      <main id="home-main" className="mx-auto px-4 py-12 container">
        Hero Section
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold text-foreground mb-6">
            IMRS Biodiversity
            <span className="gradient-hero bg-clip-text text-foreground">
              {' '}
              Explorer
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-balance">
            Explore the biodiversity of Indio Mountains Research Station (IMRS).
            Discover species and view recent observations from this unique
            desert ecosystem.
          </p>
        </section>

        Action Cards
        <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/observations" className="no-underline">
            <Card className="gradient-card shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="size-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="size-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Recent Observations
                </h2>
                <p className="text-muted-foreground mb-6">
                  Browse the latest wildlife and plant observations from
                  researchers and visitors on IMRS.
                </p>
                <Button size="lg" className="w-full cursor-pointer">
                  View Observations
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link
            to="/species"
            search={{ category: 'all' }}
            className="no-underline"
          >
            <Card className="gradient-card shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="size-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="size-8 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Species Index
                </h2>
                <p className="text-muted-foreground mb-6">
                  Explore our comprehensive database of documented species found
                  within the research station property.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full cursor-pointer"
                >
                  Browse Species
                </Button>
              </CardContent>
            </Card>
          </Link>

          Variant 1: third action card — uncomment this AND change md:grid-cols-2 to md:grid-cols-3 on this section:
          <WeatherActionCard />
        </section>
      </main>
      */}

      <main id="home-main">
        <DocumentedWildlife />
        {/* Stats band spans the full viewport width */}
        <StatsCounter />
      </main>

      <div className="mx-auto px-4 container">
        <GazetteerRolodex />
      </div>

      <WeatherMiniDashboard />
    </div>
  )
}
