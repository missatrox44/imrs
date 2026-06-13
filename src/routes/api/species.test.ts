import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Route } from './species'

// Mock createFileRoute so `Route` is just the config object passed to it,
// letting us invoke the server `GET` handler directly from the test.
// vitest hoists vi.mock above the import, so `Route` receives the mock.
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: Record<string, unknown>) => options,
}))

const execute = vi.fn()
vi.mock('@/server/turso', () => ({
  getTurso: () => ({ execute }),
}))

type RouteConfig = {
  server: { handlers: { GET: () => Promise<Response> } }
}

const callGet = () => (Route as unknown as RouteConfig).server.handlers.GET()

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

    const res = await callGet()

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

  it('filters out rows with missing or non-numeric ids', async () => {
    execute.mockResolvedValueOnce({
      rows: [
        { id: '1', genus: 'Canis', species: 'lupus' },
        { id: 'not-a-number', genus: 'Bad', species: 'row' },
        { genus: 'No', species: 'id' },
      ],
    })

    const res = await callGet()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0]).toMatchObject({ id: 1, genus: 'Canis' })
  })

  it('returns 500 with an error JSON when the database throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    execute.mockRejectedValueOnce(new Error('connection refused'))

    const res = await callGet()

    expect(res.status).toBe(500)
    expect(res.headers.get('Content-Type')).toBe('application/json')
    const body = await res.json()
    expect(body).toEqual({ error: 'Failed to fetch species data' })
  })
})
