import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { IMRS_ScientificName } from './IMRS_ScientificName'

const italics = (name: string) =>
  [
    ...render(<IMRS_ScientificName name={name} />).container.querySelectorAll(
      'i',
    ),
  ].map((el) => el.textContent)

describe('IMRS_ScientificName', () => {
  it('italicizes both words of a binomial', () => {
    expect(italics('Canis latrans')).toEqual(['Canis', 'latrans'])
  })

  it('keeps "sp." roman', () => {
    const { container } = render(<IMRS_ScientificName name="Anax sp." />)
    expect(container.textContent).toBe('Anax sp.')
    expect(italics('Anax sp.')).toEqual(['Anax'])
  })

  it('drops a trailing space from an empty epithet', () => {
    const { container } = render(<IMRS_ScientificName name="Ursus " />)
    expect(container.textContent).toBe('Ursus')
  })
})
