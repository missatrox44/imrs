// White cards with a 3px top rule in the series color. Sparkline and colors
// are shared with the charts so the cards match them.
import { CloudRain, Droplets, Thermometer, Wind } from 'lucide-react'
import type { WeatherSummary } from '@/types/weather'
import { Sparkline } from '@/components/weather/Sparkline'
import { WEATHER_COLORS } from '@/lib/weatherColors'

const GRID_CLASS = 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'

interface StatCardProps {
  label: string
  value: number | null | undefined
  unit: string
  icon: React.ReactNode
  sparkData: Array<number>
  color: string
}

function StatCard({
  label,
  value,
  unit,
  icon,
  sparkData,
  color,
}: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-[7px] rounded-[3px] border-t-[3px] bg-brand-light px-6 py-4 text-brand-ink"
      style={{ borderTopColor: color }}
    >
      <div className="flex items-start justify-between gap-2">
        <dt className="font-brand-mono text-base leading-6 tracking-[0.04em]">
          {label}
        </dt>
        <span aria-hidden="true" className="text-brand-ink">
          {icon}
        </span>
      </div>
      <dd className="flex items-center gap-[15px] font-brand-mono text-2xl leading-[31px] tracking-[0.04em]">
        <span>
          {value != null ? value.toFixed(1) : '—'}
          {unit}
        </span>
        <Sparkline data={sparkData} color={color} width={97} height={26} />
      </dd>
    </div>
  )
}

interface Props {
  summary: WeatherSummary | undefined
  isLoading: boolean
}

export const IMRS_WeatherStatCards = ({ summary, isLoading }: Props) => {
  if (isLoading || !summary) {
    return (
      <div className={GRID_CLASS} aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[102px] animate-pulse rounded-[3px] border-t-[3px] border-brand-ink/10 bg-brand-light"
          />
        ))}
      </div>
    )
  }

  return (
    <dl className={GRID_CLASS}>
      <StatCard
        label="Avg. Daily High"
        value={summary.avgDailyHigh}
        unit="°C"
        icon={<Thermometer className="size-6" strokeWidth={1.5} />}
        sparkData={summary.sparklines.temp}
        color={WEATHER_COLORS.temp}
      />
      <StatCard
        label="Total Precipitation"
        value={summary.totalPrecip}
        unit=" mm"
        icon={<CloudRain className="size-6" strokeWidth={1.5} />}
        sparkData={summary.sparklines.precip}
        color={WEATHER_COLORS.precip}
      />
      <StatCard
        label="Avg. Humidity"
        value={summary.avgHumidity}
        unit="%"
        icon={<Droplets className="size-6" strokeWidth={1.5} />}
        sparkData={summary.sparklines.humidity}
        color={WEATHER_COLORS.humidity}
      />
      <StatCard
        label="Avg. Wind Speed"
        value={summary.avgWindSpeed}
        unit=" km/hr"
        icon={<Wind className="size-6" strokeWidth={1.5} />}
        sparkData={summary.sparklines.wind}
        color={WEATHER_COLORS.wind}
      />
    </dl>
  )
}
