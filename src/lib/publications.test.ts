import { describe, expect, it } from 'vitest'
import { getPublicationsForSpecies, publicationTypeLabel } from './publications'
import type { Publication } from '@/data/publications'

const pub = (fields: Partial<Publication>): Publication => ({
  id: 'p',
  title: 'Title',
  authors: 'Author',
  year: 2000,
  type: 'thesis',
  speciesIds: [1],
  ...fields,
})

const fixtures: Array<Publication> = [
  pub({ id: 'a', year: 1990, speciesIds: [1, 2] }),
  pub({ id: 'b', year: 2010, speciesIds: [1] }),
  pub({ id: 'c', year: 2005, speciesIds: [3] }),
]

describe('getPublicationsForSpecies', () => {
  it('returns only publications listing the species id', () => {
    expect(
      getPublicationsForSpecies(2, fixtures).map((p) => p.id),
    ).toEqual(['a'])
  })

  it('sorts matches newest first', () => {
    expect(
      getPublicationsForSpecies(1, fixtures).map((p) => p.id),
    ).toEqual(['b', 'a'])
  })

  it('returns an empty array when no publication matches', () => {
    expect(getPublicationsForSpecies(99, fixtures)).toEqual([])
  })
})

describe('publicationTypeLabel', () => {
  it('maps types to display labels', () => {
    expect(publicationTypeLabel('thesis')).toBe('Thesis')
    expect(publicationTypeLabel('dissertation')).toBe('Dissertation')
  })
})
