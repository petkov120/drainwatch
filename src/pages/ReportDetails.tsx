import { Link, Navigate, useParams } from 'react-router-dom'
import { HazardSummary } from '../components/HazardSummary'
import { ReportTimeline } from '../components/ReportTimeline'
import {
  SeverityBadge,
  StatusBadge,
  AccessibilityBadge,
  VerificationBadge,
  AvoidBadge,
} from '../components/badges/ReportBadges'
import { useReports } from '../context/ReportsContext'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { issueTypeLabels } from '../data/mock'

export function ReportDetailsPage() {
  const { id } = useParams()
  const isDesktop = useIsDesktop()
  const { reports, getReport, confirmReport, hasConfirmed } = useReports()

  if (isDesktop && id) {
    return <Navigate to={`/?report=${id}`} replace />
  }

  const report = (id ? getReport(id) : undefined) ?? reports[0]
  const confirmed = hasConfirmed(report.id)

  return (
    <div className="flex-1 overflow-y-auto bg-white pb-8">
      <article className="max-w-lg mx-auto">
        <header className="px-4 pt-4 pb-3 border-b border-[var(--color-fw-divider)] sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <Link to="/" className="text-[14px] font-medium text-[var(--color-fw-link)]">
            ← Nearby
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-fw-text-tertiary)] mt-3">
            {issueTypeLabels[report.type]}
          </p>
          <h1 className="text-[22px] font-bold tracking-tight leading-snug mt-1">
            {report.location}
          </h1>
        </header>

        <div className="px-4 pt-4 space-y-6">
          <HazardSummary report={report} />

          <div className="flex flex-wrap gap-2">
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
            <VerificationBadge report={report} />
            <AccessibilityBadge impact={report.accessibilityImpact} />
            {report.avoidArea && report.status !== 'resolved' && <AvoidBadge />}
          </div>

          {report.photoCount > 0 && (
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 border border-[var(--color-fw-divider)]" />
          )}

          <section>
            <h2 className="text-[15px] font-semibold mb-2">What happened</h2>
            <p className="text-[15px] leading-relaxed text-[var(--color-fw-text-secondary)]">
              {report.summary}
            </p>
          </section>

          {report.govResponses.map((g) => (
            <section key={g.id} className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-[13px] font-semibold text-blue-900">{g.agency}</p>
              <p className="text-[15px] mt-2 leading-relaxed">{g.message}</p>
              <p className="text-[12px] text-[var(--color-fw-text-tertiary)] mt-2">{g.timestamp}</p>
            </section>
          ))}

          <section>
            <h2 className="text-[15px] font-semibold mb-3">Progress</h2>
            <ReportTimeline events={report.timeline} />
          </section>

          <section>
            <h2 className="text-[15px] font-semibold mb-2">Community</h2>
            <p className="text-[14px] text-[var(--color-fw-text-secondary)] mb-4">
              {report.confirmations} confirmations
            </p>
            <button
              type="button"
              onClick={() => confirmReport(report.id)}
              disabled={confirmed}
              className="fw-btn-primary w-full disabled:opacity-70"
            >
              {confirmed ? '✓ You confirmed this issue' : 'Confirm this issue'}
            </button>
          </section>
        </div>
      </article>
    </div>
  )
}
