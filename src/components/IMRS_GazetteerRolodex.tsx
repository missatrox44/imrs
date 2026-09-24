import { useMemo, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { GAZETTEER_ROLODEX } from '@/data/gazetteer'
import { formatElevation } from '@/lib/formatElevation'
import { formatCoordinates } from '@/lib/formatCoordinates'

// Collage geometry is in cqw against the 1440-wide Figma frame from @7xl up; the 5rem
// in each top offset is the -my-20 overlap hidden under the stats band's torn edge.
// Below @7xl (no Figma source) the collage regroups like the hero: flower + caption in a
// band above the heading, polaroids share the bottom row with captions above them.
const POLAROID =
  'absolute aspect-[407/265] w-[clamp(190px,30cqw,300px)] rounded-[1px] border-[5px] border-brand-light bg-brand-light shadow-[0_4px_4px_rgba(0,0,0,0.25)] @7xl:bottom-auto @7xl:w-[28.3cqw] @7xl:-translate-x-1/2 @7xl:-translate-y-1/2 @7xl:border-[0.69cqw]'
const CUTOUT =
  'absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_3px_2px_rgba(0,0,0,0.2)]'
// Tape sits inside its polaroid so it scales with it; the counter-rotation keeps it page-aligned.
const TAPE =
  'absolute -translate-x-1/2 -translate-y-1/2 object-cover drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
const CAPTION =
  'absolute -translate-x-1/2 -translate-y-1/2 text-center font-brand-hand text-[clamp(1.25rem,2.05cqw,1.85rem)] leading-[1.15] whitespace-nowrap text-[#575757] @7xl:bottom-auto'

const arrowClass =
  'flex size-8 cursor-pointer items-center justify-center rounded-full border border-brand-ink text-brand-ink transition-colors hover:bg-brand-sand'

// Full-bleed sand band; -my-20 slides it
// under the torn edges of the stats and weather sections so sand shows through.
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
      className="@container dot-grid relative z-0 -my-20 overflow-hidden bg-brand-sand"
    >
      {/* An element cannot query itself, so the cqw padding lives one level below the @container. */}
      <div className="relative pt-[320px] pb-[calc(5rem+clamp(300px,42cqw,380px))] @7xl:min-h-[calc(10rem+67.6cqw)] @7xl:pt-[calc(5rem+8.33cqw)] @7xl:pb-[calc(5rem+10.2cqw)]">
        <img
          src="/footer-texture.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
        />

        <div className="relative z-10 mx-auto flex max-w-[742px] flex-col items-center gap-[38px] px-4">
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
                        className={`grid gap-6 p-6 md:gap-12 md:px-[49px] md:py-[47px] ${hide}`}
                      >
                        {/* Placeholder: featured location image (no asset yet). Hidden until
                            the asset exists; to restore, also add back md:grid-cols-[220px_1fr]
                            above, md:max-w-[422px] on the text column and max-w-[359px] on the description. */}
                        {/* <div
                          aria-hidden="true"
                          className="aspect-square w-full max-w-[220px] rounded-[7px] bg-[#d9d9d9]"
                        /> */}
                        <div className="flex flex-col gap-4 text-brand-ink">
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
                          <p className="line-clamp-4 font-brand-sans text-lg leading-[31px] tracking-[0.04em] lg:text-xl">
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

        {/* Decorative scrapbook collage. Hidden from AT like the hero's. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <img
            src="/imgs/gazetteer-flower.webp"
            alt=""
            width={500}
            height={488}
            className={`${CUTOUT} top-[190px] left-[clamp(100px,24cqw,190px)] w-[clamp(180px,40cqw,320px)] -rotate-[14.25deg] @7xl:top-[calc(5rem+9.18cqw)] @7xl:left-[3.07cqw] @7xl:w-[35.97cqw]`}
          />
          <p
            className={`${CAPTION} top-[230px] left-[calc(clamp(100px,24cqw,190px)+clamp(120px,30cqw,230px))] -rotate-[8.96deg] @7xl:top-[calc(5rem+22.12cqw)] @7xl:left-[11.43cqw]`}
          >
            Bicolor Fanmustard
            <br />
            (Nerisyrenia camporum)
          </p>

          <div
            className={`${POLAROID} -right-6 bottom-12 rotate-[7.28deg] @7xl:top-[calc(5rem+23.27cqw)] @7xl:right-auto @7xl:left-[98.26cqw]`}
          >
            <img
              src="/imgs/gazetteer-lizard.webp"
              alt=""
              width={500}
              height={299}
              className="size-full -scale-x-100 object-cover"
            />
            <img
              src="/imgs/tape-1.webp"
              alt=""
              width={364}
              height={210}
              className={`${TAPE} top-[-1.6%] left-[9%] w-[45%] -rotate-[7.28deg]`}
            />
          </div>
          <p
            className={`${CAPTION} bottom-[clamp(210px,30cqw,300px)] left-[calc(100%-clamp(104px,24cqw,190px))] -rotate-[0.27deg] @7xl:top-[calc(5rem+36.7cqw)] @7xl:left-[89.44cqw]`}
          >
            Greater Earless Lizard
            <br />
            (Cophosaurus texanus)
          </p>

          <div
            className={`${POLAROID} bottom-12 -left-6 -rotate-[8.42deg] @7xl:top-[calc(5rem+49.22cqw)] @7xl:left-[1.74cqw]`}
          >
            <img
              src="/imgs/gazetteer-spider.webp"
              alt=""
              width={500}
              height={265}
              className="size-full object-cover"
            />
            <img
              src="/imgs/tape-2.webp"
              alt=""
              width={324}
              height={190}
              className={`${TAPE} top-[-2.5%] left-[90%] w-[40%] rotate-[8.42deg]`}
            />
          </div>
          <p
            className={`${CAPTION} bottom-[clamp(210px,30cqw,300px)] left-[clamp(104px,24cqw,190px)] -rotate-[0.27deg] @7xl:top-[calc(5rem+60.78cqw)] @7xl:left-[10.18cqw]`}
          >
            Phidippus vexans
          </p>
        </div>
      </div>
    </section>
  )
}
