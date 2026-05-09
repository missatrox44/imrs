import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Import after vi.mock so the mocks are wired up.
import { ServerRoute } from './species'

// Mock createServerFileRoute so `.methods({ GET })` returns the handlers
// object directly — we want to invoke `GET` from the test.
vi.mock('@tanstack/react-start/server', () => ({
  createServerFileRoute: () => ({
    methods: (handlers: Record<string, unknown>) => handlers,
  }),
}))

const execute = vi.fn()
vi.mock('@/server/turso', () => ({
  getTurso: () => ({ execute }),
}))

type Handlers = { GET: () => Promise<Response> }

describe('GET /api/species', () => {
  beforeEach(() => execute.mockReset())
  afterEach(() => vi.restoreAllMocks())

  it('returns 200 with mapped species and cache headers', async () => {
    execute.mockResolvedValueOnce({
      rows: [
        { id: '1', kingdom: 'Animalia', genus: 'Canis', species: 'lupus' },
        { id: '2', kingdom: 'Plantae', genus: 'Quercus', species: 'alba' },
      ],
    })

    const res = await (ServerRoute as unknown as Handlers).GET()

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/json')
    expect(res.headers.get('Cache-Control')).toMatch(/max-age=86400/)
    const body = await res.json()
    expect(body).toHaveLength(2)
    expect(body[0]).toMatchObject({
      id: 1,
      kingdom: 'Animalia',
      genus: 'Canis',
      species: 'lupus',
    })
    expect(execute).toHaveBeenCalledWith('SELECT * FROM specimens')
  })

  it('returns 500 with an error JSON when the database throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    execute.mockRejectedValueOnce(new Error('connection refused'))

    const res = await (ServerRoute as unknown as Handlers).GET()

    expect(res.status).toBe(500)
    expect(res.headers.get('Content-Type')).toBe('application/json')
    const body = await res.json()
    expect(body).toEqual({ error: 'Failed to fetch species data' })
  })
})
