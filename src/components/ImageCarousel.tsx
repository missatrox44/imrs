// import useEffect from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { CAROUSEL_IMAGES } from '@/data/constants'

export const ImageCarousel = () => {
  //   const controls = useAnimation()

  // useEffect(() => {
  //   controls.start({
  //     x: ['0%', '-50%'],
  //     transition: {
  //       ease: 'linear',
  //       duration: 45,
  //       repeat: Infinity,
  //     },
  //   })
  // }, [])

  return (
    <motion.section
      className="
        mt-20
        relative
        w-screen
        left-1/2
        right-1/2
        -mx-[50vw]
        overflow-hidden
      "
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <section className="overflow-hidden">
        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 90,
            repeat: Infinity,
            repeatType: 'loop',
          }}
          // whileHover={{ animationPlayState: 'paused' }}
        >
          {/* <motion.div
          className="flex gap-4 w-max"
          animate={controls}
          onHoverStart={() => controls.stop()}
          onHoverEnd={() =>
            controls.start({
              x: ['0%', '-50%'],
              transition: {
                ease: 'linear',
                duration: 45,
                repeat: Infinity,
              },
            })
          }
        > */}
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
        </motion.div>
      </section>
    </motion.section>
  )
}
