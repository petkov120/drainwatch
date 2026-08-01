import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import { Report } from '../data/mock'
import { issueTypeLabels, severityLabels } from '../data/mock'
import { createReportMarkerIcon } from './map/markerFactory'
import { getMarkerAriaLabel } from '../lib/report-utils'
import { ScaleBarBridge } from './map/ScaleBar'

export const LAGOS_CENTER: [number, number] = [6.5244, 3.3792]
export const DEFAULT_USER_LOCATION: [number, number] = [6.4474, 3.4620]

/** Carto Voyager — warmer, richer cartography than light_all */
export const BASEMAP_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

function MapController({
  selectedReport,
  fitAll,
}: {
  selectedReport: Report | null
  fitAll: Report[]
}) {
  const map = useMap()
  const initialFitDone = useRef(false)

  useEffect(() => {
    if (selectedReport) {
      map.flyTo([selectedReport.lat, selectedReport.lng], 15, { duration: 0.5 })
    }
  }, [selectedReport, map])

  useEffect(() => {
    if (initialFitDone.current || fitAll.length === 0 || selectedReport) return
    initialFitDone.current = true
    const bounds = L.latLngBounds(fitAll.map((r) => [r.lat, r.lng]))
    map.fitBounds(bounds.pad(0.15), { duration: 0.5 })
  }, [selectedReport, fitAll, map])

  return null
}

function getUserPosition(): Promise<[number, number]> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_USER_LOCATION)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => resolve(DEFAULT_USER_LOCATION),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

function RecenterController({
  recenterToken,
  onUserLocation,
}: {
  recenterToken: number
  onUserLocation: (pos: [number, number]) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (recenterToken === 0) return
    let cancelled = false
    getUserPosition().then((pos) => {
      if (cancelled) return
      onUserLocation(pos)
      map.flyTo(pos, 15, { duration: 0.5 })
    })
    return () => {
      cancelled = true
    }
  }, [recenterToken, map, onUserLocation])

  return null
}

function MarkerClusterGroup({
  reports,
  selectedId,
  onSelectReport,
}: {
  reports: Report[]
  selectedId: string | null
  onSelectReport: (id: string) => void
}) {
  const map = useMap()

  useEffect(() => {
    const cluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    })

    reports.forEach((report) => {
      const marker = L.marker([report.lat, report.lng], {
        icon: createReportMarkerIcon(report, report.id === selectedId),
        alt: getMarkerAriaLabel(report),
      })

      const tooltipHtml = `
        <div style="padding:12px;font-family:Inter,system-ui,sans-serif;min-width:180px;">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:#86868b;margin-bottom:4px;">
            ${issueTypeLabels[report.type]}
          </div>
          <div style="font-size:14px;font-weight:600;color:#1d1d1f;margin-bottom:6px;">
            ${report.location}
          </div>
          <div style="font-size:12px;color:#6e6e73;">
            ${severityLabels[report.severity]} · ${report.confirmations} confirmations
          </div>
        </div>
      `

      marker.bindTooltip(tooltipHtml, {
        className: 'fw-map-tooltip',
        direction: 'top',
        offset: [0, -20],
      })

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e.originalEvent)
        onSelectReport(report.id)
      })

      cluster.addLayer(marker)
    })

    map.addLayer(cluster)
    return () => {
      map.removeLayer(cluster)
    }
  }, [map, reports, selectedId, onSelectReport])

  return null
}

function MapClickHandler({ onClear }: { onClear: () => void }) {
  const map = useMap()
  useEffect(() => {
    map.on('click', onClear)
    return () => {
      map.off('click', onClear)
    }
  }, [map, onClear])
  return null
}

interface MapViewProps {
  reports: Report[]
  selectedId: string | null
  onSelectReport: (id: string) => void
  onClearSelection: () => void
  recenterToken?: number
  onUserLocation?: (pos: [number, number]) => void
  onScaleChange?: (label: string, widthPx: number) => void
}

export function MapView({
  reports,
  selectedId,
  onSelectReport,
  onClearSelection,
  recenterToken = 0,
  onUserLocation,
  onScaleChange,
}: MapViewProps) {
  const selectedReport = reports.find((r) => r.id === selectedId) ?? null
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_USER_LOCATION)

  const handleUserLocation = useCallback(
    (pos: [number, number]) => {
      setUserLocation(pos)
      onUserLocation?.(pos)
    },
    [onUserLocation]
  )

  const handleScale = useCallback(
    (label: string, widthPx: number) => {
      onScaleChange?.(label, widthPx)
    },
    [onScaleChange]
  )

  return (
    <MapContainer
      center={LAGOS_CENTER}
      zoom={12}
      className="h-full w-full z-0"
      zoomControl={false}
      aria-label="Flood and drainage reports map"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
        url={BASEMAP_URL}
      />

      <MapController selectedReport={selectedReport} fitAll={reports} />
      <RecenterController recenterToken={recenterToken} onUserLocation={handleUserLocation} />
      {onScaleChange && <ScaleBarBridge onScale={handleScale} />}
      <MarkerClusterGroup
        reports={reports}
        selectedId={selectedId}
        onSelectReport={onSelectReport}
      />

      <CircleMarker
        center={userLocation}
        radius={9}
        pathOptions={{
          color: '#ffffff',
          weight: 3,
          fillColor: '#0071e3',
          fillOpacity: 1,
        }}
      />

      <MapClickHandler onClear={onClearSelection} />
    </MapContainer>
  )
}
