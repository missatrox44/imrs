// Fixed "Back to top" pill for long feeds. The parent decides visibility
// (e.g. once the filter row leaves the viewport) and where the click lands.
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

type Props = {
  visible: boolean
  onClick: () => void
}

export const IMRS_BackToTop = ({ visible, onClick }: Props) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          onClick={onClick}
          aria-label="Back to top"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed right-4 bottom-4 z-30 flex size-12 cursor-pointer items-center justify-center rounded-full bg-brand-green text-brand-light shadow-[0_4px_18px_rgba(0,0,0,0.18)] transition-colors hover:bg-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper focus-visible:outline-none sm:right-6 sm:bottom-6 sm:h-11 sm:w-auto sm:gap-2 sm:px-5"
        >
          <ArrowUp className="size-5 sm:size-4" aria-hidden="true" />
          <span className="hidden font-brand-mono text-base tracking-[0.04em] sm:inline">
            Back to top
          </span>
        </m.button>
      )}
    </AnimatePresence>
  )
}
