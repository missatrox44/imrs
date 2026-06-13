import { describe, expect, it } from 'vitest'
import { getSoundUrl } from './getSoundUrl'

describe('getSoundUrl', () => {
  it('returns null for undefined input', () => {
    expect(getSoundUrl()).toBeNull()
  })

  it('returns null for null input', () => {
    expect(getSoundUrl(null)).toBeNull()
  })

  it('returns null for an empty array', () => {
    expect(getSoundUrl([])).toBeNull()
  })

  it('skips sounds without a file_url', () => {
    expect(getSoundUrl([{ file_url: null }])).toBeNull()
  })

  it('skips hidden sounds', () => {
    expect(
      getSoundUrl([{ file_url: 'https://x/1.wav', hidden: true }]),
    ).toBeNull()
  })

  it('returns the url and content type of the first playable sound', () => {
    expect(
      getSoundUrl([
        { file_url: 'https://x/1.wav', file_content_type: 'audio/x-wav' },
      ]),
    ).toEqual({ url: 'https://x/1.wav', type: 'audio/x-wav' })
  })

  it('returns undefined type when file_content_type is missing', () => {
    expect(getSoundUrl([{ file_url: 'https://x/1.wav' }])).toEqual({
      url: 'https://x/1.wav',
      type: undefined,
    })
  })

  it('returns the first playable sound, skipping hidden ones', () => {
    expect(
      getSoundUrl([
        { file_url: 'https://x/hidden.wav', hidden: true },
        { file_url: 'https://x/good.wav', file_content_type: 'audio/mpeg' },
      ]),
    ).toEqual({ url: 'https://x/good.wav', type: 'audio/mpeg' })
  })
})
