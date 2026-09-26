// The paper section under IMRS_Page_Hero.
import { useEffect } from 'react'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Monitor } from 'lucide-react'
import type { WeatherFilters } from '@/types/weather'
import { IMRS_WeatherDataRequestDialog } from '@/components/IMRS_WeatherDataRequestDialog'
import { IMRS_WeatherFilterBar } from '@/components/IMRS_WeatherFilterBar'
import { IMRS_WeatherStatCards } from '@/components/IMRS_WeatherStatCards'
import { IMRS_WeatherTimeSeries } from '@/components/IMRS_WeatherTimeSeries'
import { Route } from '@/routes/weather'
import { useWeatherDaily, useWeatherSummary } from '@/hooks/useWeatherData'

export const IMRS_WeatherDashboard = () => {
  const { year, season } = Route.useSearch()
  const filters: WeatherFilters = { year, season }
  const isMobile = useMediaQuery('(max-width: 767px)')

  const { hash } = useLocation()
  const navigate = useNavigate({ from: Route.fullPath })

  // Open the request dialog when arriving from the homepage CTA
  // (/weather#request-weather-data), then clear the hash so a refresh
  // doesn't reopen it.
  useEffect(() => {
    if (hash !== 'request-weather-data') return
    document.getElementById('request-weather-data')?.click()
    navigate({ search: (prev) => prev, hash: '', replace: true })
  }, [hash, navigate])

  const { data: summary, isLoading: summaryLoading } =
    useWeatherSummary(filters)
  const { data: daily, isLoading: dailyLoading } = useWeatherDaily(filters)

  return (
    // Rides up over the hero like the observations feed (106px at the 1440
    // frame, halved below lg with the radius).
    <section className="relative -mt-[53px] overflow-clip rounded-t-4xl bg-brand-paper pt-16 pb-16 text-brand-ink md:pt-22 lg:-mt-[106px] lg:rounded-t-[64px] lg:pt-[120px] lg:pb-[190px]">
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom opacity-[0.16] mix-blend-multiply"
      />

      <div className="relative px-4 sm:px-8 lg:px-16">
        {isMobile && (
          <div
            role="note"
            className="mb-8 flex items-start gap-2 rounded-[4px] bg-brand-sand px-4 py-3 font-brand-sans text-sm leading-6 tracking-[0.04em]"
          >
            <Monitor className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>
              For the full set of interactive climate charts, this page is best
              experienced on a larger screen.
            </span>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <IMRS_WeatherFilterBar />
          <IMRS_WeatherDataRequestDialog />
        </div>

        <hr className="mt-12 border-0 border-t border-brand-ink lg:mt-16" />

        <div className="mt-12 lg:mt-16">
          <IMRS_WeatherStatCards summary={summary} isLoading={summaryLoading} />
        </div>

        {!isMobile && (
          <div className="mt-12">
            <IMRS_WeatherTimeSeries data={daily} isLoading={dailyLoading} />
          </div>
        )}
      </div>
    </section>
  )
}
