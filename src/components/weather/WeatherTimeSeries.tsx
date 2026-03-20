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
import WeatherChartCard from './WeatherChartCard'
import type { WeatherDailyRow, WeatherVariable } from '@/types/weather'
import { WEATHER_COLORS } from '@/lib/weatherColors'
import { isMonsoonMonth } from '@/lib/weatherUtils'

interface WeatherTimeSeriesProps {
  data: Array<WeatherDailyRow> | undefined
  variable: WeatherVariable
  isLoading: boolean
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

export default function WeatherTimeSeries({
  data,
  variable,
  isLoading,
}: WeatherTimeSeriesProps) {
  const chartData = useMemo(() => {
    if (!data) return []
    return data.map((row) => ({
      date: row.date_local,
      tempMin: row.temp_min,
      tempMax: row.temp_max,
      tempAvg: row.temp_avg,
      humidity: row.rh_avg,
      precip: row.rain_total,
      wind: row.wind_avg,
      gustMax: row.gust_max,
      pressure: row.pressure_avg,
      dewpoint: row.dewpt_avg,
    }))
  }, [data])

  // Find monsoon period ranges for highlighting
  const monsoonRanges = useMemo(() => {
    if (!data) return []
    const ranges: Array<{ start: string; end: string }> = []
    let currentStart: string | null = null

    for (const row of data) {
      const inMonsoon = isMonsoonMonth(row.month)
      if (inMonsoon && !currentStart) {
        currentStart = row.date_local
      } else if (!inMonsoon && currentStart) {
        ranges.push({ start: currentStart, end: data[data.indexOf(row) - 1]?.date_local || currentStart })
        currentStart = null
      }
    }
    if (currentStart) {
      ranges.push({ start: currentStart, end: data[data.length - 1].date_local })
    }
    return ranges
  }, [data])

  const showTemp = variable === 'all' || variable === 'temp'
  const showHumidity = variable === 'all' || variable === 'humidity'
  const showPrecip = variable === 'all' || variable === 'precip'
  const showWind = variable === 'wind'
  const showPressure = variable === 'pressure'
  const showDewpoint = variable === 'dewpoint'

  // Determine tick interval based on data length
  const tickInterval = chartData.length > 365 ? Math.floor(chartData.length / 12) : Math.floor(chartData.length / 6)

  return (
    <WeatherChartCard
      title="Time Series"
      badge="Daily"
      subtitle="Temperature, humidity, and precipitation over time. Teal bands indicate monsoon season (Jul–Sep)."
      isLoading={isLoading}
      minHeight={400}
    >
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={WEATHER_COLORS.gridLine} strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval={tickInterval}
            tick={{ fontSize: 11, fill: WEATHER_COLORS.text }}
            tickLine={false}
          />

          {/* Left Y axis: Temperature / primary metric */}
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: WEATHER_COLORS.text }}
            tickLine={false}
            axisLine={false}
            label={{
              value: showTemp ? '°C' : showWind ? 'km/hr' : showPressure ? 'mm Hg' : showDewpoint ? '°C' : '°C',
              position: 'insideTopLeft',
              offset: -5,
              style: { fontSize: 11, fill: WEATHER_COLORS.text },
            }}
          />

          {/* Right Y axis: humidity / precipitation */}
          {(showHumidity || showPrecip) && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: WEATHER_COLORS.text }}
              tickLine={false}
              axisLine={false}
              label={{
                value: showHumidity ? '%' : 'mm',
                position: 'insideTopRight',
                offset: -5,
                style: { fontSize: 11, fill: WEATHER_COLORS.text },
              }}
            />
          )}

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="line"
          />

          {/* Monsoon season highlight bands */}
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

          {/* Temperature band (min to max) */}
          {showTemp && (
            <>
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="tempMax"
                stroke="none"
                fill={WEATHER_COLORS.tempBand}
                name="Temp Max"
                dot={false}
                activeDot={false}
                legendType="none"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="tempMin"
                stroke="none"
                fill="var(--background)"
                name="Temp Min"
                dot={false}
                activeDot={false}
                legendType="none"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tempAvg"
                stroke={WEATHER_COLORS.temp}
                strokeWidth={1.5}
                dot={false}
                name="Temp Avg (°C)"
              />
            </>
          )}

          {/* Humidity */}
          {showHumidity && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke={WEATHER_COLORS.humidity}
              strokeWidth={1}
              strokeOpacity={0.7}
              dot={false}
              name="Humidity (%)"
            />
          )}

          {/* Precipitation */}
          {showPrecip && (
            <Bar
              yAxisId={showHumidity ? 'right' : 'left'}
              dataKey="precip"
              fill={WEATHER_COLORS.precip}
              fillOpacity={0.6}
              name="Rain (mm)"
              barSize={2}
            />
          )}

          {/* Wind */}
          {showWind && (
            <>
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="wind"
                stroke={WEATHER_COLORS.wind}
                strokeWidth={1.5}
                dot={false}
                name="Wind Avg (km/hr)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="gustMax"
                stroke={WEATHER_COLORS.wind}
                strokeWidth={1}
                strokeDasharray="4 2"
                strokeOpacity={0.5}
                dot={false}
                name="Gust Max (km/hr)"
              />
            </>
          )}

          {/* Pressure */}
          {showPressure && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="pressure"
              stroke={WEATHER_COLORS.pressure}
              fill={WEATHER_COLORS.pressure}
              fillOpacity={0.1}
              strokeWidth={1.5}
              dot={false}
              name="Pressure (mm Hg)"
            />
          )}

          {/* Dew Point */}
          {showDewpoint && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="dewpoint"
              stroke={WEATHER_COLORS.dewpoint}
              strokeWidth={1.5}
              dot={false}
              name="Dew Point (°C)"
            />
          )}

          <Brush
            dataKey="date"
            height={30}
            stroke={WEATHER_COLORS.gridLine}
            tickFormatter={formatDate}
            travellerWidth={8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </WeatherChartCard>
  )
}
