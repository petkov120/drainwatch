import type { Report, ReportStatus } from '../../data/mock'
import { issueTypeLabels } from '../../data/mock'
import {
  SeverityBadge,
  StatusBadge,
  VerificationBadge,
} from '../badges/ReportBadges'
import { IssueSceneThumb } from '../map/IssueSceneThumb'
import { StatusDropdown } from './StatusDropdown'

const issueRing: Record<Report['type'], string> = {
  flooded: '#0071e3',
  blocked: '#7c3aed',
  dumping: '#b45309',
}

interface DashboardReportPanelProps {
  report: Report
  onStatusChange: (status: ReportStatus) => void
}

export function DashboardReportPanel({ report, onStatusChange }: DashboardReportPanelProps) {
  const ring = issueRing[report.type]

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <header className="fw-dashboard-detail-header shrink-0 px-5 py-4 space-y-3">
        <div>
          <p className="fw-type-caption">{issueTypeLabels[report.type]}</p>
          <h2 className="fw-type-display truncate mt-0.5">{report.location}</h2>
          <p className="fw-type-meta mt-1">{report.id}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={report.status} />
          <SeverityBadge severity={report.severity} />
          <VerificationBadge report={report} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        <div
          className="aspect-video rounded-xl overflow-hidden border border-[var(--color-fw-divider)] relative"
          style={{ boxShadow: `inset 0 0 0 1px ${ring}22` }}
        >
          <IssueSceneThumb scene={report.type} size={400} showGrid className="w-full h-full block" />
          {report.photoCount > 0 && (
            <span className="absolute bottom-2 right-2 fw-type-caption normal-case tracking-normal bg-black/55 text-white px-2 py-0.5 rounded-md">
              {report.photoCount} photo{report.photoCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <section className="fw-detail-section">
          <div className="px-4 py-3 border-b border-[var(--color-fw-divider)]">
            <h3 className="fw-type-title">Summary</h3>
          </div>
          <div className="fw-detail-section-body">
            <p className="fw-type-body text-[var(--color-fw-text-secondary)]">{report.summary}</p>
          </div>
        </section>

        <section className="fw-detail-section">
          <div className="px-4 py-3 border-b border-[var(--color-fw-divider)]">
            <h3 className="fw-type-title">Update status</h3>
          </div>
          <div className="fw-detail-section-body space-y-3">
            <p className="fw-type-meta">Citizen progress bar updates on Nearby</p>
            <StatusDropdown
              id="dash-status"
              value={report.status}
              onChange={onStatusChange}
            />
          </div>
        </section>

        <dl className="fw-infobox fw-type-body">
          <div className="fw-infobox-row">
            <dt className="fw-infobox-label">LGA</dt>
            <dd className="fw-infobox-value">{report.lga}</dd>
          </div>
          <div className="fw-infobox-row">
            <dt className="fw-infobox-label">Confirmations</dt>
            <dd className="fw-infobox-value">{report.confirmations}</dd>
          </div>
          <div className="fw-infobox-row">
            <dt className="fw-infobox-label">Reported</dt>
            <dd className="fw-infobox-value">{report.reportedAt}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
