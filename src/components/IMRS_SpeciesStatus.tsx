// Reskin of the Species Status section (Figma 80:2802): collapsible
// conservation-assessment table. Always shows all 4 sources; a source with no
// rank shows "Not assessed" instead of being omitted.
import { useId, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import type { Species } from '@/types/species'
import type { ConservationRank, ConservationSource } from '@/lib/conservation'
import { SOURCE_LABELS, getConservationRanks } from '@/lib/conservation'
import { ConservationBadge } from '@/components/ConservationBadge'

const SOURCE_ORDER: Array<ConservationSource> = [
  'iucn',
  'natureserve-global',
  'natureserve-tx',
  'texas-sgcn',
]

const NATURESERVE_SOURCES = new Set<ConservationSource>([
  'natureserve-global',
  'natureserve-tx',
])

const INTRO_SOURCES = [
  'NatureServe Explorer',
  'IUCN Red List',
  'Texas Parks & Wildlife — Species of Greatest Conservation Need (SGCN)',
]

export const IMRS_SpeciesStatus = ({ species }: { species: Species }) => {
  const ranks = getConservationRanks(species)
  const [expanded, setExpanded] = useState(true)
  const shouldReduceMotion = useReducedMotion()
  const panelId = useId()

  if (ranks.length === 0) return null

  const bySource = new Map<ConservationSource, ConservationRank>(
    ranks.map((rank) => [rank.source, rank]),
  )

  const natureServeUrl = species.natureserve_id
    ? `https://explorer.natureserve.org/Taxon/${species.natureserve_id}`
    : null

  return (
    <section>
      <h2 className="font-brand-sans text-[clamp(1.75rem,1.1rem+2.5vw,3.5rem)] tracking-[0.04em]">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 text-left focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span>
            Species <span className="text-brand-green">Status</span>
          </span>
          <m.span
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="shrink-0"
            aria-hidden="true"
          >
            <ChevronUp className="size-7" />
          </m.span>
        </button>
      </h2>

      <div
        id={panelId}
        hidden={!expanded}
        className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[519fr_643fr] md:gap-12"
      >
        <div className="font-brand-sans text-base leading-[1.55] tracking-[0.04em] md:text-xl">
          <p>Conservation assessments from the following sources:</p>
          <ul className="mt-4 flex flex-col gap-2">
            {INTRO_SOURCES.map((label) => (
              <li key={label} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.65em] size-2 shrink-0 rounded-full bg-brand-green-light"
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <table className="w-full self-start bg-brand-light">
          <caption className="sr-only">Conservation status by source</caption>
          <tbody className="divide-y divide-brand-sand">
            {SOURCE_ORDER.map((source) => {
              const rank = bySource.get(source)
              const label = SOURCE_LABELS[source]
              const showLink = NATURESERVE_SOURCES.has(source) && natureServeUrl

              return (
                <tr key={source}>
                  <th
                    scope="row"
                    className="py-4 pl-4 text-left font-brand-sans text-base font-normal tracking-[0.04em] sm:pl-6"
                  >
                    {showLink ? (
                      <a
                        href={natureServeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-brand-gray underline-offset-2 hover:text-brand-green"
                      >
                        {label}
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    ) : (
                      label
                    )}
                  </th>
                  <td className="py-4 pr-4 text-right sm:pr-6">
                    {rank ? (
                      <ConservationBadge rank={rank} variant="full" />
                    ) : (
                      <span className="font-brand-mono text-xs text-brand-gray">
                        Not assessed
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
