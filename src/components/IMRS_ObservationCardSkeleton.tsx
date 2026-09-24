// Reskin of ObservationCardSkeleton; mirrors the card shell in
// IMRS_ObservationsFeed so the swap to loaded cards doesn't jump.
import { Skeleton } from '@/components/ui/skeleton'

const BAR_CLASS = 'rounded-md bg-brand-sand'

export function IMRS_ObservationCardSkeleton() {
  return (
    <div className="relative flex h-full flex-col gap-8 overflow-hidden rounded-lg bg-brand-light p-6 pt-8">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-2 bg-brand-sand"
      />

      {/* image */}
      <Skeleton className="h-[201px] w-full rounded-lg bg-brand-sand" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className={`h-7 w-3/4 lg:h-[31px] ${BAR_CLASS}`} />
          <Skeleton className={`h-5 w-1/2 ${BAR_CLASS}`} />
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2">
            <Skeleton className={`h-5 w-24 ${BAR_CLASS}`} />
            <Skeleton className={`h-5 w-28 ${BAR_CLASS}`} />
          </div>
          <Skeleton className={`h-5 w-2/3 ${BAR_CLASS}`} />
        </div>
      </div>

      <Skeleton className="mt-auto h-[26px] w-28 rounded-[14px] bg-brand-sand" />
    </div>
  )
}
