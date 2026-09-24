export const formatElevation = (meters?: number): string => {
  if (meters === undefined) {
    return 'Unknown elevation'
  }

  return `${meters.toLocaleString()} m`
}
