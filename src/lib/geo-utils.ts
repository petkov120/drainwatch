/** Geographic helpers for map-native UI */

const R = 6371000 // Earth radius in metres

export function haversineDistance(
  from: [number, number],
  to: [number, number]
): number {
  const [lat1, lng1] = from
  const [lat2, lng2] = to
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function getBearing(from: [number, number], to: [number, number]): number {
  const [lat1, lng1] = from
  const [lat2, lng2] = to
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const

export function bearingToCardinal(bearing: number): string {
  return CARDINALS[Math.round(bearing / 45) % 8]
}

export function formatDistanceBearing(
  from: [number, number],
  to: [number, number]
): string {
  const d = haversineDistance(from, to)
  const b = bearingToCardinal(getBearing(from, to))
  return `${formatDistance(d)} · ${b}`
}

/** Format scale bar width for Leaflet */
export function formatScale(meters: number): { label: string; widthPx: number } {
  const nice = [50, 100, 200, 500, 1000, 2000, 5000, 10000]
  let chosen = nice[0]
  for (const n of nice) {
    if (meters >= n * 0.8) chosen = n
  }
  const label = chosen >= 1000 ? `${chosen / 1000} km` : `${chosen} m`
  const widthPx = Math.round((chosen / meters) * 100)
  return { label, widthPx: Math.min(Math.max(widthPx, 40), 120) }
}
