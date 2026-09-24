import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IMRS_TaxonRankGroup } from './IMRS_TaxonRankGroup'
import type { RankOption } from '@/types/speciesIndex'

const options = (n: number): Array<RankOption> =>
  Array.from({ length: n }, (_, i) => ({ value: `Genus${i}`, count: i + 1 }))

describe('IMRS_TaxonRankGroup', () => {
  it('shows no filter input with 10 or fewer options', () => {
    render(
      <IMRS_TaxonRankGroup
        label="Genus"
        pluralLabel="Genera"
        options={options(10)}
        value={undefined}
        onChange={vi.fn()}
        defaultOpen
      />,
    )
    expect(
      screen.queryByPlaceholderText('Filter genera…'),
    ).not.toBeInTheDocument()
  })

  it('shows a filter input with more than 10 options', () => {
    render(
      <IMRS_TaxonRankGroup
        label="Genus"
        pluralLabel="Genera"
        options={options(11)}
        value={undefined}
        onChange={vi.fn()}
        defaultOpen
      />,
    )
    expect(screen.getByPlaceholderText('Filter genera…')).toBeInTheDocument()
  })

  it('filters options by substring while keeping the selected one visible', async () => {
    const user = userEvent.setup()
    render(
      <IMRS_TaxonRankGroup
        label="Genus"
        pluralLabel="Genera"
        options={options(11)}
        value="Genus0"
        onChange={vi.fn()}
        defaultOpen
      />,
    )
    await user.type(screen.getByPlaceholderText('Filter genera…'), 'Genus1')

    expect(screen.getByText('Genus1')).toBeInTheDocument()
    expect(screen.getByText('Genus10')).toBeInTheDocument()
    expect(screen.getByText('Genus0')).toBeInTheDocument()
    expect(screen.queryByText('Genus2')).not.toBeInTheDocument()
  })

  it('calls onChange with the option value when an option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <IMRS_TaxonRankGroup
        label="Genus"
        pluralLabel="Genera"
        options={options(3)}
        value={undefined}
        onChange={onChange}
        defaultOpen
      />,
    )

    await user.click(screen.getByText('Genus1'))
    expect(onChange).toHaveBeenCalledWith('Genus1')
  })

  it('calls onChange with null when "All …" is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <IMRS_TaxonRankGroup
        label="Genus"
        pluralLabel="Genera"
        options={options(3)}
        value="Genus1"
        onChange={onChange}
        defaultOpen
      />,
    )

    await user.click(screen.getByText('All Genera'))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('renders options as radio inputs', () => {
    render(
      <IMRS_TaxonRankGroup
        label="Genus"
        pluralLabel="Genera"
        options={options(3)}
        value={undefined}
        onChange={vi.fn()}
        defaultOpen
      />,
    )
    // 3 options + "All Genera" row
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })
})
