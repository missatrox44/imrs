// 🌵 DOUBLE CHECK
// If you deploy on Node runtime, use '@libsql/client'.
// If you deploy to edge/runtime that lacks Node APIs, use '@libsql/client/web'.
import { createClient } from '@libsql/client'
import type { Client } from '@libsql/client';

let _client: Client | null = null

export function getTurso() {
  if (_client) return _client
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url) throw new Error('Missing TURSO_DATABASE_URL')
  if (!authToken) throw new Error('Missing TURSO_AUTH_TOKEN')

  _client = createClient({ url, authToken })
  return _client
}