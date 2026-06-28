import { describe, expect, it } from 'vitest'
import {
  getConservationRanks,
  getMostAtRiskRank,
  normalizeRank,
} from './conservation'
import type { Species } from '@/types/species'

const speciesWith = (fields: Partial<Species>): Species => ({
  id: 1,
  ...fields,
})

describe('normalizeRank', () => {
  it.each([
    ['G1', 1, 'critical'],
    ['G2', 2, 'high'],
    ['G3', 3, 'moderate'],
    ['G4', 4, 'secure'],
    ['G5', 5, 'secure'],
    ['GX', 1, 'critical'],
    ['GH', 1, 'critical'],
    ['GNR', 0, 'unknown'],
    ['GU', 0, 'unknown'],
    ['GNA', 0, 'unknown'],
  ] as const)('maps NatureServe global %s', (code, severity, tier) => {
    const rank = normalizeRank('natureserve-global', code)
    expect(rank?.severity).toBe(severity)
    expect(rank?.tier).toBe(tier)
  })

  it.each([
    ['S1', 1, 'critical'],
    ['S2', 2, 'high'],
    ['S3', 3, 'moderate'],
    ['S4', 4, 'secure'],
    ['S5', 5, 'secure'],
    ['SX', 1, 'critical'],
    ['SH', 1, 'critical'],
    ['SNR', 0, 'unknown'],
  ] as const)('maps NatureServe Texas %s', (code, severity, tier) => {
    const rank = normalizeRank('natureserve-tx', code)
    expect(rank?.severity).toBe(severity)
    expect(rank?.tier).toBe(tier)
  })

  it.each([
    ['EX', 1, 'critical'],
    ['EW', 1, 'critical'],
    ['CR', 1, 'critical'],
    ['EN', 2, 'high'],
    ['VU', 3, 'moderate'],
    ['NT', 4, 'secure'],
    ['LC', 5, 'secure'],
    ['DD', 0, 'unknown'],
    ['NE', 0, 'unknown'],
  ] as const)('maps IUCN %s', (code, severity, tier) => {
    const rank = normalizeRank('iucn', code)
    expect(rank?.severity).toBe(severity)
    expect(rank?.tier).toBe(tier)
  })

  it('takes the more at-risk number for a rounded range', () => {
    expect(normalizeRank('natureserve-global', 'G2G3')?.severity).toBe(2)
    expect(normalizeRank('natureserve-global', 'G4G5')?.severity).toBe(4)
  })

  it('is case- and whitespace-insensitive', () => {
    expect(normalizeRank('iucn', ' en ')?.code).toBe('EN')
    expect(normalizeRank('natureserve-global', 'g1')?.severity).toBe(1)
  })

  it('returns null for absent or unrecognized codes', () => {
    expect(normalizeRank('iucn', null)).toBeNull()
    expect(normalizeRank('iucn', undefined)).toBeNull()
    expect(normalizeRank('iucn', '')).toBeNull()
    expect(normalizeRank('iucn', 'ZZ')).toBeNull()
    expect(normalizeRank('natureserve-global', 'X1')).toBeNull()
  })

  it('carries a human-readable label', () => {
    expect(normalizeRank('iucn', 'EN')?.label).toBe('Endangered')
    expect(normalizeRank('natureserve-global', 'G1')?.label).toBe(
      'Critically Imperiled',
    )
    expect(normalizeRank('natureserve-tx', 'SX')?.label).toBe(
      'Presumed Extirpated',
    )
  })

  it('maps Texas SGCN to a binary flag (severity 0, flag tier)', () => {
    const rank = normalizeRank('texas-sgcn', 'SGCN')
    expect(rank).toMatchObject({
      source: 'texas-sgcn',
      code: 'SGCN',
      severity: 0,
      tier: 'flag',
      label: 'Listed',
    })
  })

  it('returns null for an absent SGCN flag', () => {
    expect(normalizeRank('texas-sgcn', null)).toBeNull()
    expect(normalizeRank('texas-sgcn', '')).toBeNull()
  })
})

describe('getConservationRanks', () => {
  it('returns ranks in fixed order IUCN → Global → Texas, skipping absent', () => {
    const ranks = getConservationRanks(
      speciesWith({
        iucn_category: 'EN',
        natureserve_srank_tx: 'S2',
      }),
    )
    expect(ranks.map((r) => r.source)).toEqual(['iucn', 'natureserve-tx'])
  })

  it('includes not-evaluated ranks (informative on the detail page)', () => {
    const ranks = getConservationRanks(
      speciesWith({ natureserve_grank: 'GNR' }),
    )
    expect(ranks).toHaveLength(1)
    expect(ranks[0].tier).toBe('unknown')
  })

  it('appends the SGCN flag in last position', () => {
    const ranks = getConservationRanks(
      speciesWith({ iucn_category: 'EN', texas_sgcn: 'SGCN' }),
    )
    expect(ranks.map((r) => r.source)).toEqual(['iucn', 'texas-sgcn'])
  })

  it('returns an empty array when there is no data', () => {
    expect(getConservationRanks(speciesWith({}))).toEqual([])
  })
})

describe('getMostAtRiskRank', () => {
  it('picks the most at-risk rank across sources', () => {
    const rank = getMostAtRiskRank(
      speciesWith({ iucn_category: 'LC', natureserve_grank: 'G1' }),
    )
    expect(rank?.source).toBe('natureserve-global')
    expect(rank?.severity).toBe(1)
  })

  it('breaks ties by source order (IUCN wins)', () => {
    const rank = getMostAtRiskRank(
      speciesWith({ iucn_category: 'EN', natureserve_grank: 'G2' }),
    )
    expect(rank?.source).toBe('iucn')
  })

  it('ignores not-evaluated ranks', () => {
    expect(
      getMostAtRiskRank(speciesWith({ natureserve_grank: 'GNR' })),
    ).toBeNull()
  })

  it('returns null when there is no evaluated rank', () => {
    expect(getMostAtRiskRank(speciesWith({}))).toBeNull()
  })

  it('ignores the binary SGCN flag (kept off the grid badge)', () => {
    expect(getMostAtRiskRank(speciesWith({ texas_sgcn: 'SGCN' }))).toBeNull()
  })
})
