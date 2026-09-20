import { useMemo, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { GAZETTEER_ROLODEX } from '@/data/gazetteer'
import { formatElevation } from '@/lib/formatElevation'
import { formatCoordinates } from '@/lib/formatCoordinates'

const arrowClass =
  'flex size-8 cursor-pointer items-center justify-center rounded-full border border-brand-ink text-brand-ink transition-colors hover:bg-brand-sand'

// Figma "IMRS Website Design" node 28:845. Full-bleed beige band; -my-20 slides it
// under the torn edges of the stats and weather sections so beige shows through
// the tears. Artwork offsets are Figma coordinates minus the 120px frame inset.
export const IMRS_GazetteerRolodex = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const entries = useMemo(
    () => GAZETTEER_ROLODEX.toSorted((a, b) => a.name.localeCompare(b.name)),
    [],
  )
  const count = entries.length
  const active = entries[activeIndex]

  const prevCard = () => setActiveIndex((i) => (i + count - 1) % count)
  const nextCard = () => setActiveIndex((i) => (i + 1) % count)

  return (
    <section
      aria-labelledby="explore-locations-heading"
      className="dot-grid relative z-0 -my-20 overflow-hidden bg-brand-sand pt-[136px] pb-[160px] lg:pt-[200px] lg:pb-[220px]"
    >
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
      />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Scrapbook artwork, Figma 28:895–28:904. Shown from xl so it clears the card column. */}
        <div className="hidden xl:contents">
          <img
            src="/imgs/gazetteer-flower.webp"
            alt=""
            width={500}
            height={488}
            className="pointer-events-none absolute -top-[204px] -left-[215px] h-[432px] w-[518px] rotate-[-14.25deg] object-cover object-top drop-shadow-[0_3px_2px_rgba(0,0,0,0.2)]"
            loading="lazy"
            decoding="async"
          />
          <p className="absolute top-[198px] left-[165px] -translate-x-1/2 rotate-[-8.96deg] text-center font-brand-hand text-[29.5px] leading-[34px] whitespace-nowrap text-[#575757]">
            Bicolor Fanmustard
            <br />
            (Nerisyrenia camporum)
          </p>

          <div className="pointer-events-none absolute top-[83px] -right-[178px] h-[265px] w-[408px] rotate-[7.28deg] overflow-hidden rounded-[1px] border-[10px] border-brand-light shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <img
              src="/imgs/gazetteer-lizard.webp"
              alt=""
              width={500}
              height={299}
              className="size-full -scale-x-100 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <img
            src="/imgs/tape-1.webp"
            alt=""
            width={182}
            height={105}
            className="pointer-events-none absolute top-[6px] right-[83px]"
            loading="lazy"
            decoding="async"
          />
          <p className="absolute top-[374px] right-[152px] translate-x-1/2 rotate-[-0.27deg] text-center font-brand-hand text-[29.5px] leading-[34px] whitespace-nowrap text-[#575757]">
            <a
              href="https://www.inaturalist.org/taxa/36076"
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit no-underline hover:underline"
            >
              Greater Earless Lizard
              <br />
              (Cophosaurus texanus)
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </p>

          <div className="pointer-events-none absolute top-[456px] -left-[179px] h-[265px] w-[408px] rotate-[-8.42deg] overflow-hidden rounded-[1px] border-[10px] border-brand-light shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <img
              src="/imgs/gazetteer-spider.webp"
              alt=""
              width={500}
              height={265}
              className="size-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <img
            src="/imgs/tape-2.webp"
            alt=""
            width={162}
            height={93}
            className="pointer-events-none absolute top-[381px] left-[84px]"
            loading="lazy"
            decoding="async"
          />
          <p className="absolute top-[738px] left-[77px] rotate-[-0.27deg] font-brand-hand text-[29.5px] leading-[34px] whitespace-nowrap text-[#575757]">
            Phidippus vexans
          </p>
        </div>

        <div className="relative mx-auto flex max-w-[742px] flex-col items-center gap-[38px] px-4">
          <div className="flex flex-col items-center gap-6 text-center font-brand-sans text-brand-ink">
            <h2
              id="explore-locations-heading"
              className="text-4xl tracking-[0.04em] lg:text-[56px] lg:leading-[63px]"
            >
              Explore <span className="text-brand-green">Locations</span>
            </h2>
            <p className="max-w-[354px] text-xl leading-[31px] tracking-[0.04em]">
              Discover the diverse locations on Indio Mountains Research
              Station.
            </p>
          </div>

          {/* Card stack: every card shares one grid cell so the height follows content. */}
          <div className="grid w-full pt-[14px] *:col-start-1 *:row-start-1">
            <AnimatePresence initial={false}>
              {entries.map((entry, index) => {
                const depth = Math.abs(index - activeIndex)
                if (depth > 2) return null
                const isActive = depth === 0
                // Back cards keep their paper shell; their contents stay hidden.
                const hide = isActive ? '' : 'invisible'

                return (
                  <m.div
                    key={entry.id}
                    inert={!isActive}
                    initial={{ opacity: 0, x: 15 * depth, y: -14 * depth }}
                    animate={{
                      x: 15 * depth,
                      y: -14 * depth,
                      opacity: isActive ? 1 : 0.6 - 0.3 * (depth - 1),
                      zIndex: 10 - depth,
                    }}
                    exit={{ opacity: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 300, damping: 30 }
                    }
                  >
                    <article className="h-full overflow-hidden rounded-2xl bg-brand-light shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                      <div className="flex h-[63px] items-center gap-2 bg-brand-cream px-6">
                        <span
                          aria-hidden="true"
                          className={`size-[9px] rounded-full bg-brand-ink ${hide}`}
                        />
                        <span
                          className={`font-brand-mono text-base leading-6 tracking-[0.04em] text-brand-ink ${hide}`}
                        >
                          {entry.name.charAt(0)}
                        </span>
                        <div className={`ml-auto flex gap-2 ${hide}`}>
                          <button
                            type="button"
                            onClick={prevCard}
                            aria-label="Previous location"
                            className={arrowClass}
                          >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={nextCard}
                            aria-label="Next location"
                            className={arrowClass}
                          >
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div
                        className={`grid gap-6 p-6 lg:grid-cols-[220px_1fr] lg:gap-12 lg:px-[49px] lg:py-[47px] ${hide}`}
                      >
                        {/* Placeholder: featured location image (no asset yet). */}
                        <div
                          aria-hidden="true"
                          className="aspect-square w-full max-w-[220px] rounded-[7px] bg-[#d9d9d9]"
                        />
                        <div className="flex flex-col gap-4 text-brand-ink lg:max-w-[422px]">
                          <h3 className="font-brand-sans text-2xl tracking-[0.04em] lg:text-[32px] lg:leading-[31px]">
                            {entry.name}
                          </h3>
                          <ul className="font-brand-mono text-base leading-6 tracking-[0.04em] text-brand-green-dark">
                            <li className="flex items-center gap-2">
                              <img
                                src="/icons/elevation.svg"
                                alt=""
                                width={13}
                                height={11}
                              />
                              {formatElevation(entry.elevationMeters)}
                            </li>
                            <li className="flex items-center gap-2">
                              <img
                                src="/icons/marker.svg"
                                alt=""
                                width={15}
                                height={15}
                              />
                              {formatCoordinates(
                                entry.latitude,
                                entry.longitude,
                              )}
                            </li>
                          </ul>
                          <p className="line-clamp-4 max-w-[359px] font-brand-sans text-lg leading-[31px] tracking-[0.04em] lg:text-xl">
                            {entry.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  </m.div>
                )
              })}
            </AnimatePresence>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {active.name}, {activeIndex + 1} of {count}
          </p>

          <div className="flex items-center gap-[9px]">
            {entries.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to ${entry.name}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className="flex size-6 cursor-pointer items-center justify-center"
              >
                <span
                  className={`size-2.5 rounded-full transition-colors ${
                    index === activeIndex
                      ? 'bg-brand-green'
                      : 'border border-brand-green-dark/50 hover:bg-brand-green-dark/20'
                  }`}
                />
              </button>
            ))}
          </div>

          <Link
            to="/gazetteer"
            className="rounded-pill bg-brand-green px-6 py-3 font-brand-mono text-base leading-[31px] text-brand-cream no-underline transition-colors hover:bg-brand-green-dark"
          >
            View All Locations
          </Link>
        </div>
      </div>
    </section>
  )
}
