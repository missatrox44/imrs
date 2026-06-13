import { z } from 'zod'
import { ORDER, ORDER_BY, PER_PAGE, PLACE_ID } from '@/data/constants'

// Zod v4's JIT compiles schemas with `new Function`, which our CSP
// (script-src without 'unsafe-eval') blocks in the browser.
z.config({ jitless: true })

export const INAT_TIMEOUT_MS = 10_000

// iNaturalist returns `null` (not absent) for missing fields, so every
// optional field is `.nullish()` (accepts null | undefined).
export const ObservationSchema = z.object({
  id: z.number(),
  species_guess: z.string().nullish(),
  user: z
    .object({
      login: z.string().nullish(),
    })
    .nullish(),
  observed_on_string: z.string().nullish(),
  photos: z
    .array(
      z.object({
        url: z.string().nullish(),
      }),
    )
    .nullish(),
  place_guess: z.string().nullish(),
  uri: z.string().nullish(),
  taxon: z
    .object({
      id: z.number().nullish(),
      name: z.string().nullish(),
      preferred_common_name: z.string().nullish(),
      ancestor_ids: z.array(z.number()).nullish(),
    })
    .nullish(),
})

export const ObservationsResponseSchema = z.object({
  total_results: z.number(),
  results: z.array(ObservationSchema),
})

interface FetchObservationsParams {
  page?: number
  per_page?: number
  taxon_name?: string
}

export async function fetchObservations(
  params: FetchObservationsParams,
  signal?: AbortSignal,
) {
  const url = new URL('https://api.inaturalist.org/v1/observations')

  if (params.taxon_name) {
    url.searchParams.set('taxon_name', params.taxon_name)
  } else {
    url.searchParams.set('place_id', PLACE_ID)
    url.searchParams.set('order', ORDER)
    url.searchParams.set('order_by', ORDER_BY)
  }
  url.searchParams.set('per_page', String(params.per_page ?? PER_PAGE))
  if (params.page != null) {
    url.searchParams.set('page', String(params.page))
  }

  const res = await fetch(url, {
    signal: signal ?? AbortSignal.timeout(INAT_TIMEOUT_MS),
  })

  if (!res.ok) {
    throw new Error(`iNaturalist request failed with status ${res.status}`)
  }

  const json = await res.json()
  return ObservationsResponseSchema.parse(json)
}
