import { useState } from 'react'
import { ReportRow } from '../components/ReportRow'
import { PageHeader, PageShell } from '../components/PageHeader'
import { useReports } from '../context/ReportsContext'
import { ReportStatus } from '../data/mock'

type Filter = 'all' | ReportStatus

export function MyReportsPage() {
  const { reports } = useReports()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = reports.filter((r) =>
    filter === 'all' ? true : r.status === filter
  )

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'received', label: 'Active' },
    { key: 'resolved', label: 'Resolved' },
  ]

  return (
    <PageShell header={<PageHeader title="My reports" subtitle="Reports you have submitted" />}>
      <div className="max-w-3xl mx-auto lg:max-w-2xl">
        <h1 className="fw-type-display lg:hidden mb-6">My reports</h1>

        <nav className="flex gap-5 mb-6 border-b border-[var(--color-fw-divider)]" aria-label="Filter reports">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`pb-3 fw-type-nav bg-transparent border-none cursor-pointer -mb-px ${
                filter === key
                  ? 'text-[var(--color-fw-text)] border-b-2 border-[var(--color-fw-text)]'
                  : 'text-[var(--color-fw-link)]'
              }`}
            >
              {label}
              {key === 'received' && ` (${reports.filter((r) => r.status !== 'resolved').length})`}
              {key === 'resolved' && ` (${reports.filter((r) => r.status === 'resolved').length})`}
            </button>
          ))}
        </nav>

        {filtered.length === 0 ? (
          <p className="mt-10 fw-type-body text-[var(--color-fw-text-secondary)]">
            No reports yet. Tap Report to submit an issue.
          </p>
        ) : (
          <div className="fw-panel-card">
            {filtered.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
