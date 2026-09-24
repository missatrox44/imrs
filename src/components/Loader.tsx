export const Loader = ({ dataTitle }: { dataTitle: string }) => {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div role="status" className="text-center">
            <div className="motion-safe:animate-spin rounded-full size-12 border-2 border-brand-green/20 border-t-brand-green mx-auto mb-4"></div>
            <p className="font-brand-mono text-base tracking-[0.04em] text-brand-ink">
              Loading {dataTitle}...
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
