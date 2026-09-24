// Italicizes a genus or binomial by nomenclature convention; qualifiers such
// as "sp." and "cf." stay roman. Inherits font and color from the parent.
import { Fragment } from 'react'

const ROMAN_QUALIFIERS = new Set([
  'sp.',
  'spp.',
  'cf.',
  'aff.',
  'var.',
  'subsp.',
  'ssp.',
  '×',
])

export const IMRS_ScientificName = ({ name }: { name: string }) => (
  <>
    {name
      .trim()
      .split(/\s+/)
      .map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          {ROMAN_QUALIFIERS.has(word.toLowerCase()) ? word : <i>{word}</i>}
        </Fragment>
      ))}
  </>
)
