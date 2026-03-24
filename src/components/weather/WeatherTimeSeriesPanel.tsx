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

interface WeatherTimeSeriesPanelProps {
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
}

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
    <div className="bg-card border border-border p-3 text-xs shadow-md">
      <p className="font-medium mb-1">{formatTooltipDate(label)}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value != null ? Number(entry.value).toFixed(1) : '—'}
        </p>
      ))}
    </div>
  )
}

export default function WeatherTimeSeriesPanel({
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
}: WeatherTimeSeriesPanelProps) {
  const hasRightAxis = series.some((s) => s.yAxisId === 'right')

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 4, right: hasRightAxis ? 10 : 30, left: 0, bottom: 0 }}
        syncId="weather"
      >
        <CartesianGrid stroke={WEATHER_COLORS.gridLine} strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          interval={tickInterval}
          tick={showXAxis ? { fontSize: 11, fill: WEATHER_COLORS.text } : false}
          tickLine={false}
          axisLine={{ stroke: WEATHER_COLORS.gridLine }}
          height={showXAxis ? 30 : 5}
        />

        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: WEATHER_COLORS.text }}
          tickLine={false}
          axisLine={false}
          width={45}
          label={{
            value: yAxisLabel,
            position: 'insideTopLeft',
            offset: -5,
            style: { fontSize: 11, fill: WEATHER_COLORS.text },
          }}
        />

        {hasRightAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: WEATHER_COLORS.text }}
            tickLine={false}
            axisLine={false}
            width={45}
            label={{
              value: rightYAxisLabel ?? '',
              position: 'insideTopRight',
              offset: -5,
              style: { fontSize: 11, fill: WEATHER_COLORS.text },
            }}
          />
        )}

        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="line" />

        {monsoonRanges.map((range, i) => (
          <ReferenceArea
            key={i}
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

        {showBrush && (
          <Brush
            dataKey="date"
            height={30}
            stroke={WEATHER_COLORS.gridLine}
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
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
