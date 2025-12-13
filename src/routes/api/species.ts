// import { createClient } from '@libsql/client'

// const turso = createClient({
//   url: process.env.TURSO_DATABASE_URL!,
//   authToken: process.env.TURSO_AUTH_TOKEN!,
// })

// export const GET = async () => {
//   try {
//     const result = await turso.execute('SELECT * FROM specimens')

//     return new Response(JSON.stringify(result.rows), {
//       headers: { 'Content-Type': 'application/json' },
//     })
//   } catch (err) {
//     console.error('TURSO ERROR:', err)

//     return new Response(JSON.stringify({ error: 'Failed to fetch Turso data' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     })
//   }
// }


// export const GET = async () => {
//   return new Response(JSON.stringify({ test: true }), {
//     headers: { "Content-Type": "application/json" },
//   })
// }



import { createServerFileRoute } from '@tanstack/react-start/server'

export const ServerRoute = createServerFileRoute('/api/species')
  .methods({
    GET: async () => {
      return new Response(JSON.stringify({ test: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    },
  })