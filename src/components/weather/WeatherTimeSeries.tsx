import { useMemo, useState } from 'react'
import WeatherChartCard from './WeatherChartCard'
import WeatherTimeSeriesPanel from './WeatherTimeSeriesPanel'
import type { WeatherDailyRow } from '@/types/weather'
import { WEATHER_COLORS } from '@/lib/weatherColors'
import { isMonsoonMonth } from '@/lib/weatherUtils'

interface WeatherTimeSeriesProps {
  data: Array<WeatherDailyRow> | undefined
  isLoading: boolean
}

export default function WeatherTimeSeries({
  data,
  isLoading,
}: WeatherTimeSeriesProps) {
  const [brushIndex, setBrushIndex] = useState<[number, number] | null>(null)

  const chartData = useMemo(() => {
    if (!data) return []
    return data.map((row) => ({
      date: row.date_local,
      tempRange:
        row.temp_min != null && row.temp_max != null
          ? [row.temp_min, row.temp_max]
          : null,
      tempAvg: row.temp_avg,
      dewpoint: row.dewpt_avg,
      humidity: row.rh_avg,
      precip: row.rain_total,
      wind: row.wind_avg,
      gustMax: row.gust_max,
      pressure: row.pressure_avg,
    }))
  }, [data])

  const monsoonRanges = useMemo(() => {
    if (!data) return []
    const ranges: Array<{ start: string; end: string }> = []
    let currentStart: string | null = null

    for (const row of data) {
      const inMonsoon = isMonsoonMonth(row.month)
      if (inMonsoon && !currentStart) {
        currentStart = row.date_local
      } else if (!inMonsoon && currentStart) {
        ranges.push({
          start: currentStart,
          end: data[data.indexOf(row) - 1]?.date_local || currentStart,
        })
        currentStart = null
      }
    }
    if (currentStart) {
      ranges.push({ start: currentStart, end: data[data.length - 1].date_local })
    }
    return ranges
  }, [data])

  const tickInterval =
    chartData.length > 365
      ? Math.floor(chartData.length / 12)
      : Math.floor(chartData.length / 6)

  const handleBrushChange = (start: number, end: number) => {
    setBrushIndex([start, end])
  }

  return (
    <WeatherChartCard
      title="Time Series"
      badge="Daily"
      subtitle="Vertically aligned panels share the same date axis. Teal bands indicate monsoon season (Jul–Sep). Use the brush slider at the bottom to zoom."
      isLoading={isLoading}
      minHeight={850}
    >
      <div className="space-y-6">
        {/* Panel 1: Temperature + Dew Point (°C) */}
        <WeatherTimeSeriesPanel
          data={chartData}
          height={200}
          yAxisLabel="°C"
          showXAxis={false}
          showBrush={false}
          brushIndex={brushIndex}
          onBrushChange={handleBrushChange}
          monsoonRanges={monsoonRanges}
          tickInterval={tickInterval}
          series={[
            {
              dataKey: 'tempRange',
              type: 'area',
              color: WEATHER_COLORS.temp,
              fill: WEATHER_COLORS.temp,
              fillOpacity: 0.15,
              strokeWidth: 0,
              name: 'Daily Range (°C)',
            },
            {
              dataKey: 'tempAvg',
              type: 'line',
              color: WEATHER_COLORS.temp,
              strokeWidth: 1.5,
              name: 'Temp Avg (°C)',
            },
            {
              dataKey: 'dewpoint',
              type: 'line',
              color: WEATHER_COLORS.dewpoint,
              strokeWidth: 1.5,
              name: 'Dew Point (°C)',
            },
          ]}
        />

        {/* Panel 2: Humidity + Precipitation (% / mm) */}
        <WeatherTimeSeriesPanel
          data={chartData}
          height={200}
          yAxisLabel="%"
          rightYAxisLabel="mm"
          showXAxis={false}
          showBrush={false}
          brushIndex={brushIndex}
          onBrushChange={handleBrushChange}
          monsoonRanges={monsoonRanges}
          tickInterval={tickInterval}
          series={[
            {
              dataKey: 'humidity',
              type: 'line',
              color: WEATHER_COLORS.humidity,
              strokeWidth: 1.5,
              name: 'Humidity (%)',
            },
            {
              dataKey: 'precip',
              type: 'bar',
              color: WEATHER_COLORS.precip,
              fillOpacity: 0.7,
              barSize: 3,
              name: 'Rain (mm)',
              yAxisId: 'right',
            },
          ]}
        />

        {/* Panel 3: Wind Speed + Gust Speed (km/hr) */}
        <WeatherTimeSeriesPanel
          data={chartData}
          height={200}
          yAxisLabel="km/hr"
          showXAxis={false}
          showBrush={false}
          brushIndex={brushIndex}
          onBrushChange={handleBrushChange}
          monsoonRanges={monsoonRanges}
          tickInterval={tickInterval}
          series={[
            {
              dataKey: 'wind',
              type: 'line',
              color: WEATHER_COLORS.wind,
              strokeWidth: 1.5,
              name: 'Wind Avg (km/hr)',
            },
            {
              dataKey: 'gustMax',
              type: 'line',
              color: WEATHER_COLORS.gust,
              strokeWidth: 1,
              strokeDasharray: '4 2',
              name: 'Gust Max (km/hr)',
            },
          ]}
        />

        {/* Panel 4: Pressure (mm Hg) — with x-axis labels and brush */}
        <WeatherTimeSeriesPanel
          data={chartData}
          height={200}
          yAxisLabel="mm Hg"
          showXAxis={true}
          showBrush={true}
          brushIndex={brushIndex}
          onBrushChange={handleBrushChange}
          monsoonRanges={monsoonRanges}
          tickInterval={tickInterval}
          series={[
            {
              dataKey: 'pressure',
              type: 'area',
              color: WEATHER_COLORS.pressure,
              fill: WEATHER_COLORS.pressure,
              fillOpacity: 0.1,
              strokeWidth: 1.5,
              name: 'Pressure (mm Hg)',
            },
          ]}
        />
      </div>
    </WeatherChartCard>
  )
}
