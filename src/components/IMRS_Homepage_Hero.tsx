// Tucks under IMRS_Header (negative top margin) so the grid runs behind the nav.
// Collage geometry is in cqw against the 1440-wide frame; the section is a 16:9 container from @3xl up.
// Below @3xl (no Figma source) the collage mirrors: cutouts flank a band above the H1, polaroids share the bottom row with captions above them.
// Beetle rotation differs from the Figma export (113.18deg) because the raw fill is stored in a different orientation.

const POLAROID =
  'absolute aspect-[190/123] w-[clamp(190px,30cqw,240px)] rounded-[1px] border-[5px] border-brand-light bg-brand-light shadow-[0_4px_4px_rgba(0,0,0,0.25)] @3xl:bottom-auto @3xl:-translate-x-1/2 @3xl:-translate-y-1/2 @3xl:border-[0.64cqw]'
const CUTOUT =
  'absolute [filter:drop-shadow(0_3px_4px_rgba(0,0,0,0.35))] -translate-x-1/2 -translate-y-1/2'
// Tape sits inside its polaroid so it scales with it; the counter-rotation keeps it page-aligned.
const TAPE =
  'absolute -translate-x-1/2 -translate-y-1/2 object-cover drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
const CAPTION =
  'absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-brand-hand text-[clamp(1.25rem,1.87cqw,1.7rem)] leading-[1.12] text-[#575757] @3xl:bottom-auto'

export const IMRS_Homepage_Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="@container relative isolate -mt-[93px] -mb-8 overflow-hidden lg:-mt-[109px] lg:-mb-16"
    >
      {/* An element cannot query itself, so the 16:9 min-height lives one level below the @container. */}
      <div className="relative bg-brand-sand pb-[clamp(300px,42cqw,340px)] @3xl:min-h-[56.25cqw] @3xl:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.08)_1px,transparent_1px)] bg-[size:58px_58px]"
        />
        <img
          src="/footer-texture.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
        />

        <div className="relative z-10 mx-auto flex max-w-[890px] flex-col items-center gap-8 px-4 pt-[calc(93px+6.5rem)] text-center text-brand-ink @3xl:pt-[15.8cqw]">
          <h1
            id="hero-heading"
            className="font-brand-mono text-[clamp(2.25rem,5.56cqw,5rem)] leading-[1.0625] tracking-[-0.07em]"
          >
            IMRS Biodiversity{' '}
            <span className="block text-brand-green">Explorer</span>
          </h1>
          <p className="max-w-[542px] font-brand-sans text-[clamp(1rem,1.39cqw,1.25rem)] leading-[1.55] tracking-[0.04em] @3xl:max-w-[37.6cqw]">
            Explore the biodiversity of Indio Mountains Research Station (IMRS).
            Discover species and view recent observations from this unique
            desert ecosystem.
          </p>
        </div>

        {/* Decorative scrapbook collage. Hidden from AT: species names out of context add noise, not meaning. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className={`${POLAROID} bottom-12 -left-6 -rotate-[8.42deg] @3xl:top-[21.5cqw] @3xl:left-[6.4cqw] @3xl:aspect-auto @3xl:h-[16.9cqw] @3xl:w-[26.1cqw]`}
          >
            <img
              src="/imgs/hero-paperflower.webp"
              alt=""
              width={500}
              height={325}
              className="size-full object-cover"
            />
            <img
              src="/imgs/hero-tape-1.webp"
              alt=""
              width={480}
              height={279}
              className={`${TAPE} top-[-6%] left-[49%] w-[41%] rotate-[8.42deg]`}
            />
          </div>

          <div
            className={`${POLAROID} -right-6 bottom-12 rotate-[10.63deg] @3xl:top-[34.1cqw] @3xl:right-auto @3xl:left-[92.4cqw] @3xl:aspect-auto @3xl:h-[16.8cqw] @3xl:w-[25.9cqw]`}
          >
            <img
              src="/imgs/hero-mimosa.webp"
              alt=""
              width={800}
              height={520}
              className="size-full object-cover"
            />
            <img
              src="/imgs/hero-tape-2.webp"
              alt=""
              width={480}
              height={301}
              className={`${TAPE} top-[-4%] left-[44%] w-[48%] -rotate-[25deg]`}
            />
          </div>

          <img
            src="/imgs/hero-butterfly.webp"
            alt=""
            width={800}
            height={527}
            className={`${CUTOUT} top-[150px] left-[calc(100%-52px)] w-[116px] -rotate-[24.59deg] @3xl:top-[15.2cqw] @3xl:left-[93.8cqw] @3xl:w-[21.9cqw]`}
          />

          <img
            src="/imgs/hero-beetle.webp"
            alt=""
            width={500}
            height={446}
            className={`${CUTOUT} top-[156px] left-[44px] w-[104px] -scale-y-100 rotate-[75deg] @3xl:top-[37.2cqw] @3xl:left-[5.9cqw] @3xl:w-[18.1cqw]`}
          />

          <p
            className={`${CAPTION} bottom-[clamp(196px,26cqw,240px)] left-[clamp(104px,24cqw,190px)] -rotate-[7.79deg] @3xl:top-[31.9cqw] @3xl:left-[20.5cqw]`}
          >
            Woolly Paperflower
            <br />
            (Psilostrophe tagetina)
          </p>
          <p
            className={`${CAPTION} bottom-[clamp(196px,26cqw,240px)] left-[calc(100%-clamp(104px,24cqw,190px))] rotate-[10.72deg] @3xl:top-[43.2cqw] @3xl:left-[75.9cqw]`}
          >
            Sensitive Plants
            <br />
            (Genus Mimosa)
          </p>
        </div>
      </div>
    </section>
  )
}
