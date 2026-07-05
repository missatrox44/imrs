import { Link } from '@tanstack/react-router'
import { useWeatherSummary } from '@/hooks/useWeatherData'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkline } from '@/components/weather/WeatherStatCards'
import { WEATHER_COLORS } from '@/lib/weatherColors'

export function WeatherMiniDashboard() {
  const {
    data: summary,
    isLoading,
    isError,
  } = useWeatherSummary({ year: 'all', season: 'all' })

  const showStats = !isLoading && !isError && summary != null

  return (
    <Card className="gradient-card shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              Climate & Weather
            </h2>
            <p className="text-muted-foreground mb-6">
              Hill Station · 2020–2024
            </p>
            <Button asChild size="lg" className="w-full cursor-pointer">
              <Link to="/weather" search={{ year: 'all', season: 'all' }}>
                Explore Weather Data
              </Link>
            </Button>
            <div className="text-center mt-4">
              <Link
                to="/weather"
                search={{ year: 'all', season: 'all' }}
                hash="request-weather-data"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                <span className="hidden sm:inline">
                  Researchers: request the raw dataset →
                </span>
                <span className="sm:hidden">Request the raw dataset →</span>
              </Link>
            </div>
          </div>

          {showStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className="border-t-2 p-3"
                style={{ borderTopColor: WEATHER_COLORS.temp }}
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Avg Daily High
                </span>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xl font-bold">
                      {summary.avgDailyHigh != null
                        ? summary.avgDailyHigh.toFixed(1)
                        : '—'}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      °C
                    </span>
                  </div>
                  <Sparkline
                    data={summary.sparklines.temp}
                    color={WEATHER_COLORS.temp}
                    width={80}
                    height={24}
                  />
                </div>
              </div>
              <div
                className="border-t-2 p-3"
                style={{ borderTopColor: WEATHER_COLORS.precip }}
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Precip
                </span>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xl font-bold">
                      {summary.totalPrecip != null
                        ? summary.totalPrecip.toFixed(1)
                        : '—'}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      mm
                    </span>
                  </div>
                  <Sparkline
                    data={summary.sparklines.precip}
                    color={WEATHER_COLORS.precip}
                    width={80}
                    height={24}
                  />
                </div>
              </div>
              <div
                className="border-t-2 p-3"
                style={{ borderTopColor: WEATHER_COLORS.humidity }}
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Avg Humidity
                </span>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xl font-bold">
                      {summary.avgHumidity != null
                        ? summary.avgHumidity.toFixed(1)
                        : '—'}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      %
                    </span>
                  </div>
                  <Sparkline
                    data={summary.sparklines.humidity}
                    color={WEATHER_COLORS.humidity}
                    width={80}
                    height={24}
                  />
                </div>
              </div>
              <div
                className="border-t-2 p-3"
                style={{ borderTopColor: WEATHER_COLORS.wind }}
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Avg Wind
                </span>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xl font-bold">
                      {summary.avgWindSpeed != null
                        ? summary.avgWindSpeed.toFixed(1)
                        : '—'}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      km/hr
                    </span>
                  </div>
                  <Sparkline
                    data={summary.sparklines.wind}
                    color={WEATHER_COLORS.wind}
                    width={80}
                    height={24}
                  />
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded h-20" />
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
