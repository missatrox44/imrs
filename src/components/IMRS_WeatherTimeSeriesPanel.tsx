// Axis, legend and tooltip text use the brand sans face and ink color.
import { useMemo } from 'react'
import {
  Area,
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { WEATHER_COLORS } from '@/lib/weatherColors'

interface SeriesConfig {
  dataKey: string
  type: 'line' | 'area' | 'bar'
  color: string
  name: string
  yAxisId?: 'left' | 'right'
  strokeWidth?: number
  strokeDasharray?: string
  strokeOpacity?: number
  fillOpacity?: number
  baseValue?: number | 'dataMin' | 'dataMax'
  fill?: string
  barSize?: number
  legendType?: 'none' | 'line'
  dot?: boolean
  activeDot?: boolean
}

interface MonsoonRange {
  start: string
  end: string
}

interface Props {
  data: Array<Record<string, unknown>>
  series: Array<SeriesConfig>
  height: number
  yAxisLabel: string
  rightYAxisLabel?: string
  showXAxis: boolean
  showBrush: boolean
  brushIndex: [number, number] | null
  onBrushChange: (start: number, end: number) => void
  monsoonRanges: Array<MonsoonRange>
  tickInterval: number
  ariaLabel?: string
}

const FONT = 'var(--font-brand-sans)'
const INK = 'var(--color-brand-ink)'
const TICK = {
  fontSize: 12,
  fontFamily: FONT,
  fill: INK,
  letterSpacing: '0.04em',
}
const UNIT_CLASS =
  'font-brand-sans text-sm leading-6 tracking-[0.04em] text-brand-ink'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function formatTooltipDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-[4px] bg-brand-light p-3 font-brand-sans text-xs tracking-[0.04em] text-brand-ink shadow-[0_4px_22px_rgba(0,0,0,0.14)]">
      <p className="mb-1 font-medium">{formatTooltipDate(label)}</p>
      {payload.map((entry: any) => {
        if (Array.isArray(entry.value)) {
          const [low, high] = entry.value
          return (
            <div key={entry.dataKey} style={{ color: entry.color }}>
              <p>
                Daily Low (°C): {low != null ? Number(low).toFixed(1) : '—'}
              </p>
              <p>
                Daily High (°C): {high != null ? Number(high).toFixed(1) : '—'}
              </p>
            </div>
          )
        }
        return (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}:{' '}
            {entry.value != null ? Number(entry.value).toFixed(1) : '—'}
          </p>
        )
      })}
    </div>
  )
}

