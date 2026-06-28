import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConservationBadge } from './ConservationBadge'
import type { ConservationRank } from '@/lib/conservation'
import { normalizeRank } from '@/lib/conservation'

const rank = (
  source: Parameters<typeof normalizeRank>[0],
  code: string,
): ConservationRank => {
  const r = normalizeRank(source, code)
  if (!r) throw new Error(`unexpected null rank for ${code}`)
  return r
}

describe('ConservationBadge', () => {
  it('renders the raw code as visible text', () => {
    render(<ConservationBadge rank={rank('iucn', 'EN')} variant="compact" />)
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('shows the label text in the full variant', () => {
    render(<ConservationBadge rank={rank('iucn', 'EN')} variant="full" />)
    expect(screen.getByText('Endangered')).toBeInTheDocument()
  })

  it('exposes an accessible name with source + label + code (not color alone)', () => {
    render(<ConservationBadge rank={rank('iucn', 'EN')} />)
    expect(
      screen.getByLabelText('IUCN Red List: Endangered (EN)'),
    ).toBeInTheDocument()
  })

  it('applies the tier color class', () => {
    render(<ConservationBadge rank={rank('iucn', 'CR')} />)
    expect(screen.getByLabelText(/Critically Endangered/).className).toMatch(
      /bg-red-700/,
    )
  })

  it('uses the secure (green) class for a low-risk rank', () => {
    render(<ConservationBadge rank={rank('natureserve-global', 'G5')} />)
    expect(screen.getByLabelText(/Secure/).className).toMatch(/bg-green-700/)
  })

  it('uses the flag (teal) class for the binary SGCN designation', () => {
    render(<ConservationBadge rank={rank('texas-sgcn', 'SGCN')} />)
    expect(screen.getByLabelText(/Texas SGCN: Listed/).className).toMatch(
      /bg-teal-700/,
    )
  })
})
