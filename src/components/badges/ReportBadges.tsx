import type {
  Severity,
  ReportStatus,
  AccessibilityImpact,
  Report,
} from '../../data/mock'
import { severityLabels, statusLabels, accessibilityLabels } from '../../data/mock'
import { getVerificationLevel, verificationLabels } from '../../lib/report-utils'

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`fw-badge fw-badge-severity-${severity}`}>
      <span aria-hidden>{getSeverityIcon(severity)}</span>
      {severityLabels[severity]}
    </span>
  )
}

function getSeverityIcon(severity: Severity): string {
  const icons: Record<Severity, string> = {
    low: '●',
    moderate: '◆',
    high: '▲',
    critical: '⬤',
  }
  return icons[severity]
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  const colors: Record<ReportStatus, string> = {
    received: 'bg-blue-50 text-blue-800',
    in_progress: 'bg-amber-50 text-amber-900',
    resolved: 'bg-emerald-50 text-emerald-800',
  }
  return (
    <span className={`fw-badge ${colors[status]}`}>
      {statusLabels[status]}
    </span>
  )
}

export function AccessibilityBadge({ impact }: { impact: AccessibilityImpact }) {
  if (impact === 'none') return null
  return (
    <span
      className="fw-badge bg-[#1d1d1f] text-white"
      title={accessibilityLabels[impact]}
    >
      <span aria-hidden>♿</span>
      {accessibilityLabels[impact]}
    </span>
  )
}

export function VerificationBadge({ report }: { report: Report }) {
  const level = getVerificationLevel(report.confirmations)
  if (level === 'unverified') return null
  const styles =
    level === 'verified'
      ? 'bg-emerald-50 text-emerald-800'
      : 'bg-blue-50 text-blue-800'
  return (
    <span className={`fw-badge ${styles}`}>
      ✓ {verificationLabels[level]}
    </span>
  )
}

export function AvoidBadge() {
  return (
    <span className="fw-badge bg-red-100 text-red-900">
      ⚠ Avoid area
    </span>
  )
}
