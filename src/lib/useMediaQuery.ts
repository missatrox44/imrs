import { useCallback, useSyncExternalStore } from 'react'

// SSR-safe replacement for @uidotdev/usehooks' useMediaQuery, whose
// getServerSnapshot throws "client-only hook" and empties full-SSR routes
// (it blanked /gazetteer to header+footer). The server snapshot reports "no
// match"; useSyncExternalStore re-checks after hydration and re-renders if
// the client disagrees.
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
