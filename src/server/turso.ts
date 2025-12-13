import { createClient } from '@libsql/client'
import type { Client } from '@libsql/client';

let _client: Client | null = null

export function getTurso() {
  if (_client) return _client
  const url = process.env.imrs_TURSO_DATABASE_URL
  const authToken = process.env.imrs_TURSO_AUTH_TOKEN
  if (!url) throw new Error('Missing imrs_TURSO_DATABASE_URL')
  if (!authToken) throw new Error('Missing imrs_TURSO_AUTH_TOKEN')

  _client = createClient({ url, authToken })
  return _client
}