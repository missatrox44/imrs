import { describe, expect, it } from 'vitest'
import { taxonQueryName } from './inat'

describe('taxonQueryName', () => {
  it('builds a binomial from genus and species', () => {
    expect(taxonQueryName('Didelphis', 'virginiana')).toBe(
      'Didelphis virginiana',
    )
  })

  it('drops the "sp." placeholder epithet, querying by genus only', () => {
    expect(taxonQueryName('Eremobates', 'sp.')).toBe('Eremobates')
  })

  it('queries by genus when the epithet is missing or blank', () => {
    expect(taxonQueryName('Eremobates', '')).toBe('Eremobates')
    expect(taxonQueryName('Eremobates', undefined)).toBe('Eremobates')
  })

  it('returns empty when there is no genus or species', () => {
    expect(taxonQueryName(undefined, undefined)).toBe('')
  })
})
