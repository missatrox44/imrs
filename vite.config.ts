import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// Content-Security-Policy and related headers, applied at build time only.
// The Vercel preset copies these routeRules headers into the Build Output
// API config. They are intentionally NOT applied during `vite dev` so HMR's
// inline scripts/eval and websocket connection are not blocked.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://*.tile.openstreetmap.org https://inaturalist-open-data.s3.amazonaws.com https://static.inaturalist.org",
  "connect-src 'self' https://api.inaturalist.org",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const securityHeaders = {
  'Content-Security-Policy': CSP,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

const config = defineConfig(({ command }) => ({
  plugins: [
    // treat .geojson files as JSON
    {
      name: 'geojson',
      transform(code, id) {
        if (id.endsWith('.geojson')) {
          return {
            code: `export default ${code}`,
            map: null,
          }
        }
      },
    },
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      router: {
        routeFileIgnorePattern: '\\.(test|spec)\\.',
      },
    }),
    // Nitro produces the deployable server build (.output/ locally,
    // .vercel/output/ when building on Vercel — it detects the host).
    nitro(
      command === 'build'
        ? { routeRules: { '/**': { headers: securityHeaders } } }
        : undefined,
    ),
    viteReact(),
  ],
}))

export default config
