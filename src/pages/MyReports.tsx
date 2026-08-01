import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { NearbyReportCard } from '../components/NearbyReportCard'
import { PageShell } from '../components/PageHeader'
import {
  ReportStatusFilter,
  type StatusFilter,
} from '../components/report/ReportStatusFilter'
import { useReports } from '../context/ReportsContext'

export function MyReportsPage() {
  const { reports } = useReports()
  const [filter, setFilter] = useState<StatusFilter>('all')

  const filtered = useMemo(
    () =>
      reports.filter((r) => {
        if (filter === 'all') return true
        if (filter === 'active') return r.status !== 'resolved'
        return r.status === 'resolved'
      }),
    [filter, reports]
  )

  return (
    <PageShell bodyClassName="flex flex-col overflow-hidden">
      <header className="fw-panel-header shrink-0 overflow-x-hidden">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-6">
          <div className="min-w-0">
            <h1 className="fw-type-display truncate">
              {filtered.length} report{filtered.length === 1 ? '' : 's'}
            </h1>
            <p className="fw-type-meta mt-1">Submitted by you</p>
          </div>
        </div>
        <div className="px-5 pt-1 pb-4 lg:px-5" data-tour="my-reports-filter">
          <ReportStatusFilter value={filter} onChange={setFilter} reports={reports} />
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 pt-5 pb-6 space-y-3.5"
        aria-label="My reports"
      >
        {filtered.length === 0 ? (
          <EmptyState
            title="No reports here"
            description={
              filter === 'all'
                ? 'You have not submitted any issues yet. Report flooding or drainage problems nearby.'
                : 'No reports match this filter. Try another or submit a new issue.'
            }
            action={
              <Link to="/report" className="fw-btn-primary no-underline hover:no-underline">
                Report issue
              </Link>
            }
          />
        ) : (
          filtered.map((report) => (
            <NearbyReportCard key={report.id} report={report} />
          ))
        )}
      </div>
    </PageShell>
  )
}
