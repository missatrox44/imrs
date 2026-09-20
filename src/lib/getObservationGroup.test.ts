import { describe, expect, it } from 'vitest'
import { getObservationGroup } from './getObservationGroup'
import { GROUP_TO_TAXON_ID } from '@/types/taxon'

describe('getObservationGroup', () => {
  it('prefers arachnid over the invertebrates subkingdom', () => {
    const ids = [
      48460,
      1,
      GROUP_TO_TAXON_ID.invertebrates!,
      GROUP_TO_TAXON_ID.arachnid!,
    ]
    expect(getObservationGroup(ids)).toBe('arachnid')
  })

  it('resolves plants from the kingdom id', () => {
    expect(getObservationGroup([48460, GROUP_TO_TAXON_ID.plants!])).toBe(
      'plants',
    )
  })

  it('returns null when no known group is present', () => {
    expect(getObservationGroup([48460, 1])).toBeNull()
    expect(getObservationGroup(null)).toBeNull()
    expect(getObservationGroup([])).toBeNull()
  })
})
