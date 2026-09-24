import { describe, expect, it } from 'vitest'
import {
  applySearchTerm,
  applyTaxonomicFilters,
  filterByCategory,
  getLineage,
  getRankOptions,
  setRank,
  sortSpecies,
} from './speciesFilter'
import type { Species } from '@/types/species'
import type { TaxonRankKey } from '@/types/speciesIndex'

const EMPTY_FILTERS: Record<TaxonRankKey, string | null> = {
  kingdom: null,
  phylum: null,
  class_name: null,
  order_name: null,
  family: null,
  genus: null,
}

const sample: Array<Species> = [
  {
    id: 1,
    category: 'mammals',
    kingdom: 'Animalia',
    phylum: 'Chordata',
    class_name: 'Mammalia',
    order_name: 'Carnivora',
    family: 'Canidae',
    genus: 'Canis',
    species: 'lupus',
    species_common_name: 'Gray wolf',
  },
  {
    id: 2,
    category: 'mammals',
    kingdom: 'Animalia',
    phylum: 'Chordata',
    class_name: 'Mammalia',
    order_name: 'Carnivora',
    family: 'Felidae',
    genus: 'Panthera',
    species: 'leo',
    species_common_name: 'Lion',
  },
  {
    id: 3,
    category: 'birds',
    kingdom: 'Animalia',
    phylum: 'Chordata',
    class_name: 'Aves',
    order_name: 'Falconiformes',
    family: 'Falconidae',
    genus: 'Falco',
    species: 'peregrinus',
    species_common_name: 'Peregrine falcon',
  },
  {
    id: 4,
    category: 'plants',
    kingdom: 'Plantae',
    phylum: 'Tracheophyta',
    class_name: 'Magnoliopsida',
    order_name: 'Asterales',
    family: 'Asteraceae',
    // no genus/species — exercises the "empty" sort path
  },
]

describe('filterByCategory', () => {
  it('returns the full list for "all"', () => {
    expect(filterByCategory(sample, 'all')).toHaveLength(4)
  })

  it('keeps only items in the given category', () => {
    const mammals = filterByCategory(sample, 'mammals')
    expect(mammals).toHaveLength(2)
    expect(mammals.every((s) => s.category === 'mammals')).toBe(true)
  })

  it('returns empty when no items match', () => {
    expect(filterByCategory(sample, 'fungi')).toHaveLength(0)
  })
})

describe('applyTaxonomicFilters', () => {
  it('returns the input when all filters are null', () => {
    expect(applyTaxonomicFilters(sample, EMPTY_FILTERS)).toEqual(sample)
  })

  it('matches case-insensitively', () => {
    const result = applyTaxonomicFilters(sample, {
      ...EMPTY_FILTERS,
      kingdom: 'animalia',
    })
    expect(result).toHaveLength(3)
  })

  it('combines multiple ranks with AND semantics', () => {
    const result = applyTaxonomicFilters(sample, {
      ...EMPTY_FILTERS,
      kingdom: 'Animalia',
      family: 'Canidae',
    })
    expect(result).toHaveLength(1)
    expect(result[0].genus).toBe('Canis')
  })
})

describe('applySearchTerm', () => {
  it('returns input when term is empty', () => {
    expect(applySearchTerm(sample, '')).toEqual(sample)
  })

  it('matches against genus, species, common name, and family', () => {
    expect(applySearchTerm(sample, 'lupus')).toHaveLength(1)
    expect(applySearchTerm(sample, 'falcon')).toHaveLength(1) // common name match
    expect(applySearchTerm(sample, 'felidae')).toHaveLength(1) // family match
    expect(applySearchTerm(sample, 'panthera')).toHaveLength(1) // genus match
  })

  it('is case-insensitive and supports partial matches', () => {
    expect(applySearchTerm(sample, 'GRAY')).toHaveLength(1)
    expect(applySearchTerm(sample, 'pere')).toHaveLength(1)
  })

  it('returns empty when nothing matches', () => {
    expect(applySearchTerm(sample, 'nonexistent-xyz')).toHaveLength(0)
  })
})

describe('sortSpecies', () => {
  it('sorts ascending by genus then species', () => {
    const sorted = sortSpecies(sample, 'asc')
    expect(sorted.map((s) => s.genus ?? '∅')).toEqual([
      'Canis',
      'Falco',
      'Panthera',
      '∅', // the entry with no genus drops to the end
    ])
  })

  it('sorts descending', () => {
    const sorted = sortSpecies(sample, 'desc')
    // empty entry still goes last regardless of direction
    expect(sorted[sorted.length - 1].genus).toBeUndefined()
    expect(sorted[0].genus).toBe('Panthera')
  })

  it('returns a new array (does not mutate input)', () => {
    const before = sample.map((s) => s.id)
    sortSpecies(sample, 'desc')
    expect(sample.map((s) => s.id)).toEqual(before)
  })
})

describe('getRankOptions', () => {
  it('counts every value at a rank with no selection', () => {
    const { family } = getRankOptions(sample, {})
    expect(family).toContainEqual({ value: 'Canidae', count: 1 })
    expect(family).toContainEqual({ value: 'Felidae', count: 1 })
  })

  it('narrows lower ranks by higher selections, not its own rank', () => {
    const opts = getRankOptions(sample, { class_name: 'Aves' })
    expect(opts.family.map((o) => o.value)).toEqual(['Falconidae'])
    // the selected rank still lists its siblings so the user can switch
    expect(opts.class_name.map((o) => o.value)).toContain('Mammalia')
  })

  it('merges casing drift into one capitalized option', () => {
    const drift = [
      { id: 10, class_name: 'MAGNOLIOPSIDA' },
      { id: 11, class_name: 'Magnoliopsida' },
    ]
    expect(getRankOptions(drift, {}).class_name).toEqual([
      { value: 'Magnoliopsida', count: 2 },
    ])
  })
})

describe('setRank', () => {
  it('clears every rank below the one set', () => {
    expect(
      setRank(
        { kingdom: 'Animalia', class_name: 'Mammalia', family: 'Canidae' },
        'class_name',
        'Aves',
      ),
    ).toEqual({ kingdom: 'Animalia', class_name: 'Aves' })
  })

  it('removes the rank when value is null', () => {
    expect(
      setRank({ kingdom: 'Animalia', phylum: 'Chordata' }, 'phylum', null),
    ).toEqual({ kingdom: 'Animalia' })
  })
})

describe('getLineage', () => {
  it('returns selections in kingdom → genus order', () => {
    expect(
      getLineage({ family: 'Canidae', kingdom: 'Animalia' }).map((l) => l.key),
    ).toEqual(['kingdom', 'family'])
  })
})
