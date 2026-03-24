import { CloudRain, Droplets, Thermometer, Wind } from 'lucide-react'
import type { WeatherSummary } from '@/types/weather'
import { Card, CardContent } from '@/components/ui/card'
import { WEATHER_COLORS } from '@/lib/weatherColors'

interface SparklineProps {
  data: Array<number>
  color: string
  width?: number
  height?: number
}

function Sparkline({ data, color, width = 120, height = 32 }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface StatCardProps {
  label: string
  value: string
  unit: string
  icon: React.ReactNode
  sparkData: Array<number>
  color: string
  borderColor: string
}

function StatCard({
  label,
  value,
  unit,
  icon,
  sparkData,
  color,
  borderColor,
}: StatCardProps) {
  return (
    <Card className={`border-t-2`} style={{ borderTopColor: borderColor }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground ml-1">{unit}</span>
          </div>
          <Sparkline data={sparkData} color={color} />
        </div>
      </CardContent>
    </Card>
  )
}

interface WeatherStatCardsProps {
  summary: WeatherSummary | undefined
  isLoading: boolean
}

export default function WeatherStatCards({
  summary,
  isLoading,
}: WeatherStatCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-t-2 border-t-muted">
            <CardContent className="p-4">
              <div className="h-16 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Avg Daily High"
        value={summary.avgDailyHigh != null ? summary.avgDailyHigh.toFixed(1) : '—'}
        unit="°C"
        icon={<Thermometer className="w-4 h-4" />}
        sparkData={summary.sparklines.temp}
        color={WEATHER_COLORS.temp}
        borderColor={WEATHER_COLORS.temp}
      />
      <StatCard
        label="Total Precipitation"
        value={summary.totalPrecip != null ? summary.totalPrecip.toFixed(1) : '—'}
        unit="mm"
        icon={<CloudRain className="w-4 h-4" />}
        sparkData={summary.sparklines.precip}
        color={WEATHER_COLORS.precip}
        borderColor={WEATHER_COLORS.precip}
      />
      <StatCard
        label="Avg Humidity"
        value={summary.avgHumidity != null ? summary.avgHumidity.toFixed(1) : '—'}
        unit="%"
        icon={<Droplets className="w-4 h-4" />}
        sparkData={summary.sparklines.humidity}
        color={WEATHER_COLORS.humidity}
        borderColor={WEATHER_COLORS.humidity}
      />
      <StatCard
        label="Avg Wind Speed"
        value={summary.avgWindSpeed != null ? summary.avgWindSpeed.toFixed(1) : '—'}
        unit="km/hr"
        icon={<Wind className="w-4 h-4" />}
        sparkData={summary.sparklines.wind}
        color={WEATHER_COLORS.wind}
        borderColor={WEATHER_COLORS.wind}
      />
    </div>
  )
}
