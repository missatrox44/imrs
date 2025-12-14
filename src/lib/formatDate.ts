export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date'

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
