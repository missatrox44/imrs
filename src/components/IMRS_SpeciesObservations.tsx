// Torn-edge dark green band with a
// horizontal scroll-snap carousel of recent observation cards.
import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ImageOff,
  MapPin,
  User,
} from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

import type { DisplayObservation } from '@/types/observation'
import { formatDate } from '@/lib/formatDate'
import { getPhotoUrl } from '@/lib/getPhotoUrl'
import { cn } from '@/lib/utils'

const CARD_CLASS =
  'group relative flex w-[85vw] shrink-0 snap-start flex-col gap-6 rounded-lg bg-brand-light p-6 text-brand-ink transition-shadow duration-300 hover:shadow-[0_4px_22px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green-dark md:w-[320px] xl:w-[380px]'

const ObservationCard = ({
  observation,
}: {
  observation: DisplayObservation
}) => {
  const photoUrl = getPhotoUrl(observation.photos)
  const label =
    observation.species_guess ||
    observation.taxon?.preferred_common_name ||
    `observation #${observation.id}`

  return (
    <a
      data-carousel-card
      href={observation.uri || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={CARD_CLASS}
    >
      <span className="sr-only">{label} (opens in new tab)</span>

      <div className="relative h-56 w-full overflow-hidden rounded-lg md:h-64 xl:h-72">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={label}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center bg-brand-sand"
            aria-hidden="true"
          >
            <ImageOff className="size-10 text-brand-green-dark/40" />
          </div>
        )}

        {observation.atImrs && (
          <span
            className="absolute top-2 left-2 rounded-full bg-brand-green-dark/90 px-2 py-0.5 font-brand-mono text-[10px] tracking-[0.08em] text-brand-green-light"
            title="Observed at Indio Mountains Research Station"
            aria-label="Observed at Indio Mountains Research Station"
          >
            IMRS
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 font-brand-sans text-base tracking-[0.04em] text-brand-green-dark">
        <span className="flex items-center gap-2">
          <User className="size-4 shrink-0" aria-hidden="true" />
          {observation.user?.login || 'Anonymous'}
        </span>
        <span className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0" aria-hidden="true" />
          {formatDate(observation.observed_on_string)}
        </span>
        {observation.place_guess && (
          <span className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{observation.place_guess}</span>
          </span>
        )}
      </div>
    </a>
  )
}

export const IMRS_SpeciesObservations = ({
  observations,
  runsIntoFooter = false,
}: {
  observations: Array<DisplayObservation>
  runsIntoFooter?: boolean
}) => {
  const trackId = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [canScroll, setCanScroll] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const update = () => {
      const maxScroll = el.scrollWidth - el.clientWidth
      setCanScroll(maxScroll > 1)
      setAtStart(el.scrollLeft <= 1)
      setAtEnd(el.scrollLeft >= maxScroll - 1)
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [observations.length])

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return

    const cards = el.querySelectorAll<HTMLElement>('[data-carousel-card]')
    const amount =
      cards.length >= 2
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : el.clientWidth

    el.scrollBy({
      left: amount * direction,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    })
  }

  if (observations.length === 0) return null

  return (
    <section
      className={cn(
        'torn-edges relative -mt-6 overflow-hidden bg-brand-green-dark py-20 md:pt-24 lg:py-[120px]',
        // Run under the footer's rounded top (32px / 64px); bottom padding plus the footer's
        // top padding matches the band's top padding.
        runsIntoFooter && 'torn-top-only -mb-8 pb-16 lg:-mb-16 lg:pb-[88px]',
      )}
    >
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.22] mix-blend-multiply"
      />

      <div className="relative px-4 text-center text-brand-light sm:px-8 lg:px-16">
        <h2 className="font-brand-sans type-section-title tracking-[0.04em]">
          Recent <span className="text-brand-green-light">Observations</span>
        </h2>
        <p className="mt-4 font-brand-mono text-base tracking-[0.04em] md:text-lg lg:text-xl">
          Sourced from iNaturalist
        </p>
      </div>

      {/* Scrollable carousel region: tabIndex + onKeyDown are intentional so
          arrow keys can page the track, per WAI-ARIA carousel pattern. */}
      {/* eslint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */}
      <div
        id={trackId}
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Recent observations"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            scrollByCard(1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            scrollByCard(-1)
          }
        }}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pl-4 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-light scroll-pl-4 sm:pl-8 sm:scroll-pl-8 lg:mt-16 lg:pl-16 lg:scroll-pl-16 [&::-webkit-scrollbar]:hidden"
      >
        {observations.map((observation) => (
          <ObservationCard key={observation.id} observation={observation} />
        ))}
        <div aria-hidden="true" className="w-px shrink-0" />
      </div>
      {/* eslint-enable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */}

      {canScroll && (
        <div className="relative mt-8 flex gap-3 px-4 sm:px-8 lg:px-16">
          <button
            type="button"
            aria-label="Previous observations"
            aria-controls={trackId}
            disabled={atStart}
            onClick={() => scrollByCard(-1)}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-brand-light text-brand-light transition-colors hover:bg-brand-light hover:text-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green-dark disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-light"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next observations"
            aria-controls={trackId}
            disabled={atEnd}
            onClick={() => scrollByCard(1)}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-brand-light text-brand-light transition-colors hover:bg-brand-light hover:text-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green-dark disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-light"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}
