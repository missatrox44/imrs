import React from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanstackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Analytics } from '@vercel/analytics/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import appCss from '../styles.css?url'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const Route = createRootRoute({
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
        content: '/og.png',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://imrs.vercel.app/',
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
        content: '/og.png',
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
        href: 'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  // const queryClient = React.useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <Header />
          {children}
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
        </body>
      </html>
    </QueryClientProvider>
  )
}
