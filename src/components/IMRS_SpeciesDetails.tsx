// Reskin of SpeciesDetails (Figma 80:1922). Each section hides itself when it
// has no data.
import { IMRS_SpeciesHero } from '@/components/IMRS_SpeciesHero'
import { IMRS_SpeciesObservations } from '@/components/IMRS_SpeciesObservations'
import { IMRS_SpeciesPublications } from '@/components/IMRS_SpeciesPublications'
import { IMRS_SpeciesStatus } from '@/components/IMRS_SpeciesStatus'
import { getConservationRanks } from '@/lib/conservation'
import { getPublicationsForSpecies } from '@/lib/publications'
import { Route } from '@/routes/species.$speciesId'

export const IMRS_SpeciesDetails = () => {
  const { species, observations } = Route.useLoaderData()
  const hasReferenceSections =
    getConservationRanks(species).length > 0 ||
    getPublicationsForSpecies(species.id).length > 0

  return (
    <main className="bg-brand-paper text-brand-ink">
      <IMRS_SpeciesHero species={species} observations={observations} />
      <IMRS_SpeciesObservations
        observations={observations}
        runsIntoFooter={!hasReferenceSections}
      />
      {/* Empty sections render nothing, so the divider only appears between two
          visible sections. */}
      <div className="bg-brand-cream px-4 py-16 empty:hidden sm:px-8 lg:px-16 lg:py-[120px] [&>section+section]:mt-14 [&>section+section]:border-t [&>section+section]:border-brand-gray [&>section+section]:pt-14">
        <IMRS_SpeciesStatus species={species} />
        <IMRS_SpeciesPublications speciesId={species.id} />
      </div>
    </main>
  )
}
