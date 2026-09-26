// Species Detail hero: back link, specimen card and taxonomy column.
import {
  ArrowLeft,
  Bird,
  Bug,
  ChevronRight,
  Droplets,
  Fish,
  Leaf,
  PawPrint,
  Shell,
  Snail,
  Sprout,
  Turtle,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { Species } from '@/types/species'
import type { DisplayObservation } from '@/types/observation'
import { getPhotoUrl } from '@/lib/getPhotoUrl'
import { cn } from '@/lib/utils'
import { IMRS_ScientificName } from '@/components/IMRS_ScientificName'

// Static so Tailwind v4 emits the full class strings (see IMRS_ObservationsFeed's GROUP_BAR_CLASS).
const CATEGORY_BAR_CLASS: Record<string, string> = {
  mammals: 'bg-category-mammals',
  birds: 'bg-category-birds',
  reptiles: 'bg-category-reptiles',
  amphibians: 'bg-category-amphibians',
  fish: 'bg-category-fish',
  fungi: 'bg-category-fungi',
  plants: 'bg-category-plants',
  inverts: 'bg-category-inverts',
  arthropods: 'bg-category-arthropods',
}

const CATEGORY_ICON: Record<string, LucideIcon> = {
  mammals: PawPrint,
  birds: Bird,
  reptiles: Turtle,
  amphibians: Droplets,
  fish: Fish,
  plants: Sprout,
  fungi: Shell,
  arthropods: Bug,
  inverts: Snail,
}

const LIGHT_TEXT_CATEGORIES = new Set(['fish', 'fungi', 'reptiles'])

interface TaxonomyRow {
  rank: string
  scientificName: string
  commonName: string | null
  level: number
}

function buildTaxonomyHierarchy(species: Species): Array<TaxonomyRow> {
  const rows: Array<TaxonomyRow> = []

  if (species.kingdom) {
    rows.push({
      rank: 'Kingdom',
      scientificName: species.kingdom,
      commonName: null,
      level: 0,
    })
  }
  if (species.phylum) {
    rows.push({
      rank: 'Phylum',
      scientificName: species.phylum,
      commonName: species.phylum_common_name ?? null,
      level: 1,
    })
  }
  if (species.sub_phylum) {
    rows.push({
      rank: 'Subphylum',
      scientificName: species.sub_phylum,
      commonName: species.sub_phylum_common_name ?? null,
      level: 2,
    })
  }
  if (species.class_name) {
    rows.push({
      rank: 'Class',
      scientificName: species.class_name,
      commonName: species.class_common_name ?? null,
      level: 2,
    })
  }
  if (species.sub_class) {
    rows.push({
      rank: 'Subclass',
      scientificName: species.sub_class,
      commonName: species.sub_class_common_name ?? null,
      level: 3,
    })
  }
  if (species.order_name) {
    rows.push({
      rank: 'Order',
      scientificName: species.order_name,
      commonName: species.order_common_name ?? null,
      level: 3,
    })
  }
  if (species.sub_order) {
    rows.push({
      rank: 'Suborder',
      scientificName: species.sub_order,
      commonName: species.sub_order_common_name ?? null,
      level: 4,
    })
  }
  if (species.family) {
    rows.push({
      rank: 'Family',
      scientificName: species.family,
      commonName: species.family_common_name ?? null,
      level: 4,
    })
  }
  if (species.sub_family) {
    rows.push({
      rank: 'Subfamily',
      scientificName: species.sub_family,
      commonName: species.sub_family_common_name ?? null,
      level: 5,
    })
  }
  if (species.genus) {
    rows.push({
      rank: 'Genus',
      scientificName: species.genus,
      commonName: null,
      level: 5,
    })
  }
  if (species.species) {
    rows.push({
      rank: 'Species',
      scientificName: species.species,
      commonName: null,
      level: 6,
    })
  }

  return rows
}

function capitalizeFirst(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1)
}

