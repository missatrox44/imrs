export function getSoundUrl(
  sounds?: Array<{
    file_url?: string | null
    file_content_type?: string | null
    hidden?: boolean | null
  }> | null,
): { url: string; type: string | undefined } | null {
  if (!sounds) return null

  const sound = sounds.find((s) => s.file_url && !s.hidden)
  if (!sound?.file_url) return null

  return { url: sound.file_url, type: sound.file_content_type ?? undefined }
}
