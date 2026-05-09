// export  const formatCoordinates = (lat: number, lon: number) => {
//     return `${lat.toFixed(5)}°N, ${Math.abs(lon).toFixed(5)}°W`;
//   };
export const formatCoordinates = (lat?: number, lon?: number): string => {
  if (lat === undefined || lon === undefined) {
    return 'Coordinates unavailable'
  }

  return `${lat.toFixed(5)}°N, ${Math.abs(lon).toFixed(5)}°W`
}
