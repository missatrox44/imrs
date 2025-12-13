// FETCHING DATA FROM LOCAL SQLITE DATABASE
// import { createServerFileRoute } from '@tanstack/react-start/server'
// import type { Species } from '@/types/species'
// import { getDb } from '@/server/db'

// export const ServerRoute = createServerFileRoute('/api/species').methods({
//   GET: async () => {
//     try {
//       const db = getDb()
//       const specimens = db.prepare('SELECT * FROM specimens').all() as Array<Species>

//       return new Response(JSON.stringify(specimens), {
//         headers: { 'Content-Type': 'application/json' },
//       })
//     } catch (error) {
//       console.error('Error fetching species from database:', error)
//       return new Response(
//         JSON.stringify({ error: 'Failed to fetch species data' }),
//         {
//           status: 500,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       )
//     }
//   },
// })



// FETCHING DATA FROM TURSO
import { createServerFileRoute } from '@tanstack/react-start/server'
import type { Species } from '@/types/species'
import { getTurso } from '@/server/turso'
import { rowToSpecies } from '@/server/speciesMapper'

export const ServerRoute = createServerFileRoute('/api/species').methods({
  GET: async () => {
    try {
      const client = getTurso()

      const result = await client.execute(
        'SELECT * FROM specimens'
      )

      // libSQL returns rows as plain objects — perfect for JSON
      // const specimens = result.rows as Array<Species>
      const specimens: Array<Species> = result.rows.map(rowToSpecies)

      return new Response(JSON.stringify(specimens), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('[API/species] Turso fetch failed:', error)

      return new Response(
        JSON.stringify({ error: 'Failed to fetch species data' }),
        { status: 500 }
      )
    }
  },
})
