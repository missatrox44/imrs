import { useState } from 'react'
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

// Replaces TanStack Router's default ErrorComponent, whose <pre> uses
// `overflow: auto` without wrapping and causes horizontal scroll on long
// error messages.
function WrappedError({ error }: { error: unknown }) {
  const [show, setShow] = useState(import.meta.env.DEV)
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div>
      <div className="flex items-center gap-2">
        <strong className="text-sm">Something went wrong!</strong>
        <button
          onClick={() => setShow((prev) => !prev)}
          className="
            rounded-pill border border-brand-green
            px-3 py-0.5 font-brand-mono text-xs text-brand-green
            transition-colors hover:bg-brand-green/10
            cursor-pointer
          "
        >
          {show ? 'Hide Error' : 'Show Error'}
        </button>
      </div>

      {show && message && (
        <pre
          className="
            mt-2 rounded-[4px] border border-destructive
            p-2 font-brand-mono text-destructive text-xs
            whitespace-pre-wrap break-words
          "
        >
          <code>{message}</code>
        </pre>
      )}
    </div>
  )
}

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
          rounded-[20px] bg-brand-light
          p-8 sm:p-10
          shadow-[0px_4px_10px_rgba(0,0,0,0.13)]
          space-y-6
          font-brand-sans tracking-[0.04em] text-brand-ink
        "
      >
        <h1 className="text-[32px] leading-[31px]">An Error Occurred</h1>

        <div className="leading-[1.55]">
          <WrappedError error={error} />
        </div>

        <div className="flex gap-4 items-center flex-wrap pt-4">
          <button
            onClick={() => router.invalidate()}
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
            Try Again
          </button>

          {isRoot ? (
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
              Home
            </Link>
          ) : (
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
