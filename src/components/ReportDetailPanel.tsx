import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../context/ReportsContext'
import { getStatusFootContent } from '../lib/report-utils'
import type { Report, ReportStatus } from '../data/mock'
import { issueTypeLabels, statusLabels } from '../data/mock'
import { HazardSummary } from './HazardSummary'
import { PanelCollapseButton } from './map/NearbyPanelRail'
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
  onCollapse?: () => void
  showFullPageLink?: boolean
}

const statusSteps: { key: ReportStatus; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'in_progress', label: 'Responding' },
  { key: 'resolved', label: 'Cleared' },
]

const statusStepIndex: Record<ReportStatus, number> = {
  received: 0,
  in_progress: 1,
  resolved: 2,
}

const statusRailFill: Record<ReportStatus, number> = {
  received: 0,
  in_progress: 50,
  resolved: 100,
}

function StepCheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FootCheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FootGovIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 2.5v1M3.5 10h5M4.5 4.5h3L7.5 10h-3L4.5 4.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FootNeutralIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6 4v2.5l1.5 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function ReportStatusProgress({ report }: { report: Report }) {
  const status = report.status
  const current = statusStepIndex[status]

  return (
    <div className="fw-status-stepper" aria-label={`Status: ${statusLabels[status]}`}>
      <div className="fw-status-stepper-rail" aria-hidden>
        <div
          className="fw-status-stepper-rail-fill"
          style={{ width: `${statusRailFill[status]}%` }}
        />
      </div>

      <div className="fw-status-stepper-steps">
        {statusSteps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={step.key} className="fw-status-stepper-step">
              <div
                className={`fw-status-stepper-dot ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}
              >
                {done ? <StepCheckIcon /> : i + 1}
              </div>
              <span
                className={`fw-status-stepper-label ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusUpdateRow({ report }: { report: Report }) {
  const status = report.status
  const { primary, secondary, variant, statusLabel, tooltip } = getStatusFootContent(report)

  const FootIcon =
    variant === 'check' ? FootCheckIcon : variant === 'gov' ? FootGovIcon : FootNeutralIcon

  return (
    <div className="fw-status-update-card">
      <div className={`fw-status-stepper-foot-icon fw-status-stepper-foot-icon--${variant}`}>
        <FootIcon />
      </div>
      <div className="fw-status-stepper-foot-body min-w-0 flex-1">
        <p className="fw-status-stepper-foot-primary">{primary}</p>
        {secondary && (
          <p className="fw-status-stepper-foot-secondary">{secondary}</p>
        )}
      </div>
      <span
        className={`fw-status-stepper-status-pill fw-status-stepper-status-pill--${status}`}
        tabIndex={0}
        data-tooltip={tooltip}
        aria-label={`Status: ${statusLabel}. ${tooltip}`}
      >
        {statusLabel}
      </span>
    </div>
  )
}

function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="fw-detail-section">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fw-detail-section-trigger"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <h3 className="fw-type-title">{title}</h3>
          {subtitle && !open && (
            <p className="fw-type-meta mt-1 truncate">{subtitle}</p>
          )}
        </div>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="fw-detail-section-body">{children}</div>}
    </section>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 text-[var(--color-fw-text-tertiary)] transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CommunitySection({ report }: { report: Report }) {
  const { confirmReport, addComment, hasConfirmed } = useReports()
  const confirmed = hasConfirmed(report.id)
  const [showForm, setShowForm] = useState(false)
  const [commentText, setCommentText] = useState('')

  const commentCount = report.comments.length
  const subtitle =
    commentCount > 0
      ? `${report.confirmations} confirmations · ${commentCount} comment${commentCount === 1 ? '' : 's'}`
      : `${report.confirmations} confirmations`

  const handleSubmit = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    addComment(report.id, trimmed)
    setCommentText('')
    setShowForm(false)
  }

  const handleCancel = () => {
    setCommentText('')
    setShowForm(false)
  }

  return (
    <CollapsibleSection title="Community" subtitle={subtitle} defaultOpen={commentCount > 0}>
      <p className="fw-type-body text-[var(--color-fw-text-secondary)] mb-4">
        <strong className="text-[var(--color-fw-text)] font-semibold">
          {report.confirmations}
        </strong>{' '}
        people confirmed this report
      </p>
      <button
        type="button"
        onClick={() => confirmReport(report.id)}
        disabled={confirmed}
        className="fw-btn-primary w-full disabled:opacity-70"
      >
        {confirmed ? '✓ You confirmed this issue' : 'Confirm this issue'}
      </button>

      {commentCount > 0 && (
        <ul className="mt-4 space-y-2.5" aria-label="Community comments">
          {report.comments.map((c) => (
            <li
              key={c.id}
              className={`fw-comment-card ${c.author === 'You' ? 'fw-comment-card--yours' : ''}`}
            >
              <p className="fw-type-caption normal-case tracking-normal">
                {c.author} · {c.time}
              </p>
              <p className="fw-type-body">{c.text}</p>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <form
          className="fw-comment-form mt-3"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <label htmlFor={`comment-${report.id}`} className="sr-only">
            Add a comment
          </label>
          <textarea
            id={`comment-${report.id}`}
            rows={3}
            maxLength={280}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share an update for others nearby…"
            className="fw-comment-input"
            autoFocus
          />
          <div className="flex items-center justify-between gap-3 mt-2">
            <p className="fw-type-caption normal-case tracking-normal text-[var(--color-fw-text-tertiary)]">
              {commentText.length} / 280
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="fw-comment-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="fw-comment-submit"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-3 fw-type-body font-medium text-[var(--color-fw-link)] bg-transparent border-none cursor-pointer p-0 hover:underline"
        >
          Add comment
        </button>
      )}
    </CollapsibleSection>
  )
}

export function ReportDetailPanel({
  report,
  onClose,
  onCollapse,
  showFullPageLink = true,
}: ReportDetailPanelProps) {
  const latestUpdate =
    report.govResponses[0]?.message ??
    report.timeline[report.timeline.length - 1]?.title ??
    statusLabels[report.status]

  const detailsSubtitle =
    report.summary.length > 72 ? `${report.summary.slice(0, 72)}…` : report.summary

  return (
    <div className="flex flex-col h-full fw-panel-enter overflow-x-hidden min-w-0">
      <header className="fw-panel-header shrink-0 overflow-x-hidden px-5 pt-4 pb-3 space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="fw-detail-cancel"
            aria-label="Back to list"
          >
            Back
          </button>
          <div className="flex-1 min-w-0 text-center px-2">
            <p className="fw-type-caption">{issueTypeLabels[report.type]}</p>
            <h2 className="fw-type-display truncate mt-0.5">{report.location}</h2>
          </div>
          <span className="w-[3.75rem] shrink-0 flex justify-end">
            {onCollapse && <PanelCollapseButton onClick={onCollapse} />}
          </span>
        </div>

        <ReportStatusProgress report={report} />
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 px-4 py-4 space-y-3">
        <HazardSummary report={report} />
        <StatusUpdateRow report={report} />

        <CollapsibleSection title="Details" subtitle={detailsSubtitle}>
          <p className="fw-type-body text-[var(--color-fw-text-secondary)]">{report.summary}</p>

          {report.photoCount > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: Math.min(report.photoCount, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 border border-[var(--color-fw-divider)]"
                    role="img"
                    aria-label={`Report photo ${i + 1}`}
                  />
                ))}
              </div>
              <p className="fw-type-caption mt-2 normal-case tracking-normal">
                {report.photoCount} photo{report.photoCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
            <VerificationBadge report={report} />
            <AccessibilityBadge impact={report.accessibilityImpact} />
            {report.avoidArea && report.status !== 'resolved' && <AvoidBadge />}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Updates"
          subtitle={latestUpdate}
          defaultOpen={report.govResponses.length > 0}
        >
          {report.govResponses.length > 0 && (
            <div className="space-y-3 mb-5">
              {report.govResponses.map((g) => (
                <div
                  key={g.id}
                  className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2"
                >
                  <p className="fw-type-meta font-semibold text-blue-900">{g.agency}</p>
                  <p className="fw-type-body">{g.message}</p>
                  <p className="fw-type-caption normal-case tracking-normal">{g.timestamp}</p>
                </div>
              ))}
            </div>
          )}

          <ReportTimeline events={report.timeline} />
        </CollapsibleSection>

        <CommunitySection report={report} />

        {showFullPageLink && (
          <div className="pt-1 pb-4">
            <Link
              to={`/reports/${report.id}`}
              className="block text-center fw-type-body text-[var(--color-fw-link)] py-2"
            >
              Open full report page
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
