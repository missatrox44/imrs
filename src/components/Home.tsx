import { IMRS_StatsCounter as StatsCounter } from './IMRS_StatsCounter'
import { IMRS_GazetteerRolodex as GazetteerRolodex } from './IMRS_GazetteerRolodex'
import { IMRS_WeatherMiniDashboard as WeatherMiniDashboard } from './IMRS_WeatherMiniDashboard'
import { IMRS_DocumentedWildlife as DocumentedWildlife } from './IMRS_DocumentedWildlife'
import { IMRS_Homepage_Hero as HomepageHero } from './IMRS_Homepage_Hero'

export const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <main id="home-main">
        <HomepageHero />
        <DocumentedWildlife />
        {/* Stats band spans the full viewport width */}
        <StatsCounter />
      </main>

      <GazetteerRolodex />

      <WeatherMiniDashboard />
    </div>
  )
}
