// import { createServerFileRoute } from '@tanstack/react-start/server'
// import type { Species } from '@/types/species'

// import { getTurso } from '@/server/turso'
// import { getDb } from '@/server/db'
// import { rowToSpecies } from '@/server/speciesMapper'

// export const ServerRoute = createServerFileRoute('/api/species').methods({
//   GET: async () => {
//     // try turso first
//     try {
//       const client = getTurso()
//       const result = await client.execute('SELECT * FROM specimens')

//       const specimens: Array<Species> = result.rows.map(rowToSpecies)

//       console.info('[API/species] Served from Turso')
//       return Response.json(specimens)
//     } catch (tursoError) {
//       console.warn('[API/species] Turso failed, falling back to local SQLite', tursoError)
//     }

//     // fallback to local SQLite
//     try {
//       const db = getDb()
//       const specimens = db
//         .prepare('SELECT * FROM specimens')
//         .all() as Array<Species>

//       console.info('[API/species] Served from local SQLite')
//       return Response.json(specimens)
//     } catch (sqliteError) {
//       console.error('[API/species] SQLite fallback failed', sqliteError)

//       return new Response(
//         JSON.stringify({ error: 'Failed to fetch species data' }),
//         { status: 500 }
//       )
//     }
//   },
// })
// ==============================================

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


// =============================================
// FETCHING DATA FROM LOCAL DB with filters
import { createServerFileRoute } from '@tanstack/react-start/server'
import type { Species } from '@/types/species'
import { getDb } from '@/server/db'

export const ServerRoute = createServerFileRoute('/api/species').methods({
  GET: async ({ request }) => {
    try {
      const db = getDb()
      const url = new URL(request.url)
      
      // Extract query parameters
      const kingdom = url.searchParams.get('kingdom')
      const phylum = url.searchParams.get('phylum')
      const class_ = url.searchParams.get('class')
      const order = url.searchParams.get('order')
      const family = url.searchParams.get('family')
      const genus = url.searchParams.get('genus')
      const searchTerm = url.searchParams.get('search')
      const sortBy = url.searchParams.get('sortBy') || 'genus' // default sort
      const sortOrder = url.searchParams.get('sortOrder') || 'asc' // 'asc' or 'desc'

      // Build WHERE conditions
      const conditions: Array<string> = []
      const params: Record<string, string> = {}

      if (kingdom) {
        conditions.push('kingdom = $kingdom')
        params.$kingdom = kingdom
      }
      if (phylum) {
        conditions.push('phylum = $phylum')
        params.$phylum = phylum
      }
      if (class_) {
        conditions.push('class = $class')
        params.$class = class_
      }
      if (order) {
        conditions.push('"order" = $order') // "order" is a SQL keyword, needs quotes
        params.$order = order
      }
      if (family) {
        conditions.push('family = $family')
        params.$family = family
      }
      if (genus) {
        conditions.push('genus = $genus')
        params.$genus = genus
      }
      if (searchTerm) {
        conditions.push('(genus LIKE $search OR species LIKE $search OR common_name LIKE $search)')
        params.$search = `%${searchTerm}%`
      }

      // Build WHERE clause
      const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}` 
        : ''

      // Validate sortBy to prevent SQL injection
      const validSortColumns = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'common_name']
      const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'genus'
      
      // Handle "order" column which needs quotes
      const sortColumn = safeSortBy === 'order' ? '"order"' : safeSortBy
      
      // Validate sortOrder
      const safeSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'

      // Build final query
      const query = `
        SELECT * FROM specimens 
        ${whereClause}
        ORDER BY ${sortColumn} ${safeSortOrder}
      `

      console.log('SQL Query:', query)
      console.log('Parameters:', params)

      const specimens = db.prepare(query).all(params) as Array<Species>

      return new Response(JSON.stringify(specimens), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error fetching species from database:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch species data' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  },
})

// ==============================================
// ALTERNATIVE:
// FETCHING DATA FROM TURSO
// import { createServerFileRoute } from '@tanstack/react-start/server'
// import type { Species } from '@/types/species'
// import { getTurso } from '@/server/turso'
// import { rowToSpecies } from '@/server/speciesMapper'

// export const ServerRoute = createServerFileRoute('/api/species').methods({
//   GET: async () => {
//     try {
//       const client = getTurso()

//       const result = await client.execute(
//         'SELECT * FROM specimens'
//       )

//       // libSQL returns rows as plain objects — perfect for JSON
//       // const specimens = result.rows as Array<Species>
//       const specimens: Array<Species> = result.rows.map(rowToSpecies)

//       return new Response(JSON.stringify(specimens), {
//         headers: { 'Content-Type': 'application/json' },
//       })
//     } catch (error) {
//       console.error('[API/species] Turso fetch failed:', error)

//       return new Response(
//         JSON.stringify({ error: 'Failed to fetch species data' }),
//         { status: 500 }
//       )
//     }
//   },
// })
