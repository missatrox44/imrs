import { createFileRoute } from '@tanstack/react-router'
import { getTurso } from '@/server/turso'
import { CACHE_HEADERS, SITE_URL } from '@/data/constants'
import { speciesPath } from '@/lib/speciesSlug'

const STATIC_ROUTES = [
  '/',
  '/species',
  '/observations',
  '/gazetteer',
  '/weather',
]

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const client = getTurso()
          const result = await client.execute(
            'SELECT id, genus, species FROM specimens',
          )

          const speciesUrls = result.rows
            .filter((row) => row.id != null)
            .map((row) => {
              const path = speciesPath({
                id: Number(row.id),
                genus: row.genus == null ? undefined : String(row.genus),
                species: row.species == null ? undefined : String(row.species),
              })
              return `  <url><loc>${SITE_URL}/species/${path}</loc></url>`
            })
            .join('\n')

          const staticUrls = STATIC_ROUTES.map(
            (path) => `  <url><loc>${SITE_URL}${path}</loc></url>`,
          ).join('\n')

          const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${speciesUrls}
</urlset>`

          return new Response(xml, {
            headers: {
              'Content-Type': 'application/xml',
              'Cache-Control': CACHE_HEADERS['Cache-Control'],
            },
          })
        } catch (error) {
          console.error(
            '[sitemap.xml] Failed to generate sitemap:',
            error instanceof Error ? error.message : 'Unknown error',
          )
          return new Response('Failed to generate sitemap', { status: 500 })
        }
      },
    },
  },
})
