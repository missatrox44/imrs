import { describe, expect, it } from 'vitest'
import { rowToSpecies } from './speciesMapper'

describe('rowToSpecies', () => {
  it('coerces id to a Number', () => {
    const result = rowToSpecies({ id: '42' })
    expect(result.id).toBe(42)
    expect(typeof result.id).toBe('number')
  })

  it('passes through string fields', () => {
    const row = {
      id: 1,
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class_name: 'Mammalia',
      order_name: 'Carnivora',
      family: 'Canidae',
      genus: 'Canis',
      species: 'lupus',
      species_common_name: 'Gray wolf',
    }
    const result = rowToSpecies(row)
    expect(result.kingdom).toBe('Animalia')
    expect(result.phylum).toBe('Chordata')
    expect(result.class_name).toBe('Mammalia')
    expect(result.order_name).toBe('Carnivora')
    expect(result.family).toBe('Canidae')
    expect(result.genus).toBe('Canis')
    expect(result.species).toBe('lupus')
    expect(result.species_common_name).toBe('Gray wolf')
  })

  it('returns undefined for missing taxonomic fields', () => {
    const result = rowToSpecies({ id: 1 })
    expect(result.kingdom).toBeUndefined()
    expect(result.phylum).toBeUndefined()
    expect(result.species_common_name).toBeUndefined()
    expect(result.records).toBeUndefined()
  })

  it('handles records, authorship, and note fields', () => {
    const result = rowToSpecies({
      id: 1,
      authorship: 'Linnaeus, 1758',
      note: 'observed in 2020',
      records: 'IMRS-001',
      collectors_field_numbers: 'CFN-12',
    })
    expect(result.authorship).toBe('Linnaeus, 1758')
    expect(result.note).toBe('observed in 2020')
    expect(result.records).toBe('IMRS-001')
    expect(result.collectors_field_numbers).toBe('CFN-12')
  })

  it('returns NaN id when source id is non-numeric', () => {
    const result = rowToSpecies({ id: 'not-a-number' })
    expect(Number.isNaN(result.id)).toBe(true)
  })
})
