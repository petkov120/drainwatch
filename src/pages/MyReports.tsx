import { useState } from 'react'
import { ReportRow } from '../components/ReportRow'
import { PageHeader, PageShell } from '../components/PageHeader'
import { mockReports, ReportStatus } from '../data/mock'

type Filter = 'all' | ReportStatus

export function MyReportsPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = mockReports.filter((r) =>
    filter === 'all' ? true : r.status === filter
  )

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'received', label: 'Active' },
    { key: 'resolved', label: 'Resolved' },
  ]

  return (
    <PageShell header={<PageHeader title="My reports" subtitle="Reports you have submitted" />}>
      <div className="max-w-3xl mx-auto lg:max-w-2xl px-4 py-6 lg:py-6">
        <h1 className="text-xl font-bold lg:hidden">My reports</h1>

        <nav className="flex gap-4 mt-4 lg:mt-0 border-b border-[var(--color-fw-divider)]" aria-label="Filter reports">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`pb-2 text-sm bg-transparent border-none cursor-pointer -mb-px ${
                filter === key
                  ? 'text-[var(--color-fw-text)] border-b-2 border-[var(--color-fw-text)]'
                  : 'text-[var(--color-fw-link)]'
              }`}
            >
              {label}
              {key === 'received' && ` (${mockReports.filter((r) => r.status !== 'resolved').length})`}
              {key === 'resolved' && ` (${mockReports.filter((r) => r.status === 'resolved').length})`}
            </button>
          ))}
        </nav>

        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--color-fw-text-secondary)]">
            No reports yet. Tap Report to submit an issue.
          </p>
        ) : (
          <div className="mt-4 fw-panel-card">
            {filtered.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
