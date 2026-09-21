import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { IMRS_Gazetteer } from './IMRS_Gazetteer'

describe('IMRS_Gazetteer SSR', () => {
  // /gazetteer is a full-SSR route: the location list must be present in the
  // server HTML for search engines and screen readers. A client-only hook
  // anywhere in the tree throws during renderToString and empties the route.
  it('server-renders the location list', () => {
    const html = renderToString(<IMRS_Gazetteer />)
    expect(html).toContain('Echo Spring')
    expect(html).toContain('Corral Tank')
  })
})
