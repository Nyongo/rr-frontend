/**
 * Default on-screen span for tracking-style maps (~Uber / ride-hailing context).
 * The visible map is fit so roughly this many km fit across width and height.
 */
export const DEFAULT_MAP_SPAN_KM = 2;

const KM_PER_DEG_LAT = 111.32;

/**
 * Axis-aligned bounds (~spanKm × spanKm) centered on (lat, lng).
 * Uses a spherical approximation suitable for city-scale views.
 */
export function getBoundsForSquareSpanKm(
  lat: number,
  lng: number,
  spanKm: number
): { north: number; south: number; east: number; west: number } {
  const halfKm = spanKm / 2;
  const latDelta = halfKm / KM_PER_DEG_LAT;
  const cosLat = Math.cos((lat * Math.PI) / 180);
  const lngDelta = halfKm / (KM_PER_DEG_LAT * Math.max(Math.abs(cosLat), 0.15));

  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lng + lngDelta,
    west: lng - lngDelta,
  };
}

/**
 * Fits the map so approximately `spanKm` × `spanKm` is visible (like a 2 km window).
 */
export function fitMapToSquareSpanKm(
  map: any,
  lat: number,
  lng: number,
  spanKm: number = DEFAULT_MAP_SPAN_KM,
  padding: number | Record<string, number> = 32
): void {
  if (!window.google?.maps) return;

  const b = getBoundsForSquareSpanKm(lat, lng, spanKm);
  const bounds = new window.google.maps.LatLngBounds(
    { lat: b.south, lng: b.west },
    { lat: b.north, lng: b.east }
  );
  map.fitBounds(bounds, padding);
}
