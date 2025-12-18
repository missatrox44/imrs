export  const formatCoordinates = (lat: number, lon: number) => {
    return `${lat.toFixed(5)}°N, ${Math.abs(lon).toFixed(5)}°W`;
  };