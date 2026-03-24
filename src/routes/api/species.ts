import { createServerFileRoute } from '@tanstack/react-start/server'
import type { Species } from '@/types/species'
import { getTurso } from '@/server/turso'
import { rowToSpecies } from '@/server/speciesMapper'
import { CACHE_HEADERS } from '@/data/constants'


export const ServerRoute = createServerFileRoute('/api/species').methods({
  GET: async () => {
    try {
      const client = getTurso()
      const result = await client.execute('SELECT * FROM specimens')
      const specimens: Array<Species> = result.rows.map(rowToSpecies)

      return new Response(JSON.stringify(specimens), {
        headers: CACHE_HEADERS,
      })
    } catch (error) {
      console.error('[API/species] Turso fetch failed:', error)

      return new Response(
        JSON.stringify({ error: 'Failed to fetch species data' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }
  },
})
