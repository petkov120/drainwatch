import { Link } from 'react-router-dom'
import type { Report, ReportStatus } from '../data/mock'
import { IssueSceneThumb } from './map/IssueSceneThumb'
import { getSeverityColor, getVerificationLevel } from '../lib/report-utils'

interface NearbyReportCardProps {
  report: Report
  distanceBearing?: string
  selected?: boolean
  onSelect?: (id: string) => void
  index?: number
}

const statusShort: Record<ReportStatus, string> = {
  received: 'Active',
  in_progress: 'Responding',
  resolved: 'Cleared',
}

const issueAccent: Record<Report['type'], string> = {
  flooded: '#0071e3',
  blocked: '#7c3aed',
  dumping: '#b45309',
}

export function NearbyReportCard({
  report,
  distanceBearing,
  selected,
  onSelect,
  index = 0,
}: NearbyReportCardProps) {
  const verified = getVerificationLevel(report.confirmations)
  const severityColor = getSeverityColor(report.severity)
  const accent = issueAccent[report.type]

  const meta = [
    distanceBearing,
    statusShort[report.status],
    verified !== 'unverified' ? `${report.confirmations} ✓` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const flags: string[] = []
  if (report.avoidArea && report.status !== 'resolved') flags.push('Avoid')
  if (report.accessibilityImpact === 'blocked') flags.push('♿ blocked')
  else if (report.accessibilityImpact === 'partial') flags.push('♿ partial')

  const className = `fw-nearby-card w-full text-left no-underline hover:no-underline ${
    selected ? 'fw-nearby-card-selected' : ''
  }`

  const content = (
    <>
      <ReportThumbnail report={report} severityColor={severityColor} accent={accent} />

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-0.5">
        <h3 className="fw-type-title truncate">{report.location}</h3>
        <p className="fw-type-meta truncate">{meta}</p>
        {flags.length > 0 && (
          <p className="text-[0.8125rem] font-semibold text-red-700 leading-snug truncate">{flags.join(' · ')}</p>
        )}
      </div>
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        role="option"
        aria-selected={selected}
        aria-label={`${report.location}, ${statusShort[report.status]}`}
        onClick={() => onSelect(report.id)}
        className={`${className} border-none`}
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

function ReportThumbnail({
  report,
  severityColor,
  accent,
}: {
  report: Report
  severityColor: string
  accent: string
}) {
  return (
    <div
      className="fw-nearby-card-thumb w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden relative"
      style={{ boxShadow: `inset 0 0 0 2.5px ${severityColor}` }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 z-[2]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />

      <IssueSceneThumb
        scene={report.type}
        size={72}
        showGrid
        className="w-full h-full block"
      />

      {report.photoCount > 0 && (
        <span className="absolute bottom-1.5 right-1.5 z-[3] text-[10px] font-bold bg-black/55 text-white px-1.5 py-0.5 rounded-md tabular-nums">
          {report.photoCount}
        </span>
      )}

      {report.severity === 'critical' && report.status !== 'resolved' && (
        <span
          className="absolute top-1.5 right-1.5 z-[3] w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"
          aria-hidden
        />
      )}
    </div>
  )
}