export function getSpeciesTitle(species: Species) {
  const scientificName = [species.genus, species.species]
    .filter(Boolean)
    .join(' ')

  if (species.species_common_name) {
    return {
      heading: species.species_common_name,
      headingIsScientific: false,
      subtitle: scientificName || null,
      subtitleIsScientific: Boolean(scientificName),
    }
  }
  if (scientificName) {
    return {
      heading: scientificName,
      headingIsScientific: true,
      subtitle: null,
      subtitleIsScientific: false,
    }
  }
  // Some rows are identified only to family or order; the DB stores those in caps.
  const lowestRank = buildTaxonomyHierarchy(species).at(-1)
  return {
    heading: 'Unidentified Specimen',
    headingIsScientific: false,
    subtitle: lowestRank
      ? `${capitalizeFirst(lowestRank.scientificName.toLowerCase())} (${lowestRank.rank.toLowerCase()})`
      : null,
    subtitleIsScientific: false,
  }
}

export const IMRS_SpeciesHero = ({
  species,
  observations,
}: {
  species: Species
  observations: Array<DisplayObservation>
}) => {
  const category = species.category?.toLowerCase()
  const barClass = category
    ? (CATEGORY_BAR_CLASS[category] ?? 'bg-brand-sand')
    : 'bg-brand-sand'
  const CategoryIcon = category ? (CATEGORY_ICON[category] ?? Leaf) : Leaf

  const scientificName = [species.genus, species.species]
    .filter(Boolean)
    .join(' ')
  const taxonomyRows = buildTaxonomyHierarchy(species)
  const title = getSpeciesTitle(species)

  const observationWithPhoto = observations.find(
    (observation) => getPhotoUrl(observation.photos) !== null,
  )
  const photoUrl = observationWithPhoto
    ? getPhotoUrl(observationWithPhoto.photos)
    : null
  const photoAlt =
    observationWithPhoto?.species_guess ||
    observationWithPhoto?.taxon?.preferred_common_name ||
    scientificName

  const notes = species.note?.trim()
  const records = species.records?.trim()
  const sources = species.collectors_field_numbers?.trim()

  return (
    <section
      aria-label="Species detail"
      // Pull up under the sticky header (93px / 109px) so the grid runs to the top.
      // overflow-x-clip: the polaroid bleeds past the card into the narrow tablet gutter.
      className="line-grid -mt-[93px] overflow-x-clip bg-brand-cream lg:-mt-[109px]"
    >
      <div className="mx-auto max-w-[1440px] px-4 pt-[133px] pb-16 sm:px-8 md:pb-22 lg:px-16 lg:pt-[173px] lg:pb-[120px]">
        <Link
          to="/species"
          search={{ category: 'all' }}
          className="mb-8 inline-flex items-center gap-2 font-brand-mono text-base text-brand-ink hover:underline"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          Back to Species Index
        </Link>

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between xl:gap-13">
          {/* Specimen card */}
          <div className="@container rounded-[20px] bg-brand-light shadow-[0px_4px_10px_rgba(0,0,0,0.13)] xl:w-[867px] xl:min-w-0">
            <div
              className={cn('h-[3rem] rounded-t-[20px]', barClass)}
              aria-hidden="true"
            />

            {/* At lg+ the 43.5cqw track is narrower than the 47cqw photo, so it bleeds into the wider page gutter. */}
            <div className="flex flex-col gap-8 p-6 sm:p-10 lg:p-12 @2xl:grid @2xl:grid-cols-[minmax(0,1fr)_44cqw] lg:@2xl:grid-cols-[minmax(0,1fr)_43.5cqw] @2xl:items-start @2xl:pr-0">
              <div className="order-1 mx-auto w-full max-w-[360px] rotate-[3deg] @2xl:order-2 @2xl:mx-0 @2xl:w-[44cqw] @2xl:max-w-none lg:@2xl:w-[47cqw] @2xl:rotate-[5deg]">
                <div className="relative rounded-[2px] border-[8px] border-brand-light bg-brand-light shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                  <div className="aspect-[366/258] overflow-hidden rounded-[1px] bg-brand-sand">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={photoAlt}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <CategoryIcon
                          className="size-16 text-brand-ink/20"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                  <img
                    src="/imgs/scotch-tape.webp"
                    alt=""
                    aria-hidden="true"
                    width={178}
                    height={73}
                    className="absolute top-0 left-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
                  />
                </div>
              </div>

              <div className="order-2 flex flex-col items-start gap-5 @2xl:order-1">
                <span
                  className={cn(
                    'rounded-full px-[10px] py-px font-brand-mono text-base tracking-[0.04em] capitalize',
                    barClass,
                    category && LIGHT_TEXT_CATEGORIES.has(category)
                      ? 'text-brand-light'
                      : 'text-brand-ink',
                  )}
                >
                  {species.category ? capitalizeFirst(species.category) : ''}
                </span>

                <h1 className="font-brand-mono text-[clamp(2.25rem,0.75rem+5.75cqw,4rem)] max-w-full leading-[1.0625] tracking-[-0.07em] break-words hyphens-auto text-brand-ink">
                  {title.headingIsScientific ? (
                    <IMRS_ScientificName name={title.heading} />
                  ) : (
                    title.heading
                  )}
                </h1>

                {title.subtitle && (
                  <p className="font-brand-sans type-card-title tracking-[0.04em] text-brand-ink">
                    {title.subtitleIsScientific ? (
                      <IMRS_ScientificName name={title.subtitle} />
                    ) : (
                      title.subtitle
                    )}
                  </p>
                )}

                {species.authorship && (
                  <p className="font-brand-mono text-base tracking-[0.04em] text-brand-green-dark">
                    Authorship: {species.authorship}
                  </p>
                )}

                {(notes || records || sources) && (
                  <>
                    <div
                      className={cn('h-px w-full', barClass)}
                      aria-hidden="true"
                    />

                    <div className="flex flex-col gap-4">
                      {notes && (
                        <div>
                          <h3 className="font-brand-sans text-lg uppercase tracking-[0.08em] text-brand-ink">
                            Notes
                          </h3>
                          <p className="mt-2 font-brand-sans text-base leading-6 tracking-[0.04em] text-brand-ink">
                            {capitalizeFirst(notes)}
                          </p>
                        </div>
                      )}

                      {records && (
                        <div>
                          <h3 className="font-brand-sans text-lg uppercase tracking-[0.08em] text-brand-ink">
                            Records
                          </h3>
                          <p className="mt-2 font-brand-sans text-base leading-6 tracking-[0.04em] text-brand-ink">
                            {capitalizeFirst(records)}
                          </p>
                        </div>
                      )}

                      {sources && (
                        <div>
                          <h3 className="font-brand-sans text-lg uppercase tracking-[0.08em] text-brand-ink">
                            Sources
                          </h3>
                          <p className="mt-2 font-brand-mono text-sm leading-6 tracking-[0.04em] text-brand-gray">
                            {sources}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Taxonomy column */}
          <div className="xl:w-[357px] xl:shrink-0">
            <h2 className="font-brand-sans text-base uppercase tracking-[0.08em] text-brand-ink">
              Taxonomic Classification
            </h2>
            <div className="mt-3 gap-x-8 md:columns-2 xl:columns-1">
              {taxonomyRows.map((row) => (
                <div key={row.rank} className="break-inside-avoid pt-3">
                  <div
                    className={cn('h-[2px] w-full', barClass)}
                    aria-hidden="true"
                  />
                  <div
                    className="flex flex-col gap-1 pt-2 pb-1"
                    style={{ paddingLeft: `${row.level * 0.75}rem` }}
                  >
                    <span className="flex items-center gap-1 font-brand-mono text-xs text-brand-gray">
                      <ChevronRight className="size-3" aria-hidden="true" />
                      {row.rank}
                    </span>
                    <span className="font-brand-mono text-sm tracking-[0.02em] text-brand-ink">
                      {row.rank === 'Genus' || row.rank === 'Species' ? (
                        <IMRS_ScientificName name={row.scientificName} />
                      ) : (
                        row.scientificName
                      )}
                      {row.commonName && (
                        <span className="text-brand-gray">
                          {' '}
                          ({row.commonName})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
