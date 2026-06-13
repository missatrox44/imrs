import { createServerFn } from '@tanstack/react-start'
import type { Season, WeatherSummary } from '@/types/weather'
import { getTurso } from '@/server/turso'
import { buildWeatherSummary } from '@/server/weatherTransforms'

const VALID_SEASONS: ReadonlyArray<Season> = [
  'all',
  'winter',
  'premonsoon',
  'monsoon',
  'postmonsoon',
]

interface WeatherFilterInput {
  year: string
  season: Season
}

function validateWeatherInput(input: unknown): WeatherFilterInput {
  if (input === null || typeof input !== 'object') {
    throw new Error('Weather input must be an object')
  }
  const { year, season } = input as Record<string, unknown>
  if (typeof year !== 'string') {
    throw new Error('year must be a string')
  }
  if (typeof season !== 'string' || !VALID_SEASONS.includes(season as Season)) {
    throw new Error(`season must be one of: ${VALID_SEASONS.join(', ')}`)
  }
  return { year, season: season as Season }
}

export const fetchWeatherSummary = createServerFn({ method: 'GET' })
  .inputValidator(validateWeatherInput)
  .handler(async ({ data }): Promise<WeatherSummary> => {
    const client = getTurso()

    return buildWeatherSummary(data.year, data.season, async (query) => {
      const result = await client.execute({
        sql: query.sql,
        args: query.args,
      })
      return result.rows
    })
  })
