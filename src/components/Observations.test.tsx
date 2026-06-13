import { beforeAll, describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import Observations from './Observations'
import type { Observation } from '@/types/observation'

// jsdom lacks IntersectionObserver, which react-intersection-observer needs
// for the infinite-scroll sentinel. Stub it so the sentinel never intersects
// (no extra page fetch — we render only the seeded initial page).
beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
})

// Real iNaturalist payloads (trimmed to the fields the card reads):
// - Say's Phoebe (156226897): 1 photo + 2 sounds  → image card with a player
// - Orthoptera  (158347248): 0 photos + 1 sound   → audio-only placeholder card
const PHOEBE: Observation = {
  id: 156226897,
  species_guess: "Say's Phoebe",
  user: { login: 'jsleblanc' },
  observed_on_string: '2023-04-21 16:31:50',
  photos: [
    {
      url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/270122555/square.jpeg',
    },
  ],
  sounds: [
    {
      file_url: 'https://static.inaturalist.org/sounds/653577.wav?1682257038',
      file_content_type: 'audio/x-wav',
      hidden: false,
    },
    {
      file_url: 'https://static.inaturalist.org/sounds/653579.wav?1682257049',
      file_content_type: 'audio/x-wav',
      hidden: false,
    },
  ],
  place_guess: 'Van Horn, TX 79855, USA',
  uri: 'https://www.inaturalist.org/observations/156226897',
  taxon: { id: 17009, name: 'Sayornis saya', preferred_common_name: "Say's Phoebe" },
}

const ORTHOPTERA: Observation = {
  id: 158347248,
  species_guess: 'Orthoptera',
  user: { login: 'henicorhina' },
  observed_on_string: '2023/04/29 07:50 AM',
  photos: [],
  sounds: [
    {
      file_url: 'https://static.inaturalist.org/sounds/671320.wav?1682894219',
      file_content_type: 'audio/x-wav',
      hidden: false,
    },
  ],
  place_guess: 'Hudspeth County, TX, USA',
  uri: 'https://www.inaturalist.org/observations/158347248',
  taxon: {
    id: 47651,
    name: 'Orthoptera',
    preferred_common_name: 'Grasshoppers, Crickets, and Katydids',
  },
}

async function renderObservations(results: Array<Observation>) {
  const initialPage = {
    page: 1,
    per_page: 50,
    // equal to results.length so getNextPageParam returns undefined (no fetch)
    total_results: results.length,
    results,
  }
  const rootRoute = createRootRoute({
    component: () => <Observations initialPage={initialPage} />,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  )
  // RouterProvider mounts asynchronously
  await waitFor(() =>
    expect(utils.container.querySelector('li')).toBeInTheDocument(),
  )
  return utils
}

describe('Observations audio rendering', () => {
  it('renders an inline audio player for each observation that has sound', async () => {
    const { container } = await renderObservations([PHOEBE, ORTHOPTERA])

    const players = container.querySelectorAll('audio')
    expect(players).toHaveLength(2)

    players.forEach((audio) => {
      expect(audio).toHaveAttribute('controls')
      expect(audio).toHaveAttribute('preload', 'none')
      const source = audio.querySelector('source')
      expect(source).toHaveAttribute('type', 'audio/x-wav')
      expect(source?.getAttribute('src')).toMatch(/\.wav/)
      // The player must NOT be nested inside the card's <a> (invalid HTML +
      // would otherwise hijack the click that opens the iNaturalist page).
      expect(audio.closest('a')).toBeNull()
    })
  })

  it('uses the first sound and labels the player with the species', async () => {
    const { container } = await renderObservations([PHOEBE])

    const audio = container.querySelector('audio')
    expect(audio).toHaveAttribute('aria-label', "Audio recording for Say's Phoebe")
    expect(audio?.querySelector('source')).toHaveAttribute(
      'src',
      'https://static.inaturalist.org/sounds/653577.wav?1682257038',
    )
  })

  it('shows a photo (not the placeholder) when the observation has one', async () => {
    const { container } = await renderObservations([PHOEBE])

    const card = container.querySelector('li')!
    const img = card.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', "Say's Phoebe")
    // getPhotoUrl swaps the iNat "square" size variant for "medium"
    expect(img?.getAttribute('src')).toContain('/medium.jpeg')
    // no audio-icon placeholder when a photo is present
    expect(card.querySelector('.bg-muted svg')).toBeNull()
  })

  it('shows the audio-icon placeholder for an audio-only observation', async () => {
    const { container } = await renderObservations([ORTHOPTERA])

    const card = container.querySelector('li')!
    expect(card.querySelector('img')).toBeNull()
    // AudioLines icon renders as an <svg> inside the muted square
    expect(card.querySelector('.bg-muted svg')).toBeInTheDocument()
    expect(card.querySelector('audio')).toBeInTheDocument()
  })
})
