import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export const ImageCarousel = () => {
  const autoScrollImages = [
    { src: 'https://picsum.photos/seed/auto1/600/400', alt: 'Desert flora' },
    { src: 'https://picsum.photos/seed/auto2/600/400', alt: 'Rocky outcrops' },
    { src: 'https://picsum.photos/seed/auto3/600/400', alt: 'Sunset vista' },
    { src: 'https://picsum.photos/seed/auto4/600/400', alt: 'Wildlife tracks' },
    {
      src: 'https://picsum.photos/seed/auto5/600/400',
      alt: 'Research equipment',
    },
    { src: 'https://picsum.photos/seed/auto6/600/400', alt: 'Canyon view' },
    { src: 'https://picsum.photos/seed/auto7/600/400', alt: 'Desert bloom' },
  ]

  return (
    <motion.section
      className="  
        mt-20
        relative
        w-screen
        left-1/2
        right-1/2
        -mx-[50vw]
        overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden">
        <div className="flex gap-4 animate-scroll">
          {[...autoScrollImages, ...autoScrollImages].map((image, index) => (
            <div key={index} className="shrink-0 w-48 md:w-56">
              <Card className="border-0 overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-40 md:h-48 object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
