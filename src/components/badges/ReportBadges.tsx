import type {
  Severity,
  ReportStatus,
  AccessibilityImpact,
  Report,
} from '../../data/mock'
import { severityLabels, statusLabels, accessibilityLabels } from '../../data/mock'
import { getVerificationLevel } from '../../lib/report-utils'

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`fw-badge fw-badge-severity-${severity}`}>
      <span className="fw-badge-dot" aria-hidden />
      {severityLabels[severity]}
    </span>
  )
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`fw-badge fw-badge-status-${status}`}>
      {statusLabels[status]}
    </span>
  )
}

export function AccessibilityBadge({ impact }: { impact: AccessibilityImpact }) {
  if (impact === 'none') return null
  return (
    <span className="fw-badge fw-badge-accessibility" title={accessibilityLabels[impact]}>
      <span aria-hidden>♿</span>
      {impact === 'blocked' ? 'Access blocked' : 'Partial access'}
    </span>
  )
}

export function VerificationBadge({ report }: { report: Report }) {
  const level = getVerificationLevel(report.confirmations)
  if (level === 'unverified') return null
  return (
    <span
      className={`fw-badge ${
        level === 'verified' ? 'fw-badge-verified-high' : 'fw-badge-verified-community'
      }`}
    >
      <CheckIcon />
      {level === 'verified' ? 'Highly verified' : 'Community verified'}
    </span>
  )
}

export function AvoidBadge() {
  return <span className="fw-badge fw-badge-avoid">Avoid area</span>
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
      <path
        d="M2.5 6l2 2 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
