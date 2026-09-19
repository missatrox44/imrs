import { m, useReducedMotion } from 'framer-motion'
import { CAROUSEL_IMAGES } from '@/data/constants'

// Figma "IMRS Website Design" node 80:1026: 356x368 tiles, 8px radius, 33px gap.
export const IMRS_ImageCarousel = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <m.section
      className="mt-20 overflow-hidden"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
    >
      <m.div
        className="flex w-max gap-5 md:gap-[33px]"
        animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
        transition={
          shouldReduceMotion
            ? {}
            : {
                ease: 'linear',
                duration: 90,
                repeat: Infinity,
                repeatType: 'loop',
              }
        }
      >
        {[
          ...CAROUSEL_IMAGES.map((image) => ({ image, copy: 'a' as const })),
          ...CAROUSEL_IMAGES.map((image) => ({ image, copy: 'b' as const })),
        ].map(({ image, copy }) => (
          <div
            key={`${copy}-${image.src}`}
            className="h-64 w-60 shrink-0 overflow-hidden rounded-lg md:h-[368px] md:w-[356px]"
            aria-hidden={copy === 'b' ? 'true' : undefined}
          >
            <img
              src={image.src}
              alt={image.alt}
              width={356}
              height={368}
              className="size-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </m.div>
    </m.section>
  )
}
