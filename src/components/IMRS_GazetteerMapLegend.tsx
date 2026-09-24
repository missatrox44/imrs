// Swatch colors are the design values; the map layers in GazetteerMap render
// close hsl equivalents.
import { Star } from 'lucide-react'

const ITEM_CLASS = 'flex items-center gap-[7px]'

export const IMRS_GazetteerMapLegend = () => (
  <div
    className="flex flex-wrap items-center gap-x-6 gap-y-2 font-brand-sans text-base leading-6 tracking-[0.04em] text-brand-ink"
    role="group"
    aria-label="Map legend"
  >
    <span>Legend:</span>
    <span className={ITEM_CLASS}>
      <Star
        className="size-5 shrink-0 fill-category-arthropods stroke-brand-ink stroke-[1.5]"
        aria-hidden="true"
      />
      Featured location
    </span>
    <span className={ITEM_CLASS}>
      <span
        className="size-2.5 shrink-0 rounded-full bg-black"
        aria-hidden="true"
      />
      Location
    </span>
    <span className={ITEM_CLASS}>
      <span
        className="h-0.5 w-[18px] shrink-0 bg-[#2980bd]"
        aria-hidden="true"
      />
      Rio Grande
    </span>
    <span className={ITEM_CLASS}>
      <span
        className="w-[25px] shrink-0 border-t-2 border-dashed border-[#71d826]"
        aria-hidden="true"
      />
      Roads
    </span>
    <span className={ITEM_CLASS}>
      <span
        className="size-3 shrink-0 border-[1.5px] border-black bg-category-arthropods"
        aria-hidden="true"
      />
      Station boundary
    </span>
  </div>
)
