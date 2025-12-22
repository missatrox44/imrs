import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { CAROUSEL_IMAGES } from '@/data/constants'

export const ImageCarousel = () => {

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
          {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((image, index) => (
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
