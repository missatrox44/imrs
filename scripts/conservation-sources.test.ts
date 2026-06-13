import { describe, expect, it } from 'vitest'
import {
  extractNatureServe,
  findNatureServeMatch,
  pickLatestIucnCategory,
  pickTexasSRank,
} from './conservation-sources'
import type { NatureServeResult } from './conservation-sources'

// Captured from the live NatureServe speciesSearch response for "Canis lupus".
const NS_RESULTS: Array<NatureServeResult> = [
  {
    scientificName: 'Canis familiaris',
    uniqueId: 'ELEMENT_GLOBAL.2.100911',
    roundedGRank: 'GNA',
  },
  {
    scientificName: 'Canis lupus',
    uniqueId: 'ELEMENT_GLOBAL.2.105212',
    roundedGRank: 'G5',
    nations: [
      {
        nationCode: 'US',
        subnations: [
          { subnationCode: 'CA', roundedSRank: 'S1' },
          { subnationCode: 'TX', roundedSRank: 'SX' },
        ],
      },
    ],
  },
  {
    scientificName: 'Canis lupus baileyi',
    uniqueId: 'ELEMENT_GLOBAL.2.105213',
  },
]

describe('findNatureServeMatch', () => {
  it('matches the exact scientific name, not the fuzzy first result', () => {
    const match = findNatureServeMatch(NS_RESULTS, 'Canis lupus')
    expect(match?.uniqueId).toBe('ELEMENT_GLOBAL.2.105212')
  })

  it('is case- and whitespace-insensitive', () => {
    expect(
      findNatureServeMatch(NS_RESULTS, '  canis LUPUS ')?.roundedGRank,
    ).toBe('G5')
  })

  it('falls back to a name that starts with the binomial + space', () => {
    const match = findNatureServeMatch(
      [{ scientificName: 'Quercus grisea Liebm.' }],
      'Quercus grisea',
    )
    expect(match?.scientificName).toBe('Quercus grisea Liebm.')
  })

  it('returns null when nothing matches', () => {
    expect(findNatureServeMatch(NS_RESULTS, 'Felis catus')).toBeNull()
    expect(findNatureServeMatch([], 'Canis lupus')).toBeNull()
  })
})

describe('pickTexasSRank', () => {
  it('reads the US → TX subnational rank', () => {
    expect(pickTexasSRank(NS_RESULTS[1])).toBe('SX')
  })

  it('returns null when there is no Texas subnation', () => {
    expect(pickTexasSRank(NS_RESULTS[2])).toBeNull()
  })
})

describe('extractNatureServe', () => {
  it('pulls uniqueId, G-rank, and Texas S-rank', () => {
    expect(extractNatureServe(NS_RESULTS[1])).toEqual({
      uniqueId: 'ELEMENT_GLOBAL.2.105212',
      gRank: 'G5',
      sRankTx: 'SX',
    })
  })
})

describe('pickLatestIucnCategory', () => {
  it('prefers the latest assessment', () => {
    const category = pickLatestIucnCategory([
      { latest: false, red_list_category_code: 'VU' },
      { latest: true, red_list_category_code: 'EN' },
    ])
    expect(category).toBe('EN')
  })

  it('falls back to the first assessment when none is flagged latest', () => {
    expect(pickLatestIucnCategory([{ red_list_category_code: 'LC' }])).toBe(
      'LC',
    )
  })

  it('returns null for empty or missing assessments', () => {
    expect(pickLatestIucnCategory([])).toBeNull()
    expect(pickLatestIucnCategory(undefined)).toBeNull()
  })
})
