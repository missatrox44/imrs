import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { NotFound } from './components/NotFound'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'

// You must export a getRouter function that returns a new router instance
// each time it is called. TanStack Start registers the router type for type
// safety via the generated routeTree.gen.ts.
export function getRouter() {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  })

  // Dehydrates the QueryClient on the server and hydrates it on the client,
  // so loader-prefetched queries land in the cache useQuery reads. Also
  // wraps the app in QueryClientProvider.
  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
