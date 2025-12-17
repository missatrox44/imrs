export function getPhotoUrl(photos?: Array<{ url: string }>): string | null {
  if (!photos || photos.length === 0) return null

  const url = photos[0]?.url
  if (!url) return null

  return url.replace('square', 'medium')
}
