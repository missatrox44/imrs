import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WeatherChartCardProps {
  title: string
  badge?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  minHeight?: number
}

export default function WeatherChartCard({
  title,
  badge,
  subtitle,
  children,
  className,
  isLoading,
  minHeight = 300,
}: WeatherChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {badge && <Badge variant="outline">{badge}</Badge>}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="animate-pulse bg-muted rounded"
            style={{ minHeight }}
          />
        ) : (
          <div style={{ minHeight }}>{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
