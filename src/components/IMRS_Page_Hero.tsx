// Hero shared by Observations, Species Index, Gazetteer and Weather.
// Tucks under IMRS_Header (negative top margin); geometry is in cqw against the 1440-wide frame, clamp() below @3xl.
import type { ReactNode } from 'react'

type Props = {
  image: string
  imageWidth: number
  imageHeight: number
  title: ReactNode
  subtitle: ReactNode
  headingId?: string
}

export const IMRS_Page_Hero = ({
  image,
  imageWidth,
  imageHeight,
  title,
  subtitle,
  headingId = 'page-hero-heading',
}: Props) => {
  return (
    <section
      aria-labelledby={headingId}
      className="@container relative isolate -mt-[93px] overflow-hidden lg:-mt-[109px]"
    >
      {/* An element cannot query itself, so the height lives one level below the @container. */}
      {/* Below lg (where the header grows) the text anchors to the bottom so short and two-line titles sit in the same visual band. */}
      <div className="relative flex min-h-[clamp(440px,42cqw,605px)] flex-col justify-end bg-brand-sand lg:justify-start">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          width={imageWidth}
          height={imageHeight}
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 size-full object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
        <img
          src="/footer-texture.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
        />

        <div className="relative z-10 flex flex-col items-start px-8 pt-[calc(93px+3.5rem)] pb-24 text-brand-light sm:pt-[calc(93px+4.5rem)] lg:px-[5.5cqw] lg:pt-[12.4cqw] lg:pb-[7cqw]">
          {/* Blur sits behind the text only. -m/p cancel so the text keeps its position; the mask feathers the blur out over the 64px padding so no panel edge shows. */}
          <div className="-m-16 flex w-fit flex-col gap-4 p-16 backdrop-blur-[7px] [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_4rem,black_calc(100%-4rem),transparent),linear-gradient(to_bottom,transparent,black_4rem,black_calc(100%-4rem),transparent)] sm:gap-5 lg:gap-6">
            <h1
              id={headingId}
              className="max-w-[712px] font-brand-mono text-[clamp(2.5rem,1rem+4.5cqw,5rem)] leading-[1.0625] tracking-[-0.07em]"
            >
              {title}
            </h1>
            <p className="max-w-[542px] font-brand-sans text-[clamp(1rem,0.75rem+0.6cqw,1.25rem)] leading-[1.55] tracking-[0.04em]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
