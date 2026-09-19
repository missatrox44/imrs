import React from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanstackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { LazyMotion, domAnimation } from 'framer-motion'

import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import Header from '@/components/layout/IMRS_Header'
import { IMRS_Footer as Footer } from '@/components/layout/IMRS_Footer'
import { SITE_URL } from '@/data/constants'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'IMRS Biodiversity Explorer',
      },
      {
        name: 'description',
        content:
          'A field-driven biodiversity explorer for the Indio Mountains Research Station.',
      },
      {
        property: 'og:title',
        content: 'IMRS Biodiversity Explorer',
      },
      {
        property: 'og:description',
        content:
          'Explore the biodiversity of Indio Mountains Research Station.',
      },
      {
        property: 'og:image',
        content: `${SITE_URL}/og.png`,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://imrs.bio',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'IMRS Biodiversity Explorer',
      },
      {
        name: 'twitter:description',
        content:
          'Explore the biodiversity of Indio Mountains Research Station.',
      },
      {
        name: 'twitter:image',
        content: `${SITE_URL}/og.png`,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Just+Me+Again+Down+Here&display=swap',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <Header />
          <div id="main-content">{children}</div>
          <Footer />
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
          {/* <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />  */}
          <Scripts />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </LazyMotion>
  )
}