export const IMRS_WeatherTimeSeriesPanel = ({
  data,
  series,
  height,
  yAxisLabel,
  rightYAxisLabel,
  showXAxis,
  showBrush,
  brushIndex,
  onBrushChange,
  monsoonRanges,
  tickInterval,
  ariaLabel,
}: Props) => {
  const hasRightAxis = series.some((s) => s.yAxisId === 'right')

  // Brief screen-reader summary for the primary series.
  const srSummary = useMemo(() => {
    const primaryKey = series[0]?.dataKey
    if (!primaryKey || data.length === 0) return null
    const values = data
      .map((d) => {
        const v = d[primaryKey]
        return Array.isArray(v) ? (v[0] as number) : (v as number | null)
      })
      .filter((v): v is number => v != null)
    if (values.length === 0) return null
    const min = Math.min(...values).toFixed(1)
    const max = Math.max(...values).toFixed(1)
    const latest = values[values.length - 1].toFixed(1)
    return `${series[0].name}: min ${min}, max ${max}, latest ${latest} ${yAxisLabel}`
  }, [data, series, yAxisLabel])

  return (
    <div>
      <div className="mb-0.5 flex justify-between px-1">
        <span className={UNIT_CLASS}>{yAxisLabel}</span>
        {hasRightAxis && rightYAxisLabel && (
          <span className={UNIT_CLASS}>{rightYAxisLabel}</span>
        )}
      </div>
      {srSummary && (
        <p className="sr-only" aria-live="polite">
          {srSummary}
        </p>
      )}
      <div
        role="img"
        aria-label={ariaLabel}
        style={{ overflow: 'visible' }}
        className="[&_svg]:overflow-visible"
      >
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={data}
            margin={{ top: 4, right: 40, left: 10, bottom: 0 }}
            syncId="weather"
          >
            <CartesianGrid
              stroke={WEATHER_COLORS.gridLine}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={tickInterval}
              tick={showXAxis ? TICK : false}
              tickLine={false}
              axisLine={{ stroke: WEATHER_COLORS.gridLine }}
              height={showXAxis ? 30 : 5}
            />

            <YAxis
              yAxisId="left"
              tick={TICK}
              tickLine={false}
              axisLine={false}
              width={45}
            />

            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={TICK}
                tickLine={false}
                axisLine={false}
                width={45}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            {!showBrush && (
              <Legend
                wrapperStyle={{
                  fontSize: 14,
                  fontFamily: FONT,
                  letterSpacing: '0.04em',
                }}
                iconType="line"
                verticalAlign="bottom"
              />
            )}

            {monsoonRanges.map((range) => (
              <ReferenceArea
                key={range.start}
                x1={range.start}
                x2={range.end}
                yAxisId="left"
                fill={WEATHER_COLORS.monsoon}
                fillOpacity={0.08}
                strokeOpacity={0}
              />
            ))}

            {series.map((s) => {
              const yAxisId = s.yAxisId ?? 'left'

              if (s.type === 'area') {
                return (
                  <Area
                    key={s.dataKey}
                    yAxisId={yAxisId}
                    type="monotone"
                    dataKey={s.dataKey}
                    stroke={s.strokeWidth ? s.color : 'none'}
                    strokeWidth={s.strokeWidth ?? 0}
                    fill={s.fill ?? s.color}
                    fillOpacity={s.fillOpacity ?? 0.15}
                    baseValue={s.baseValue}
                    name={s.name}
                    dot={s.dot ?? false}
                    activeDot={s.activeDot ?? false}
                    legendType={s.legendType ?? 'line'}
                  />
                )
              }

              if (s.type === 'bar') {
                return (
                  <Bar
                    key={s.dataKey}
                    yAxisId={yAxisId}
                    dataKey={s.dataKey}
                    fill={s.color}
                    fillOpacity={s.fillOpacity ?? 0.6}
                    name={s.name}
                    barSize={s.barSize ?? 3}
                  />
                )
              }

              return (
                <Line
                  key={s.dataKey}
                  yAxisId={yAxisId}
                  type="monotone"
                  dataKey={s.dataKey}
                  stroke={s.color}
                  strokeWidth={s.strokeWidth ?? 1.5}
                  strokeDasharray={s.strokeDasharray}
                  strokeOpacity={s.strokeOpacity ?? 1}
                  dot={false}
                  name={s.name}
                />
              )
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {showBrush && (
        <>
          <div className="flex justify-center gap-6 py-1 font-brand-sans text-sm tracking-[0.04em]">
            {series.map((s) => (
              <div key={s.dataKey} className="flex items-center gap-1.5">
                <svg width="14" height="14" aria-hidden="true">
                  <line
                    x1="0"
                    y1="7"
                    x2="14"
                    y2="7"
                    stroke={s.color}
                    strokeWidth={2}
                  />
                </svg>
                <span style={{ color: s.color }}>{s.name}</span>
              </div>
            ))}
          </div>
          <div
            style={{ overflow: 'visible' }}
            className="[&_svg]:overflow-visible [&_.recharts-brush-texts]:font-brand-sans"
          >
            <ResponsiveContainer width="100%" height={56}>
              <ComposedChart
                data={data}
                margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
                syncId="weather"
              >
                <Brush
                  dataKey="date"
                  height={36}
                  stroke={WEATHER_COLORS.gridLine}
                  fill="var(--color-brand-paper)"
                  tickFormatter={formatDate}
                  travellerWidth={8}
                  startIndex={brushIndex?.[0]}
                  endIndex={brushIndex?.[1]}
                  onChange={(range: any) => {
                    if (range?.startIndex != null && range?.endIndex != null) {
                      onBrushChange(range.startIndex, range.endIndex)
                    }
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center font-brand-sans text-sm leading-6 tracking-[0.04em] text-brand-ink">
            Drag the handles or slide the bar to zoom all panels
          </p>
        </>
      )}
    </div>
  )
}
