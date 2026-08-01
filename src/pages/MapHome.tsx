import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { NearbyReportCard } from '../components/NearbyReportCard'
import { MapView, DEFAULT_USER_LOCATION } from '../components/MapView'
import { ReportDetailPanel } from '../components/ReportDetailPanel'
import { MapLegend } from '../components/MapLegend'
import { EmptyState, ReportListSkeleton } from '../components/EmptyState'
import { MapOverlayNav } from '../components/map/MapOverlayNav'
import { MapUtilityBar } from '../components/map/MapUtilityBar'
import { MapToolPill } from '../components/map/MapToolPill'
import { ReportMascotFab } from '../components/map/ReportMascotFab'
import { IssueTypeFilter } from '../components/map/IssueTypeFilter'
import { NearbyPanelRail, PanelCollapseButton } from '../components/map/NearbyPanelRail'
import { ScaleBarDisplay } from '../components/map/ScaleBar'
import { useReports } from '../context/ReportsContext'
import type { IssueType } from '../data/mock'
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
  const [panelCollapsed, setPanelCollapsed] = useState(false)

  const { reports, getReport } = useReports()
  const selectedId = searchParams.get('report')
  const selectedReport = selectedId ? getReport(selectedId) ?? null : null

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const filteredReports = useMemo(
    () => (filter === 'all' ? reports : reports.filter((r) => r.type === filter)),
    [filter, reports]
  )

  const openReportPage = useCallback(
    (id: string) => {
      navigate(`/reports/${id}`)
    },
    [navigate]
  )

  const selectReport = useCallback(
    (id: string) => {
      const idx = filteredReports.findIndex((r) => r.id === id)
      if (idx >= 0) setFocusedIndex(idx)
      setDrawerOpen(true)
      setPanelCollapsed(false)
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

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed map */}
      <div className="absolute inset-0">
        <MapView
          reports={filteredReports}
          selectedId={selectedId}
          onSelectReport={openReportPage}
          onClearSelection={clearSelection}
          recenterToken={recenterToken}
          onUserLocation={setUserLocation}
          onScaleChange={handleScaleChange}
        />
      </div>

      {/* Cartographic vignette */}
      <div className="absolute inset-0 fw-map-vignette z-[1] pointer-events-none" aria-hidden />

      {/* Overlay nav — split floating pills */}
      <MapOverlayNav />

      {/* Top-right utilities — search + profile */}
      <MapUtilityBar
        style={{
          right:
            isDesktop && !panelCollapsed
              ? 'calc(400px + 2rem)'
              : isDesktop && panelCollapsed
                ? 'calc(3.75rem + 1.25rem)'
                : '1rem',
        }}
      />

      {/* Mobile search */}
      <div className="lg:hidden absolute top-4 inset-x-4 z-[400] pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar className="fw-glass-chip border-none" />
        </div>
      </div>

      {/* Bottom-left — stationed report mascot + map tools */}
      <div className="absolute bottom-20 lg:bottom-6 left-4 z-[400] flex flex-col items-start gap-3 pointer-events-none">
        <ReportMascotFab />
        <div className="flex items-end gap-2">
          <MapToolPill onRecenter={handleRecenter} isLocating={isLocating} />
          <div className="pointer-events-auto hidden lg:block">
            <ScaleBarDisplay label={scaleLabel} widthPx={scaleWidth} />
          </div>
          <div className="pointer-events-auto hidden lg:block">
            <MapLegend />
          </div>
        </div>
      </div>

      {/* Floating panel — nearby reports */}
      <aside
        className={`absolute z-[450] flex flex-col pointer-events-auto transition-all duration-300 ease-out
          inset-x-0 bottom-0 max-h-[52dvh]
          lg:inset-x-auto lg:bottom-4 lg:top-4 lg:right-4 lg:left-auto lg:max-h-none
          ${panelCollapsed ? 'lg:w-[3.75rem]' : 'lg:w-[400px]'}
          ${drawerOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-[calc(100%+1rem)]'}
        `}
        aria-label="Nearby reports"
        data-tour="nearby-panel"
      >
        <div className="fw-float-panel flex-1 flex flex-col min-h-0 overflow-x-hidden">
          {isDesktop && panelCollapsed ? (
            <NearbyPanelRail
              reports={filteredReports}
              selectedId={selectedId}
              onExpand={() => setPanelCollapsed(false)}
              onSelectReport={selectReport}
            />
          ) : selectedReport && isDesktop ? (
            <ReportDetailPanel
              report={selectedReport}
              onClose={clearSelection}
              onCollapse={() => setPanelCollapsed(true)}
            />
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

              <div className="fw-panel-header shrink-0 overflow-x-hidden lg:pt-2">
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <h2 className="fw-type-display">
                    {filteredReports.length} nearby
                  </h2>
                  <PanelCollapseButton onClick={() => setPanelCollapsed(true)} />
                </div>
                <div className="px-5 pt-1 pb-4" data-tour="issue-filter">
                  <IssueTypeFilter value={filter} onChange={setFilter} reports={reports} />
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 px-4 pt-5 pb-6 space-y-3.5"
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
                    <NearbyReportCard
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
    </div>
  )
}
