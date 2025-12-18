import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ObservationCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* image */}
      <Skeleton className="aspect-square w-full" />

      <CardHeader className="pb-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>

      <CardContent className="space-y-3 mt-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>

        <Skeleton className="h-5 w-20 rounded-full" />
      </CardContent>
    </Card>
  )
}