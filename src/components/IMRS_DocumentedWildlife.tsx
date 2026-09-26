import { Link } from '@tanstack/react-router'
import { IMRS_ImageCarousel as ImageCarousel } from './IMRS_ImageCarousel'

const CARDS = [
  {
    to: '/observations',
    search: undefined,
    img: '/imgs/wildlife-observations.webp',
    width: 375,
    height: 500,
    title: 'Recent Observations',
    body: 'Browse the latest wildlife and plant observations from researchers and visitors on IMRS.',
    cta: 'View Observations',
  },
  {
    to: '/species',
    search: { category: 'all' },
    img: '/imgs/wildlife-species.webp',
    width: 500,
    height: 309,
    title: 'Species Index',
    body: 'Explore our comprehensive database of documented species found within the research station property.',
    cta: 'Browse Species',
  },
] as const

export const IMRS_DocumentedWildlife = () => {
  return (
    <section
      aria-labelledby="documented-wildlife-heading"
      className="relative overflow-hidden rounded-t-4xl bg-brand-paper py-16 md:py-22 lg:rounded-t-[64px] lg:py-[120px]"
    >
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
      />

      <div className="relative mx-auto flex max-w-[1044px] flex-col items-center gap-10 px-4">
        <h2
          id="documented-wildlife-heading"
          className="text-center font-brand-sans type-section-title tracking-[0.04em] text-brand-ink"
        >
          Documented <span className="text-brand-green">Wildlife</span>
        </h2>

        <div className="grid w-full gap-6 md:grid-cols-2 lg:gap-[25px]">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              search={card.search}
              className="group flex flex-col gap-10 rounded-lg bg-brand-light p-5 no-underline md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <img
                src={card.img}
                alt=""
                width={card.width}
                height={card.height}
                className="h-[201px] w-full rounded-lg object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="flex flex-col gap-6 lg:max-w-[408px]">
                <div className="flex flex-col gap-4 font-brand-sans text-brand-ink">
                  <h3 className="type-card-title tracking-[0.04em]">
                    {card.title}
                  </h3>
                  <p className="type-lead tracking-[0.04em]">{card.body}</p>
                </div>
                <span className="self-start rounded-pill border-[0.5px] border-brand-ink bg-brand-green px-6 py-3 font-brand-mono text-base leading-[31px] text-brand-cream transition-colors group-hover:bg-brand-green-dark">
                  {card.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative lg:pt-10">
        <ImageCarousel />
      </div>
    </section>
  )
}
