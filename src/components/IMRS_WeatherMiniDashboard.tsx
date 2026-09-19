import { Link } from '@tanstack/react-router'
import { useWeatherSummary } from '@/hooks/useWeatherData'
import { Sparkline } from '@/components/weather/WeatherStatCards'
import { WEATHER_COLORS } from '@/lib/weatherColors'

const weatherSearch = { year: 'all', season: 'all' } as const

const pillClass =
  'inline-flex items-center justify-center rounded-pill px-6 py-3 font-brand-mono text-base leading-[31px] transition-colors'

// Figma "IMRS Website Design" node 80:1109. Full-bleed paper band with a torn
// top edge; the footer's rounded top overlaps the bottom 71px (negative margin).
export function IMRS_WeatherMiniDashboard() {
  const { data: summary, isLoading } = useWeatherSummary(weatherSearch)

  const stats = summary
    ? [
        {
          label: 'Avg. Daily High',
          value: summary.avgDailyHigh,
          unit: '°C',
          color: WEATHER_COLORS.temp,
          data: summary.sparklines.temp,
        },
        {
          label: 'Total Precipitation',
          value: summary.totalPrecip,
          unit: ' mm',
          color: WEATHER_COLORS.precip,
          data: summary.sparklines.precip,
        },
        {
          label: 'Avg. Humidity',
          value: summary.avgHumidity,
          unit: '%',
          color: WEATHER_COLORS.humidity,
          data: summary.sparklines.humidity,
        },
        {
          label: 'Avg. Wind',
          value: summary.avgWindSpeed,
          unit: ' km/hr',
          color: WEATHER_COLORS.wind,
          data: summary.sparklines.wind,
        },
      ]
    : null

  return (
    <section
      aria-labelledby="weather-mini-heading"
      className="torn-edge-top relative -mb-10 mt-20 overflow-hidden bg-brand-light pt-16 pb-[104px] lg:-mb-[71px] lg:pt-[120px] lg:pb-[174px]"
    >
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.36] mix-blend-multiply"
      />
      <div className="relative mx-auto grid max-w-[1310px] gap-12 px-4 text-brand-ink lg:grid-cols-[minmax(0,488px)_minmax(0,644px)] lg:justify-between lg:px-[66px]">
        <div>
          <h2
            id="weather-mini-heading"
            className="font-brand-sans text-[40px] leading-tight tracking-[0.04em] lg:text-[56px] lg:leading-[63px]"
          >
            <span className="text-brand-green">Climate</span> & Weather
          </h2>
          <p className="mt-6 font-brand-mono text-xl leading-[31px] tracking-[0.04em] lg:text-2xl">
            Hill Station · 2020–2024
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/weather"
              search={weatherSearch}
              className={`${pillClass} bg-brand-green text-brand-cream hover:bg-brand-green-dark`}
            >
              Explore Weather Data
            </Link>
            <Link
              to="/weather"
              search={weatherSearch}
              hash="request-weather-data"
              className={`${pillClass} border-2 border-brand-green font-medium text-brand-green hover:bg-brand-green/10`}
            >
              Request Raw Data
            </Link>
          </div>
        </div>

        {stats ? (
          <dl className="grid gap-x-6 gap-y-[22px] sm:grid-cols-2 lg:mt-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-t-2 pt-[13px]"
                style={{ borderTopColor: stat.color }}
              >
                <dt className="font-brand-mono text-base leading-6 tracking-[0.04em]">
                  {stat.label}
                </dt>
                <dd className="mt-[11px] flex items-center gap-4 font-brand-mono text-2xl leading-[31px] tracking-[0.04em]">
                  <span>
                    {stat.value != null ? stat.value.toFixed(1) : '—'}
                    {stat.unit}
                  </span>
                  <Sparkline
                    data={stat.data}
                    color={stat.color}
                    width={108}
                    height={36}
                  />
                </dd>
              </div>
            ))}
          </dl>
        ) : isLoading ? (
          <div className="grid gap-x-6 gap-y-[22px] sm:grid-cols-2 lg:mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[90px] animate-pulse rounded bg-brand-ink/5"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
