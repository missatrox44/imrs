// Reskin of Research & Publications (Figma 80:2802): collapsible publication cards, real data only.
import { useId, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ChevronUp, ExternalLink } from 'lucide-react'
import type { Publication } from '@/data/publications'
import {
  getPublicationsForSpecies,
  publicationTypeLabel,
} from '@/lib/publications'
import { cn } from '@/lib/utils'

const CARD_CLASS =
  'flex items-start justify-between gap-4 rounded-lg bg-brand-light px-4 py-4 text-brand-ink sm:px-6 sm:py-5 lg:px-8 lg:py-6'

const publicationMeta = (pub: Publication) =>
  `${pub.authors} · ${pub.year}${pub.venue ? ` · ${pub.venue}` : ''} · ${publicationTypeLabel(pub.type)}`

export const IMRS_SpeciesPublications = ({
  speciesId,
}: {
  speciesId: number
}) => {
  const publications = getPublicationsForSpecies(speciesId)
  const [isOpen, setIsOpen] = useState(true)
  const contentId = useId()
  const headingId = useId()
  const shouldReduceMotion = useReducedMotion()

  if (publications.length === 0) return null

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-brand-sans text-[28px] leading-[1.15] tracking-[0.04em] sm:text-4xl lg:text-[56px] lg:leading-[63px]"
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
        >
          <span>
            <span className="text-brand-green">Research</span> &amp;
            Publications
          </span>
          <ChevronUp
            aria-hidden="true"
            className={cn(
              'size-6 shrink-0 transition-transform lg:size-8',
              !isOpen && 'rotate-180',
            )}
          />
        </button>
      </h2>

      <p className="mt-2 max-w-[542px] font-brand-sans text-base leading-6 tracking-[0.04em] sm:text-xl sm:leading-[31px]">
        Theses, papers, and notes featuring this species.
      </p>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={contentId}
            key="content"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            className="overflow-hidden"
          >
            <ul className="mt-6 flex flex-col gap-4">
              {publications.map((pub) => (
                <li key={pub.id}>
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        CARD_CLASS,
                        'transition-colors hover:bg-brand-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper',
                      )}
                    >
                      <span className="flex min-w-0 flex-col gap-2 sm:gap-4">
                        <span className="font-brand-sans text-lg leading-[1.4] tracking-[0.04em] underline decoration-solid [text-underline-position:from-font] sm:text-xl sm:leading-[31px]">
                          {pub.title}
                          <span className="sr-only"> (opens in new tab)</span>
                        </span>
                        <span className="font-brand-sans text-sm leading-6 tracking-[0.04em] sm:text-base">
                          {publicationMeta(pub)}
                        </span>
                      </span>
                      <ExternalLink
                        aria-hidden="true"
                        className="size-5 shrink-0 sm:size-6"
                      />
                    </a>
                  ) : (
                    <div className={CARD_CLASS}>
                      <span className="flex min-w-0 flex-col gap-2 sm:gap-4">
                        <span className="font-brand-sans text-lg leading-[1.4] tracking-[0.04em] sm:text-xl sm:leading-[31px]">
                          {pub.title}
                        </span>
                        <span className="font-brand-sans text-sm leading-6 tracking-[0.04em] sm:text-base">
                          {publicationMeta(pub)}
                        </span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  )
}
