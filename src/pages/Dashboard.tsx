import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { NearbyReportCard } from '../components/NearbyReportCard'
import { DashboardReportPanel } from '../components/dashboard/DashboardReportPanel'
import { PageShell } from '../components/PageHeader'
import { IssueSceneThumb } from '../components/map/IssueSceneThumb'
import { useReports } from '../context/ReportsContext'
import { issueTypeLabels, type IssueType, type Report } from '../data/mock'

const categoryRing: Record<IssueType, string> = {
  flooded: '#0071e3',
  blocked: '#7c3aed',
  dumping: '#b45309',
}

export function DashboardPage() {
  const { reports, updateStatus } = useReports()
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? '')

  const selectedReport = reports.find((r) => r.id === selectedId) ?? reports[0] ?? null

  useEffect(() => {
    if (!reports.some((r) => r.id === selectedId) && reports[0]) {
      setSelectedId(reports[0].id)
    }
  }, [reports, selectedId])

  const liveStats = useMemo(
    () => ({
      total: reports.length,
      active: reports.filter((r) => r.status !== 'resolved').length,
      resolved: reports.filter((r) => r.status === 'resolved').length,
      responding: reports.filter((r) => r.status === 'in_progress').length,
    }),
    [reports]
  )

  const byCategory = useMemo(() => {
    const counts: Record<IssueType, number> = { flooded: 0, blocked: 0, dumping: 0 }
    for (const r of reports) counts[r.type]++
    const total = reports.length || 1
    return (['flooded', 'blocked', 'dumping'] as const).map((type) => ({
      type,
      count: counts[type],
      pct: Math.round((counts[type] / total) * 100),
    }))
  }, [reports])

  const mapPositions = useMemo(() => projectReportsToMap(reports), [reports])

  return (
    <PageShell bodyClassName="flex flex-col overflow-hidden">
      <header className="fw-panel-header shrink-0 overflow-x-hidden px-5 py-4 lg:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="fw-type-display truncate">Operations dashboard</h1>
            <p className="fw-type-meta mt-1">Lagos · Today · changes sync to Nearby</p>
          </div>
          <span className="fw-dashboard-live-pill shrink-0">Live demo</span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 lg:px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total reports" value={liveStats.total} tone="neutral" />
            <StatCard label="Active" value={liveStats.active} tone="primary" />
            <StatCard label="Responding" value={liveStats.responding} tone="warning" />
            <StatCard label="Cleared" value={liveStats.resolved} tone="success" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <section className="fw-panel-card overflow-hidden xl:col-span-3">
              <div className="px-4 py-3 border-b border-[var(--color-fw-divider)] bg-[var(--color-fw-surface-secondary)]">
                <h2 className="fw-type-title">Incident map</h2>
                <p className="fw-type-meta mt-0.5">Tap a marker to inspect</p>
              </div>
              <div className="aspect-[16/10] min-h-[220px] fw-map-bg relative overflow-hidden">
                <div className="absolute inset-0 fw-map-vignette pointer-events-none opacity-70" aria-hidden />
                {mapPositions.map(({ report, top, left }) => {
                  const selected = report.id === selectedId
                  const color =
                    report.type === 'flooded'
                      ? 'var(--color-fw-flooded)'
                      : report.type === 'blocked'
                        ? 'var(--color-fw-blocked)'
                        : 'var(--color-fw-dumping)'
                  return (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => setSelectedId(report.id)}
                      aria-label={report.location}
                      aria-pressed={selected}
                      className={`fw-dashboard-map-marker ${selected ? 'is-selected' : ''}`}
                      style={
                        {
                          top: `${top}%`,
                          left: `${left}%`,
                          '--marker-color': color,
                        } as CSSProperties
                      }
                    />
                  )
                })}
              </div>
            </section>

            <section className="fw-panel-card overflow-hidden xl:col-span-2">
              <div className="px-4 py-3 border-b border-[var(--color-fw-divider)] bg-[var(--color-fw-surface-secondary)]">
                <h2 className="fw-type-title">By category</h2>
              </div>
              <ul className="p-4 space-y-4">
                {byCategory.map(({ type, count, pct }) => (
                  <li key={type}>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-[12px] shrink-0 overflow-hidden border"
                        style={{ borderColor: `${categoryRing[type]}33` }}
                      >
                        <IssueSceneThumb scene={type} size={40} className="w-full h-full block" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        <span className="fw-type-body truncate">{issueTypeLabels[type]}</span>
                        <span className="fw-type-meta shrink-0">{count}</span>
                      </div>
                    </div>
                    <div className="fw-dashboard-bar-track">
                      <div
                        className="fw-dashboard-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: categoryRing[type],
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <div className="flex items-end justify-between gap-3 mb-3 px-0.5">
              <div>
                <h2 className="fw-type-title">Queue</h2>
                <p className="fw-type-meta mt-0.5">{reports.length} reports · select to update status</p>
              </div>
            </div>
            <div className="space-y-3.5">
              {reports.map((report, i) => (
                <NearbyReportCard
                  key={report.id}
                  report={report}
                  selected={selectedId === report.id}
                  onSelect={setSelectedId}
                  index={i}
                />
              ))}
            </div>
          </section>

          {selectedReport && (
            <div className="lg:hidden fw-panel-card overflow-hidden">
              <DashboardReportPanel
                report={selectedReport}
                onStatusChange={(status) => updateStatus(selectedReport.id, status)}
              />
            </div>
          )}
        </main>

        {selectedReport && (
          <aside className="hidden lg:flex w-[min(24rem,34vw)] shrink-0 border-l border-[var(--color-fw-divider)] overflow-hidden">
            <DashboardReportPanel
              report={selectedReport}
              onStatusChange={(status) => updateStatus(selectedReport.id, status)}
            />
          </aside>
        )}
      </div>
    </PageShell>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'neutral' | 'primary' | 'warning' | 'success'
}) {
  return (
    <div className={`fw-dashboard-stat fw-dashboard-stat--${tone}`}>
      <p className="fw-dashboard-stat-value">{value.toLocaleString()}</p>
      <p className="fw-type-meta mt-1">{label}</p>
    </div>
  )
}

function projectReportsToMap(reports: Report[]) {
  if (reports.length === 0) return []

  const lats = reports.map((r) => r.lat)
  const lngs = reports.map((r) => r.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const spanLat = maxLat - minLat || 0.02
  const spanLng = maxLng - minLng || 0.02

  return reports.map((report) => ({
    report,
    top: 12 + ((maxLat - report.lat) / spanLat) * 76,
    left: 12 + ((report.lng - minLng) / spanLng) * 76,
  }))
}
