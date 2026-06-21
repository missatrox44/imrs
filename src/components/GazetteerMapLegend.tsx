import { Star } from 'lucide-react'

export const MapLegend = () => (
  <div
    className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
    role="group"
    aria-label="Map legend"
  >
    <span className="font-medium text-foreground">Legend:</span>
    <span className="flex items-center gap-1.5">
      <Star
        className="size-3.5 shrink-0"
        style={{ fill: 'hsl(42, 85%, 55%)', stroke: 'hsl(25, 20%, 15%)' }}
        aria-hidden="true"
      />
      Featured location
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="size-3 shrink-0 rounded-full"
        style={{
          background: 'hsl(25, 20%, 15%)',
          border: '2px solid hsl(42, 45%, 94%)',
        }}
        aria-hidden="true"
      />
      Location
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="h-0.5 w-5 shrink-0 rounded-full"
        style={{ background: 'hsl(205, 65%, 45%)' }}
        aria-hidden="true"
      />
      Rio Grande
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="w-5 shrink-0"
        style={{ borderTop: '2px dashed hsl(95, 70%, 50%)' }}
        aria-hidden="true"
      />
      Roads
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="size-3 shrink-0 rounded-[2px]"
        style={{
          border: '2px solid hsl(25, 20%, 15%)',
          background: 'hsl(35, 50%, 65%)',
        }}
        aria-hidden="true"
      />
      Station boundary
    </span>
  </div>
)
