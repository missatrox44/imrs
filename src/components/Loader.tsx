import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export const Loader = ({ dataTitle }: { dataTitle: string }) => {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <DotLottieReact
              src="/bees-flying.lottie"
              autoplay
              loop
              className="mx-auto mb-4 size-48"
              aria-label={`Loading ${dataTitle}`}
            />
            <p className="text-muted-foreground">Loading {dataTitle}...</p>
          </div>
        </div>
      </div>
    </section>
  )
}
