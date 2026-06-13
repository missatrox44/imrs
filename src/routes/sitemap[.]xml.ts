import { createFileRoute } from '@tanstack/react-router'
import { getTurso } from '@/server/turso'
import { CACHE_HEADERS, SITE_URL } from '@/data/constants'

const STATIC_ROUTES = ['/', '/species', '/observations', '/gazetteer', '/weather']

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const client = getTurso()
          const result = await client.execute('SELECT id FROM specimens')

          const speciesUrls = result.rows
            .map((row) => row.id)
            .filter((id) => id != null)
            .map((id) => `  <url><loc>${SITE_URL}/species/${id}</loc></url>`)
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
