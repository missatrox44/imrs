import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdvancedSearch } from './AdvancedSearch'
import type { Species } from '@/types/species'
import type { TaxonomicFilters } from '@/components/SpeciesIndex'

const EMPTY_FILTERS: TaxonomicFilters = {
  kingdom: null,
  phylum: null,
  class_name: null,
  order_name: null,
  family: null,
  genus: null,
}

const fixture: Array<Species> = [
  { id: 1, category: 'mammals', genus: 'Canis', species: 'lupus' },
  { id: 2, category: 'birds', genus: 'Falco', species: 'peregrinus' },
]

function renderAdvancedSearch(overrides: Partial<Parameters<typeof AdvancedSearch>[0]> = {}) {
  const props = {
    activeCategory: 'all' as const,
    onCategoryChange: vi.fn(),
    getCategoryCount: (cat: string) => (cat === 'all' ? 2 : cat === 'mammals' ? 1 : 0),
    species: fixture,
    taxonomicFilters: EMPTY_FILTERS,
    onTaxonomicFilterChange: vi.fn(),
    onResetFilters: vi.fn(),
    sortDirection: 'asc' as const,
    onSortChange: vi.fn(),
    ...overrides,
  }
  render(<AdvancedSearch {...props} />)
  return props
}

describe('AdvancedSearch', () => {
  it('renders the "All Species" button with the total count', () => {
    renderAdvancedSearch()
    expect(
      screen.getByRole('button', { name: /All Species \(2\)/i }),
    ).toBeInTheDocument()
  })

  it('renders a button for each category with its count', () => {
    renderAdvancedSearch()
    expect(
      screen.getByRole('button', { name: /^mammals \(1\)/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^birds \(0\)/i }),
    ).toBeInTheDocument()
  })

  it('calls onCategoryChange when a category button is clicked', async () => {
    const props = renderAdvancedSearch()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /^mammals \(1\)/i }))
    expect(props.onCategoryChange).toHaveBeenCalledWith('mammals')
  })

  it('calls onResetFilters when the reset button is clicked', async () => {
    const props = renderAdvancedSearch()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /reset filters/i }))
    expect(props.onResetFilters).toHaveBeenCalledTimes(1)
  })

  it('marks the active category button with the default variant', () => {
    renderAdvancedSearch({ activeCategory: 'mammals' })
    const mammalsBtn = screen.getByRole('button', { name: /^mammals \(1\)/i })
    const allBtn = screen.getByRole('button', { name: /All Species/i })
    // default variant uses bg-primary; outline does not
    expect(mammalsBtn.className).toMatch(/bg-primary/)
    expect(allBtn.className).not.toMatch(/bg-primary/)
  })
})
