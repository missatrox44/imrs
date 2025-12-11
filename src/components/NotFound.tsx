import { Link } from '@tanstack/react-router'
import { ArrowLeft, Home } from 'lucide-react'

export function NotFound({ children }: { children?: any }) {
  return (
    <div
      className="
        w-full min-h-[80vh]
        flex items-center justify-center
        px-4
      "
    >
      <div
        className="
          max-w-2xl w-full
          bg-card text-card-foreground
          border border-border
          p-10
          shadow-card
          space-y-6
        "
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Page Not Found
        </h1>

        <p className="text-muted-foreground leading-relaxed">
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
              px-4 py-2
              bg-primary text-primary-foreground
              font-medium tracking-wide
              border border-border
              shadow-card
              transition-colors
              hover:bg-primary-hover
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
              px-4 py-2
              bg-secondary text-secondary-foreground
              border border-border
              font-medium tracking-wide
              shadow-card
              transition-colors
              hover:bg-accent
            "
          >
            <Home size={16} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
