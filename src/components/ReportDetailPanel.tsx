import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Report } from '../data/mock'
import { issueTypeLabels } from '../data/mock'
import { HazardSummary } from './HazardSummary'
import { ReportTimeline } from './ReportTimeline'
import {
  SeverityBadge,
  StatusBadge,
  AccessibilityBadge,
  VerificationBadge,
  AvoidBadge,
} from './badges/ReportBadges'

interface ReportDetailPanelProps {
  report: Report
  onClose: () => void
}

export function ReportDetailPanel({ report, onClose }: ReportDetailPanelProps) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="flex flex-col h-full fw-panel-enter">
      <header className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 shrink-0 border-b border-[var(--color-fw-divider)]">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-medium text-[var(--color-fw-link)] bg-transparent border-none cursor-pointer p-0 mb-2 hover:underline"
          >
            ← Back to list
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-fw-text-tertiary)]">
            {issueTypeLabels[report.type]}
          </p>
          <h2 className="text-[18px] font-bold text-[var(--color-fw-text)] leading-snug mt-0.5">
            {report.location}
          </h2>
          <p className="text-[12px] text-[var(--color-fw-text-tertiary)] mt-1">{report.id}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="fw-float-btn w-9 h-9 shrink-0 text-lg border-none"
          aria-label="Close report details"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Hero: immediate answer — should I avoid? */}
        <div className="p-4">
          <HazardSummary report={report} />
        </div>

        {/* Photo strip */}
        {report.photoCount > 0 && (
          <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: Math.min(report.photoCount, 4) }).map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-24 shrink-0 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 border border-[var(--color-fw-divider)]"
                  role="img"
                  aria-label={`Report photo ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-[12px] text-[var(--color-fw-text-tertiary)] mt-2">
              {report.photoCount} photo{report.photoCount !== 1 ? 's' : ''} submitted
            </p>
          </div>
        )}

        {/* Badges row */}
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
          <VerificationBadge report={report} />
          <AccessibilityBadge impact={report.accessibilityImpact} />
          {report.avoidArea && report.status !== 'resolved' && <AvoidBadge />}
        </div>

        {/* Summary */}
        <Section title="What happened">
          <p className="text-[14px] leading-relaxed text-[var(--color-fw-text-secondary)]">
            {report.summary}
          </p>
        </Section>

        {/* Government response — prominent when present */}
        {report.govResponses.length > 0 && (
          <Section title="Official response">
            {report.govResponses.map((g) => (
              <div
                key={g.id}
                className="p-4 bg-blue-50 border border-blue-100 rounded-xl"
              >
                <p className="text-[13px] font-semibold text-blue-900">{g.agency}</p>
                <p className="text-[14px] text-[var(--color-fw-text)] mt-2 leading-relaxed">
                  {g.message}
                </p>
                <p className="text-[12px] text-[var(--color-fw-text-tertiary)] mt-2">
                  {g.timestamp}
                </p>
              </div>
            ))}
          </Section>
        )}

        {/* Timeline — progressive disclosure of history */}
        <Section title="Progress">
          <ReportTimeline events={report.timeline} />
        </Section>

        {/* Community */}
        <Section title="Community">
          <p className="text-[14px] text-[var(--color-fw-text-secondary)] mb-3">
            <strong className="text-[var(--color-fw-text)]">{report.confirmations}</strong>{' '}
            people confirmed this report
          </p>
          <button
            type="button"
            onClick={() => setConfirmed(true)}
            disabled={confirmed}
            className="fw-btn-primary w-full disabled:opacity-70"
          >
            {confirmed ? '✓ You confirmed this issue' : 'Confirm this issue'}
          </button>

          {report.comments.length > 0 && (
            <ul className="mt-4 space-y-3" aria-label="Community comments">
              {report.comments.map((c) => (
                <li
                  key={c.id}
                  className="p-3 bg-[var(--color-fw-surface-secondary)] rounded-xl"
                >
                  <p className="text-[12px] text-[var(--color-fw-text-tertiary)]">
                    {c.author} · {c.time}
                  </p>
                  <p className="text-[14px] mt-1">{c.text}</p>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className="mt-3 text-[14px] font-medium text-[var(--color-fw-link)] bg-transparent border-none cursor-pointer p-0 hover:underline"
          >
            Add comment
          </button>
        </Section>

        <div className="px-4 pb-6">
          <Link
            to={`/reports/${report.id}`}
            className="block text-center text-[14px] text-[var(--color-fw-link)] py-3"
          >
            Open full report page
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-4 pb-5 border-b border-[var(--color-fw-divider)] mb-5 last:border-b-0">
      <h3 className="text-[15px] font-semibold text-[var(--color-fw-text)] mb-3">{title}</h3>
      {children}
    </section>
  )
}
