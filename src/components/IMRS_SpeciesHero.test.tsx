import { describe, expect, it } from 'vitest'
import { getSpeciesTitle } from './IMRS_SpeciesHero'
import type { Species } from '@/types/species'

const species = (fields: Partial<Species>) =>
  ({ kingdom: 'Animalia', ...fields }) as Species

describe('getSpeciesTitle', () => {
  it('uses the common name with the binomial as subtitle', () => {
    expect(
      getSpeciesTitle(
        species({
          genus: 'Sus',
          species: 'scrofa',
          species_common_name: 'Feral Pig',
        }),
      ),
    ).toEqual({
      heading: 'Feral Pig',
      headingIsScientific: false,
      subtitle: 'Sus scrofa',
      subtitleIsScientific: true,
    })
  })

  it('uses the binomial when there is no common name', () => {
    expect(
      getSpeciesTitle(species({ genus: 'Epicauta', species: 'atrivittata' })),
    ).toEqual({
      heading: 'Epicauta atrivittata',
      headingIsScientific: true,
      subtitle: null,
      subtitleIsScientific: false,
    })
  })

  it('falls back to fixed text with the lowest rank in title case', () => {
    expect(
      getSpeciesTitle(
        species({
          order_name: 'ARANEAE',
          family: 'GNAPHOSIDAE',
          family_common_name: 'Ground Spider Family',
        }),
      ),
    ).toEqual({
      heading: 'Unidentified Specimen',
      headingIsScientific: false,
      subtitle: 'Gnaphosidae (family)',
      subtitleIsScientific: false,
    })
  })

  it('falls back to the order when there is no family', () => {
    expect(
      getSpeciesTitle(species({ order_name: 'PSEUDOSCORPIONES' })).subtitle,
    ).toBe('Pseudoscorpiones (order)')
  })
})
