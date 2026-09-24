import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IMRS_SpeciesStatus } from './IMRS_SpeciesStatus'
import type { Species } from '@/types/species'

const speciesWith = (fields: Partial<Species>): Species => ({
  id: 1,
  ...fields,
})

describe('IMRS_SpeciesStatus', () => {
  it('renders nothing when all four sources are empty', () => {
    const { container } = render(
      <IMRS_SpeciesStatus species={speciesWith({})} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders all 4 rows, with "Not assessed" for the 3 absent sources', () => {
    render(
      <IMRS_SpeciesStatus species={speciesWith({ iucn_category: 'EN' })} />,
    )

    expect(screen.getAllByText('IUCN Red List').length).toBeGreaterThan(0)
    expect(screen.getByText('NatureServe Global')).toBeInTheDocument()
    expect(screen.getByText('NatureServe (Texas)')).toBeInTheDocument()
    expect(screen.getByText('Texas SGCN')).toBeInTheDocument()

    expect(screen.getAllByText('Not assessed')).toHaveLength(3)
    expect(
      screen.getByLabelText(/IUCN Red List: Endangered \(EN\)/),
    ).toBeInTheDocument()
  })
})
