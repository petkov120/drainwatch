import { Link } from 'react-router-dom'
import type { Report } from '../data/mock'
import { issueTypeLabels } from '../data/mock'
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
}

export function ReportCard({
  report,
  showDistance,
  distanceBearing,
  selected,
  onSelect,
  index = 0,
}: ReportCardProps) {
  const className = `fw-report-card w-full text-left no-underline hover:no-underline ${
    selected ? 'fw-report-card-selected' : ''
  }`

  const content = (
    <>
      <div
        className="w-14 h-14 shrink-0 rounded-xl bg-[var(--color-fw-surface-secondary)] border border-[var(--color-fw-divider)] flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        {report.photoCount > 0 ? (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="1" />
            </svg>
            {report.photoCount > 1 && (
              <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-black/50 text-white px-1 rounded">
                {report.photoCount}
              </span>
            )}
          </div>
        ) : (
          <IssueTypeIcon type={report.type} />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="fw-type-caption">
            {issueTypeLabels[report.type]}
          </span>
          <SeverityBadge severity={report.severity} />
        </div>

        <h3 className="fw-type-title truncate">
          {report.location}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <StatusBadge status={report.status} />
          <VerificationBadge report={report} />
          {report.accessibilityImpact !== 'none' && (
            <AccessibilityBadge impact={report.accessibilityImpact} />
          )}
          {report.avoidArea && report.status !== 'resolved' && <AvoidBadge />}
        </div>

        <p className="fw-type-meta font-mono tracking-tight pt-0.5">
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
