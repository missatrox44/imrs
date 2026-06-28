import type { ConservationRank, ConservationTier } from '@/lib/conservation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SOURCE_LABELS } from '@/lib/conservation'

// Fixed, theme-independent fills — dark mode is not wired in this project, so
// these are chosen to meet WCAG 2.1 AA contrast against their own background.
const TIER_CLASSES: Record<ConservationTier, string> = {
  critical: 'border-transparent bg-red-700 text-white',
  high: 'border-transparent bg-orange-600 text-white',
  moderate: 'border-transparent bg-amber-500 text-amber-950',
  secure: 'border-transparent bg-green-700 text-white',
  flag: 'border-transparent bg-teal-700 text-white',
  unknown: 'border-transparent bg-gray-400 text-gray-900',
}

interface ConservationBadgeProps {
  rank: ConservationRank
  /** `compact` (grid card) shows only the code; `full` (detail page) shows the code + label. */
  variant?: 'compact' | 'full'
  className?: string
}

export function ConservationBadge({
  rank,
  variant = 'full',
  className,
}: ConservationBadgeProps) {
  // Meaning is carried by text (code + label) and the accessible name, never by
  // color alone.
  const accessibleName = `${SOURCE_LABELS[rank.source]}: ${rank.label} (${rank.code})`

  return (
    <Badge
      className={cn(TIER_CLASSES[rank.tier], className)}
      title={accessibleName}
      aria-label={accessibleName}
    >
      {variant === 'compact' ? (
        rank.code
      ) : (
        <span className="flex items-baseline gap-1">
          <span className="font-bold">{rank.code}</span>
          <span className="font-normal">{rank.label}</span>
        </span>
      )}
    </Badge>
  )
}
