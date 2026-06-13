import { describe, expect, it } from 'vitest'
import { parseSpeciesId, slugifyBinomial, speciesPath } from './speciesSlug'

describe('slugifyBinomial', () => {
  it('kebab-cases a binomial', () => {
    expect(slugifyBinomial('Notiosorex', 'crawfordi')).toBe(
      'notiosorex-crawfordi',
    )
  })

  it('strips accents and stray punctuation', () => {
    expect(slugifyBinomial('Têst', '**crawfordi')).toBe('test-crawfordi')
  })

  it('returns empty when a part is missing or blank', () => {
    expect(slugifyBinomial('Packera', undefined)).toBe('')
    expect(slugifyBinomial(undefined, 'tampicana')).toBe('')
    expect(slugifyBinomial('Packera', '   ')).toBe('')
  })
})

describe('speciesPath', () => {
  it('prefixes the id to the slug', () => {
    expect(
      speciesPath({ id: 2, genus: 'Notiosorex', species: 'crawfordi' }),
    ).toBe('2-notiosorex-crawfordi')
  })

  it('disambiguates identical binomials by id', () => {
    expect(
      speciesPath({ id: 380, genus: 'Packera', species: 'tampicana' }),
    ).toBe('380-packera-tampicana')
    expect(
      speciesPath({ id: 381, genus: 'Packera', species: 'tampicana' }),
    ).toBe('381-packera-tampicana')
  })

  it('falls back to the bare id when there is no binomial', () => {
    expect(speciesPath({ id: 705, genus: undefined, species: undefined })).toBe(
      '705',
    )
  })
})

describe('parseSpeciesId', () => {
  it('reads the leading id from a slug param', () => {
    expect(parseSpeciesId('381-packera-tampicana')).toBe(381)
  })

  it('reads a bare id', () => {
    expect(parseSpeciesId('705')).toBe(705)
  })

  it('returns null for non-numeric params', () => {
    expect(parseSpeciesId('packera-tampicana')).toBeNull()
    expect(parseSpeciesId('')).toBeNull()
  })
})
