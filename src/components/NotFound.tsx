import { Link } from '@tanstack/react-router'
import { ArrowLeft, Home } from 'lucide-react'

export function NotFound({ children }: { children?: any }) {
  return (
    <main
      className="
        w-full min-h-[80vh]
        flex items-center justify-center
        px-4
      "
    >
      <section
        className="
          max-w-2xl w-full
          rounded-[20px] bg-brand-light
          p-8 sm:p-10
          shadow-[0px_4px_10px_rgba(0,0,0,0.13)]
          space-y-6
          font-brand-sans tracking-[0.04em] text-brand-ink
        "
      >
        <h1 className="text-[32px] leading-[31px]">Page Not Found</h1>

        <p className="leading-[1.55]">
          {children || (
            <>
              The trail you were following doesn’t seem to lead anywhere.
              <br />
              Maybe this species hasn’t been documented yet.
            </>
          )}
        </p>

        <div className="flex items-center gap-4 flex-wrap pt-4">
          <button
            onClick={() => window.history.back()}
            className="
              inline-flex items-center gap-2
              rounded-pill border-[0.5px] border-brand-ink bg-brand-green
              px-6 py-3
              font-brand-mono text-base leading-[31px] text-brand-cream
              transition-colors
              hover:bg-brand-green-dark
              cursor-pointer
            "
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            to="/"
            className="
              inline-flex items-center gap-2
              rounded-pill border-2 border-brand-green
              px-6 py-3
              font-brand-mono text-base leading-[31px] text-brand-green
              no-underline
              transition-colors
              hover:bg-brand-green/10
            "
          >
            <Home size={16} />
            Return Home
          </Link>
        </div>
      </section>
    </main>
  )
}
