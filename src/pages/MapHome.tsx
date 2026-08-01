import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { ReportCard } from '../components/ReportCard'
import { MapView, DEFAULT_USER_LOCATION } from '../components/MapView'
import { ReportDetailPanel } from '../components/ReportDetailPanel'
import { MapLegend } from '../components/MapLegend'
import { EmptyState, ReportListSkeleton } from '../components/EmptyState'
import { MapOverlayNav } from '../components/map/MapOverlayNav'
import { CompassControl } from '../components/map/CompassControl'
import { ScaleBarDisplay } from '../components/map/ScaleBar'
import { IssueType, mockReports } from '../data/mock'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { formatDistanceBearing } from '../lib/geo-utils'

type FilterType = 'all' | IssueType

export function MapHomePage() {
  const isDesktop = useIsDesktop()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<FilterType>('all')
  const [recenterToken, setRecenterToken] = useState(0)
  const [isLocating, setIsLocating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_USER_LOCATION)
  const [scaleLabel, setScaleLabel] = useState('500 m')
  const [scaleWidth, setScaleWidth] = useState(80)
  const [drawerOpen, setDrawerOpen] = useState(true)

  const selectedId = searchParams.get('report')
  const selectedReport = mockReports.find((r) => r.id === selectedId) ?? null

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const filteredReports = useMemo(
    () => (filter === 'all' ? mockReports : mockReports.filter((r) => r.type === filter)),
    [filter]
  )

  const selectReport = useCallback(
    (id: string) => {
      const idx = filteredReports.findIndex((r) => r.id === id)
      if (idx >= 0) setFocusedIndex(idx)
      setDrawerOpen(true)
      if (isDesktop) {
        setSearchParams({ report: id }, { replace: true })
      } else {
        navigate(`/reports/${id}`)
      }
    },
    [isDesktop, navigate, setSearchParams, filteredReports]
  )

  const clearSelection = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const handleRecenter = useCallback(() => {
    clearSelection()
    setIsLocating(true)
    setRecenterToken((t) => t + 1)
    window.setTimeout(() => setIsLocating(false), 800)
  }, [clearSelection])

  const handleScaleChange = useCallback((label: string, widthPx: number) => {
    setScaleLabel(label)
    setScaleWidth(widthPx)
  }, [])

  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isDesktop || filteredReports.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((i) => Math.min(i + 1, filteredReports.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        selectReport(filteredReports[focusedIndex].id)
      } else if (e.key === 'Escape') {
        clearSelection()
      }
    },
    [isDesktop, filteredReports, focusedIndex, selectReport, clearSelection]
  )

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'flooded', label: 'Flooded' },
    { key: 'blocked', label: 'Blocked' },
    { key: 'dumping', label: 'Dumping' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed map */}
      <div className="absolute inset-0">
        <MapView
          reports={filteredReports}
          selectedId={selectedId}
          onSelectReport={selectReport}
          onClearSelection={clearSelection}
          recenterToken={recenterToken}
          onUserLocation={setUserLocation}
          onScaleChange={handleScaleChange}
        />
      </div>

      {/* Cartographic vignette */}
      <div className="absolute inset-0 fw-map-vignette z-[1] pointer-events-none" aria-hidden />

      {/* Overlay nav */}
      <MapOverlayNav />

      {/* Desktop search — glass, top center-right area */}
      <div className="hidden lg:block absolute top-4 z-[400] w-72" style={{ right: 'calc(420px + 2rem)' }}>
        <SearchBar className="fw-glass-chip border-none shadow-[var(--shadow-fw-float)]" />
      </div>

      {/* Mobile search */}
      <div className="lg:hidden absolute top-4 inset-x-4 z-[400] pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar className="fw-glass-chip border-none" />
        </div>
      </div>

      {/* Cartographic instruments — bottom left */}
      <div className="absolute bottom-6 left-4 z-[400] flex flex-col gap-3 items-start pointer-events-none">
        <div className="pointer-events-auto hidden lg:block">
          <ScaleBarDisplay label={scaleLabel} widthPx={scaleWidth} />
        </div>
        <div className="pointer-events-auto hidden lg:block">
          <MapLegend />
        </div>
      </div>

      {/* Map controls — bottom right: compass + recenter + report */}
      <div className="absolute bottom-20 lg:bottom-6 right-4 z-[400] flex flex-col gap-2 items-center pointer-events-auto">
        <CompassControl onResetNorth={handleRecenter} />
        <button
          type="button"
          onClick={handleRecenter}
          className={`fw-float-btn fw-glass-chip border-none ${isLocating ? 'ring-2 ring-[var(--color-fw-primary)] text-[var(--color-fw-primary)]' : ''}`}
          aria-label="Recenter map on your location"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
        <Link
          to="/report"
          className="hidden lg:flex fw-btn-primary no-underline hover:no-underline w-11 h-11 p-0 items-center justify-center"
          aria-label="Report an issue"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      </div>

      {/* Floating glass drawer — overlays map */}
      <aside
        className={`absolute z-[450] flex flex-col pointer-events-auto transition-transform duration-300 ease-out
          inset-x-0 bottom-0 max-h-[52dvh]
          lg:inset-x-auto lg:bottom-4 lg:top-4 lg:right-4 lg:left-auto lg:w-[400px] lg:max-h-none
          ${drawerOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-[calc(100%+1rem)]'}
        `}
        aria-label="Nearby reports"
      >
        <div className="fw-glass-drawer fw-glass-panel flex-1 flex flex-col min-h-0 shadow-[var(--shadow-fw-lg)]">
          {selectedReport && isDesktop ? (
            <ReportDetailPanel report={selectedReport} onClose={clearSelection} />
          ) : (
            <>
              <div className="lg:hidden pt-2 pb-1 shrink-0 flex justify-center">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className="w-10 h-1 bg-[var(--color-fw-border)] rounded-full border-none cursor-pointer"
                  aria-label={drawerOpen ? 'Collapse panel' : 'Expand panel'}
                />
              </div>

              <div className="px-4 pt-2 lg:pt-4 pb-3 shrink-0 border-b border-white/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight">Nearby</h2>
                    <p className="text-[13px] text-[var(--color-fw-text-secondary)]">
                      {filteredReports.length} reports · Lagos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full hover:bg-white/50 border-none bg-transparent cursor-pointer text-[var(--color-fw-text-secondary)]"
                    aria-label="Hide panel"
                  >
                    →
                  </button>
                </div>

                <div className="flex gap-2 mt-3 overflow-x-auto pb-1" role="tablist">
                  {filters.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={filter === key}
                      onClick={() => setFilter(key)}
                      className={`px-3 py-1 text-[12px] font-medium rounded-full whitespace-nowrap transition-all border-none cursor-pointer ${
                        filter === key
                          ? 'bg-[var(--color-fw-text)] text-white'
                          : 'bg-white/60 text-[var(--color-fw-text-secondary)] hover:bg-white/90'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto min-h-0"
                role="listbox"
                aria-label="Report list"
                onKeyDown={handleListKeyDown}
                tabIndex={0}
              >
                {isLoading ? (
                  <ReportListSkeleton />
                ) : filteredReports.length === 0 ? (
                  <EmptyState
                    title="No reports here"
                    description="No issues match this filter. Try another or report a new issue."
                    action={
                      <Link to="/report" className="fw-btn-primary no-underline hover:no-underline">
                        Report issue
                      </Link>
                    }
                  />
                ) : (
                  filteredReports.map((report, i) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      distanceBearing={formatDistanceBearing(userLocation, [report.lat, report.lng])}
                      selected={selectedId === report.id || focusedIndex === i}
                      onSelect={isDesktop ? selectReport : undefined}
                      index={i}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Show drawer toggle when hidden on desktop */}
      {!drawerOpen && isDesktop && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="hidden lg:flex absolute top-4 right-4 z-[450] fw-glass-chip px-4 py-2 text-[13px] font-semibold border-none cursor-pointer"
        >
          Nearby ({filteredReports.length})
        </button>
      )}
    </div>
  )
}
