import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { formatScale } from '../../lib/geo-utils'

export function ScaleBarDisplay({
  label,
  widthPx,
}: {
  label: string
  widthPx: number
}) {
  return (
    <div className="fw-glass-chip px-3 py-2">
      <div className="fw-scale-bar" role="img" aria-label={`Map scale: ${label}`}>
        <div className="fw-scale-line" style={{ width: widthPx }} />
        <span className="fw-scale-label">{label}</span>
      </div>
    </div>
  )
}

export function ScaleBarBridge({
  onScale,
}: {
  onScale: (label: string, widthPx: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    const update = () => {
      const y = map.getSize().y / 2
      const meters = map.distance(
        map.containerPointToLatLng([0, y]),
        map.containerPointToLatLng([100, y])
      )
      const { label, widthPx } = formatScale(meters)
      onScale(label, widthPx)
    }
    map.on('zoomend moveend resize', update)
    update()
    return () => {
      map.off('zoomend moveend resize', update)
    }
  }, [map, onScale])

  return null
}
