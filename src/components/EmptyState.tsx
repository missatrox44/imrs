import { Leaf } from 'lucide-react'

const EmptyState = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-[20px] bg-brand-light px-6 py-12 text-center shadow-[0px_4px_10px_rgba(0,0,0,0.13)] space-y-4 font-brand-sans tracking-[0.04em] text-brand-ink">
        <div className="flex justify-center">
          <Leaf className="size-10 text-brand-green" aria-hidden="true" />
        </div>

        <h2 className="text-[32px] leading-[31px]">No observations yet</h2>

        <p className="text-base leading-[1.55]">
          We couldn’t find any recent biodiversity observations for this area.
          Check back soon as new data is added.
        </p>
      </div>
    </section>
  )
}

export default EmptyState
