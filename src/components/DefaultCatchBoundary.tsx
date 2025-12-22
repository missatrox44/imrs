import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <main
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
          An Error Occurred
        </h1>

        <div className="text-muted-foreground leading-relaxed">
          <ErrorComponent error={error} />
        </div>

        <div className="flex gap-4 items-center flex-wrap pt-4">
          {/* Try Again */}
          <button
            onClick={() => router.invalidate()}
            className="
              inline-flex items-center gap-2
              px-4 py-2
              bg-primary text-primary-foreground
              border border-border
              font-medium tracking-wide
              shadow-card
              transition-colors
              hover:bg-primary-hover
              cursor-pointer
            "
          >
            Try Again
          </button>

          {/* Conditional Links */}
          {isRoot ? (
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
              Home
            </Link>
          ) : (
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
                cursor-pointer

              "
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
            >
              Go Back
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
