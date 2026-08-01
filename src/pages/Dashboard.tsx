import { useState } from 'react'
import { Infobox, InfoboxRow } from '../components/Infobox'
import { IssueDot, StatusDot } from '../components/IssueMarker'
import {
  mockReports,
  dashboardStats,
  issueTypeLabels,
  statusLabels,
  Report,
  ReportStatus,
} from '../data/mock'

export function DashboardPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(mockReports[0])

  return (
    <div className="flex-1 flex flex-col min-h-0 min-h-dvh lg:min-h-0">
      <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--color-fw-divider)] shrink-0">
        <h1 className="text-base font-normal">Overview</h1>
        <span className="text-sm text-[var(--color-fw-text-secondary)]">Lagos · Today</span>
      </header>

      <div className="flex-1 overflow-hidden flex min-h-0">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total reports" value={dashboardStats.total} />
              <StatCard label="Active incidents" value={dashboardStats.active} />
              <StatCard label="Resolved" value={dashboardStats.resolved} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Heat map */}
              <section className="col-span-2 border border-[var(--color-fw-border)]">
                <h2 className="px-4 py-3 text-sm font-medium border-b border-[var(--color-fw-divider)]">
                  Heat map
                </h2>
                <div className="aspect-[16/9] fw-map-bg relative min-h-[280px]">
                  {mockReports.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedReport(r)}
                      className="absolute w-8 h-8 rounded-full opacity-60 hover:opacity-100 border-0 cursor-pointer -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: `${30 + i * 15}%`,
                        left: `${25 + i * 18}%`,
                        backgroundColor:
                          r.type === 'flooded'
                            ? 'var(--color-fw-flooded)'
                            : r.type === 'blocked'
                              ? 'var(--color-fw-blocked)'
                              : 'var(--color-fw-dumping)',
                      }}
                      aria-label={r.title}
                    />
                  ))}
                </div>
              </section>

              {/* By category */}
              <section className="border border-[var(--color-fw-border)]">
                <h2 className="px-4 py-3 text-sm font-medium border-b border-[var(--color-fw-divider)]">
                  Reports by category
                </h2>
                <ul className="p-4 space-y-4">
                  {dashboardStats.byCategory.map(({ type, count, pct }) => (
                    <li key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="inline-flex items-center gap-2">
                          <IssueDot type={type} />
                          {issueTypeLabels[type]}
                        </span>
                        <span className="text-[var(--color-fw-text-secondary)]">{count}</span>
                      </div>
                      <div className="h-2 bg-[var(--color-fw-divider)]">
                        <div
                          className="h-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor:
                              type === 'flooded'
                                ? 'var(--color-fw-flooded)'
                                : type === 'blocked'
                                  ? 'var(--color-fw-blocked)'
                                  : 'var(--color-fw-dumping)',
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Table */}
            <section className="border border-[var(--color-fw-border)]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-fw-divider)]">
                <h2 className="text-sm font-medium">Recent reports</h2>
                <button type="button" className="text-sm text-[var(--color-fw-link)] bg-transparent border-none cursor-pointer hover:underline">
                  Download CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-fw-divider)] bg-[var(--color-fw-surface-secondary)]">
                      <th className="text-left font-medium px-4 py-2.5 text-[var(--color-fw-text-secondary)]">ID</th>
                      <th className="text-left font-medium px-4 py-2.5 text-[var(--color-fw-text-secondary)]">Type</th>
                      <th className="text-left font-medium px-4 py-2.5 text-[var(--color-fw-text-secondary)]">Location</th>
                      <th className="text-left font-medium px-4 py-2.5 text-[var(--color-fw-text-secondary)]">LGA</th>
                      <th className="text-left font-medium px-4 py-2.5 text-[var(--color-fw-text-secondary)]">Status</th>
                      <th className="text-left font-medium px-4 py-2.5 text-[var(--color-fw-text-secondary)]">Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReports.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedReport(r)}
                        className={`border-b border-[var(--color-fw-divider)] cursor-pointer hover:bg-[var(--color-fw-surface-secondary)] ${
                          selectedReport?.id === r.id ? 'bg-[var(--color-fw-primary-container)]' : ''
                        }`}
                      >
                        <td className="px-4 py-2.5 text-[var(--color-fw-link)]">{r.id}</td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-2">
                            <IssueDot type={r.type} size={8} />
                            {issueTypeLabels[r.type]}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{r.location}</td>
                        <td className="px-4 py-2.5 text-[var(--color-fw-text-secondary)]">{r.lga}</td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5">
                            <StatusDot status={r.status} />
                            {statusLabels[r.status]}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[var(--color-fw-text-secondary)]">
                          {r.reportedAt.split(',')[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>

          {/* Detail panel */}
          {selectedReport && (
            <aside className="w-80 shrink-0 border-l border-[var(--color-fw-divider)] overflow-y-auto">
              <div className="p-4 border-b border-[var(--color-fw-divider)]">
                <h2 className="text-sm font-medium">{selectedReport.title}</h2>
                <p className="text-xs text-[var(--color-fw-text-secondary)] mt-1">
                  {selectedReport.id}
                </p>
              </div>
              <div className="aspect-video bg-[var(--color-fw-surface-secondary)] border-b border-[var(--color-fw-divider)] flex items-center justify-center text-xs text-[var(--color-fw-text-tertiary)]">
                Photo
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm leading-relaxed">{selectedReport.summary}</p>
                <Infobox>
                  <InfoboxRow
                    label="Status"
                    value={
                      <StatusSelect
                        status={selectedReport.status}
                        onChange={() => {}}
                      />
                    }
                  />
                  <InfoboxRow label="Type" value={issueTypeLabels[selectedReport.type]} />
                  <InfoboxRow label="Location" value={selectedReport.location} />
                  <InfoboxRow label="Confirmations" value={selectedReport.confirmations} />
                </Infobox>
                <div>
                  <label htmlFor="notes" className="text-xs text-[var(--color-fw-text-secondary)] block mb-1">
                    Internal notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Add note for response team…"
                    className="w-full border border-[var(--color-fw-border)] p-2 text-sm resize-none outline-none focus:border-[var(--color-fw-primary)]"
                  />
                </div>
                <button type="button" className="fw-btn-primary w-full">
                  Save changes
                </button>
              </div>
            </aside>
          )}
        </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[var(--color-fw-border)] p-4">
      <p className="text-3xl font-normal text-[var(--color-fw-text)]">
        {value.toLocaleString()}
      </p>
      <p className="text-sm text-[var(--color-fw-text-secondary)] mt-1">{label}</p>
    </div>
  )
}

function StatusSelect({
  status,
  onChange,
}: {
  status: ReportStatus
  onChange: (s: ReportStatus) => void
}) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as ReportStatus)}
      className="text-sm border border-[var(--color-fw-border)] bg-white px-2 py-1 outline-none focus:border-[var(--color-fw-primary)]"
    >
      <option value="received">Received</option>
      <option value="in_progress">In progress</option>
      <option value="resolved">Resolved</option>
    </select>
  )
}
