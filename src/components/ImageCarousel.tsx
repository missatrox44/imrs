import { m, useReducedMotion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { CAROUSEL_IMAGES } from '@/data/constants'

export const ImageCarousel = () => {
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
        className="flex gap-4 w-max"
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
            className="shrink-0 w-48 md:w-56"
            aria-hidden={copy === 'b' ? 'true' : undefined}
          >
            <Card className="border-0 overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  width={224}
                  height={192}
                  className="w-full h-40 md:h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </m.div>
    </m.section>
  )
}
