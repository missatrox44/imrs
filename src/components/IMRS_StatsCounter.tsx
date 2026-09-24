import { useEffect, useRef } from 'react'
import {
  m,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { STATS } from '@/data/constants'

const AnimatedCounter = ({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const spring = useSpring(0, { duration: shouldReduceMotion ? 0 : 3000 })
  const display = useTransform(
    spring,
    (current) => `${Math.floor(current).toLocaleString()}${suffix}`,
  )

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  // The finished value sizes the box so the label below never shifts
  // while the digits count up.
  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span aria-hidden="true" className="invisible">
        {value.toLocaleString()}
        {suffix}
      </span>
      <m.span className="absolute inset-0">{display}</m.span>
    </span>
  )
}

// Full-bleed band; the torn-paper
// edges come from the .torn-edges mask, the texture is shared with the footer.
export const IMRS_StatsCounter = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <m.section
      aria-label="Research station by the numbers"
      className="torn-edges relative z-10 mt-20 overflow-hidden bg-brand-green-dark px-4 py-20 text-center lg:py-[114px]"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
    >
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.22] mix-blend-multiply"
      />
      <div className="relative mx-auto grid max-w-md grid-cols-2 gap-x-6 gap-y-12 lg:max-w-none lg:grid-cols-4 lg:gap-x-8 xl:flex xl:justify-center xl:gap-[92px]">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-4 lg:gap-10"
          >
            <p className="font-brand-sans text-5xl leading-none text-brand-green-light lg:text-6xl xl:text-[72px]">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="max-w-[9em] font-brand-mono text-base leading-6 tracking-[0.04em] text-brand-cream lg:text-2xl lg:leading-[31px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </m.section>
  )
}
