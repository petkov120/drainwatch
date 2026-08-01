import { Link } from 'react-router-dom'
import type { Report } from '../data/mock'
import { issueTypeLabels, statusLabels } from '../data/mock'
import { getSeverityColor } from '../lib/report-utils'
import {
  SeverityBadge,
  StatusBadge,
  AccessibilityBadge,
  VerificationBadge,
  AvoidBadge,
} from './badges/ReportBadges'

interface ReportCardProps {
  report: Report
  showDistance?: string
  distanceBearing?: string
  selected?: boolean
  onSelect?: (id: string) => void
  index?: number
  variant?: 'full' | 'compact'
}

export function ReportCard({
  report,
  showDistance,
  distanceBearing,
  selected,
  onSelect,
  index = 0,
  variant = 'full',
}: ReportCardProps) {
  const className = `${
    variant === 'compact' ? 'fw-report-card-compact' : 'fw-report-card'
  } w-full text-left no-underline hover:no-underline ${selected ? 'fw-report-card-selected' : ''}`

  const content =
    variant === 'compact' ? (
      <CompactReportCardContent
        report={report}
        distanceBearing={distanceBearing ?? showDistance}
      />
    ) : (
      <FullReportCardContent
        report={report}
        distanceBearing={distanceBearing}
        showDistance={showDistance}
      />
    )

  if (onSelect) {
    return (
      <button
        type="button"
        role="option"
        aria-selected={selected}
        aria-label={`${report.location}, ${report.severity} severity`}
        onClick={() => onSelect(report.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(report.id)
          }
        }}
        className={`${className} border-none bg-transparent`}
        tabIndex={selected ? 0 : -1}
        id={`report-option-${index}`}
      >
        {content}
      </button>
    )
  }

  return (
    <Link to={`/reports/${report.id}`} className={`${className} block`}>
      {content}
    </Link>
  )
}

function FullReportCardContent({
  report,
  distanceBearing,
  showDistance,
}: {
  report: Report
  distanceBearing?: string
  showDistance?: string
}) {
  return (
    <>
      <ReportThumb report={report} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-fw-text-tertiary)]">
            {issueTypeLabels[report.type]}
          </span>
          <SeverityBadge severity={report.severity} />
        </div>

        <h3 className="text-[15px] font-semibold text-[var(--color-fw-text)] leading-snug truncate">
          {report.location}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <StatusBadge status={report.status} />
          <VerificationBadge report={report} />
          {report.accessibilityImpact !== 'none' && (
            <AccessibilityBadge impact={report.accessibilityImpact} />
          )}
          {report.avoidArea && report.status !== 'resolved' && <AvoidBadge />}
        </div>

        <p className="text-[13px] text-[var(--color-fw-text-secondary)] mt-2 font-mono tracking-tight">
          {report.reportedAt.split(',')[0]}
          {(distanceBearing || showDistance) && (
            <>
              <span aria-hidden> · </span>
              <span className="text-[var(--color-fw-text)] font-semibold">
                {distanceBearing ?? showDistance}
              </span>
            </>
          )}
          <span aria-hidden> · </span>
          {report.confirmations} confirmed
        </p>
      </div>
    </>
  )
}

function CompactReportCardContent({
  report,
  distanceBearing,
}: {
  report: Report
  distanceBearing?: string
}) {
  const isActive = report.status !== 'resolved'
  const severityColor = getSeverityColor(report.severity)

  return (
    <>
      <ReportThumb report={report} size="sm" severityColor={severityColor} />
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-[14px] font-semibold text-[var(--color-fw-text)] leading-tight truncate">
          {report.location}
        </h3>
        <p className="text-[12px] text-[var(--color-fw-text-secondary)] mt-0.5 truncate">
          {[distanceBearing, issueTypeLabels[report.type], statusLabels[report.status]]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
      {isActive && (report.avoidArea || report.severity === 'critical') && (
        <span
          className="shrink-0 self-center text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-red-50 text-red-700"
          aria-label="Avoid this area"
        >
          Avoid
        </span>
      )}
    </>
  )
}

function ReportThumb({
  report,
  size,
  severityColor,
}: {
  report: Report
  size: 'sm' | 'md'
  severityColor?: string
}) {
  const dimensions = size === 'sm' ? 'w-[68px] h-[52px] rounded-lg' : 'w-14 h-14 rounded-xl'

  return (
    <div
      className={`${dimensions} shrink-0 bg-[var(--color-fw-surface-secondary)] border border-[var(--color-fw-divider)] flex items-center justify-center overflow-hidden relative`}
      style={severityColor ? { boxShadow: `inset 3px 0 0 ${severityColor}` } : undefined}
      aria-hidden
    >
      {report.photoCount > 0 ? (
        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="1" />
          </svg>
        </div>
      ) : (
        <IssueTypeIcon type={report.type} />
      )}
    </div>
  )
}

function IssueTypeIcon({ type }: { type: Report['type'] }) {
  const colors = { flooded: '#0071e3', blocked: '#7c3aed', dumping: '#b45309' }
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: colors[type] }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        {type === 'flooded' && <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />}
        {type === 'blocked' && <rect x="6" y="6" width="12" height="12" rx="1" />}
        {type === 'dumping' && <path d="M6 8h12l-1.5 10H7.5L6 8z" />}
      </svg>
    </div>
  )
}
