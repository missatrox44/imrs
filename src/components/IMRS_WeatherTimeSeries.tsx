// Monsoon bands and a throttled brush, wrapped in the reskin card.
import { Suspense, lazy, useMemo, useState } from 'react'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useThrottledCallback } from '@tanstack/react-pacer'
import type { WeatherDailyRow } from '@/types/weather'
import { WEATHER_COLORS } from '@/lib/weatherColors'
import { isMonsoonMonth } from '@/lib/weatherUtils'

const IMRS_WeatherTimeSeriesPanel = lazy(() =>
  import('@/components/IMRS_WeatherTimeSeriesPanel').then((m) => ({
    default: m.IMRS_WeatherTimeSeriesPanel,
  })),
)

const CHIP_CLASS =
  'rounded-pill border border-brand-ink px-[10px] py-px font-brand-mono text-xs leading-6 text-brand-ink'

interface Props {
  data: Array<WeatherDailyRow> | undefined
  isLoading: boolean
}

export const IMRS_WeatherTimeSeries = ({ data, isLoading }: Props) => {
  const [brushIndex, setBrushIndex] = useState<[number, number] | null>(null)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const panelHeight = isMobile ? 150 : 200
  const minHeight = panelHeight * 4 + 250

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

    for (const [i, row] of data.entries()) {
      const inMonsoon = isMonsoonMonth(row.month)
      if (inMonsoon && !currentStart) {
        currentStart = row.date_local
      } else if (!inMonsoon && currentStart) {
        ranges.push({
          start: currentStart,
          end: data[i - 1]?.date_local || currentStart,
        })
        currentStart = null
      }
    }
    if (currentStart) {
      ranges.push({
        start: currentStart,
        end: data[data.length - 1].date_local,
      })
    }
    return ranges
  }, [data])

  const tickInterval =
    chartData.length > 365
      ? Math.floor(chartData.length / 12)
      : Math.floor(chartData.length / 6)

  // Each brush update re-renders all four synced recharts panels, so cap the
  // drag to ~10 updates/s; trailing ensures the final position always lands.
  const handleBrushChange = useThrottledCallback(
    (start: number, end: number) => {
      setBrushIndex([start, end])
    },
    { wait: 100, leading: true, trailing: true },
  )

  const shared = {
    data: chartData,
    height: panelHeight,
    brushIndex,
    onBrushChange: handleBrushChange,
    monsoonRanges,
    tickInterval,
  }

  return (
    <section
      aria-labelledby="weather-time-series-heading"
      className="rounded-[8px] bg-brand-light p-6 text-brand-ink lg:p-10"
    >
      <div className="mb-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-5">
          <h2
            id="weather-time-series-heading"
            className="font-brand-sans type-section-title tracking-[0.04em]"
          >
            Time Series
          </h2>
          <span className={CHIP_CLASS}>Daily</span>
        </div>
        <p className="max-w-[1113px] font-brand-sans text-base leading-6 tracking-[0.04em]">
          Vertically aligned panels share the same date axis. Teal bands
          indicate monsoon season (Jul–Sep). Use the brush slider at the bottom
          to zoom.
        </p>
      </div>

      {isLoading ? (
        <div
          className="animate-pulse rounded-[4px] bg-brand-ink/5"
          style={{ minHeight }}
          aria-busy="true"
        />
      ) : (
        <Suspense
          fallback={<div style={{ height: minHeight }} aria-hidden="true" />}
        >
          <div className="space-y-6" style={{ minHeight }}>
            {/* Panel 1: Temperature + Dew Point (°C) */}
            <IMRS_WeatherTimeSeriesPanel
              {...shared}
              yAxisLabel="°C"
              showXAxis={false}
              showBrush={false}
              ariaLabel="Temperature and dew point over time, degrees Celsius"
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
            <IMRS_WeatherTimeSeriesPanel
              {...shared}
              yAxisLabel="%"
              rightYAxisLabel="mm"
              showXAxis={false}
              showBrush={false}
              ariaLabel="Humidity and precipitation over time"
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
            <IMRS_WeatherTimeSeriesPanel
              {...shared}
              yAxisLabel="km/hr"
              showXAxis={false}
              showBrush={false}
              ariaLabel="Wind and gust speed over time"
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
            <IMRS_WeatherTimeSeriesPanel
              {...shared}
              yAxisLabel="mm Hg"
              showXAxis={true}
              showBrush={true}
              ariaLabel="Barometric pressure over time"
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
        </Suspense>
      )}
    </section>
  )
}
