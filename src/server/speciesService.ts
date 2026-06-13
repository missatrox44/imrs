import { createServerFn } from '@tanstack/react-start'
import type { Species } from '@/types/species'
import { getTurso } from '@/server/turso'
import { rowToSpecies } from '@/server/speciesMapper'

export const fetchAllSpecies = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<Species>> => {
    const client = getTurso()
    const result = await client.execute('SELECT * FROM specimens')
    return result.rows
      .map(rowToSpecies)
      .filter((s): s is Species => s !== null)
  },
)
