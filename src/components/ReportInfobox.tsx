import { Report, issueTypeLabels, statusLabels } from '../data/mock'
import { Infobox, InfoboxRow } from './Infobox'
import { IssueDot, StatusDot } from './IssueMarker'

export function ReportInfobox({ report }: { report: Report }) {
  return (
    <Infobox>
      <div className="px-4 py-2 border-b border-[var(--color-fw-divider)] text-xs font-medium text-[var(--color-fw-text-secondary)] uppercase tracking-wide">
        Report information
      </div>
      <InfoboxRow
        label="Status"
        value={
          <span className="inline-flex items-center gap-2">
            <StatusDot status={report.status} />
            {statusLabels[report.status]}
          </span>
        }
      />
      <InfoboxRow
        label="Type"
        value={
          <span className="inline-flex items-center gap-2">
            <IssueDot type={report.type} />
            {issueTypeLabels[report.type]}
          </span>
        }
      />
      <InfoboxRow label="Reported" value={report.reportedAt} />
      <InfoboxRow label="Location" value={report.location} />
      <InfoboxRow label="LGA" value={report.lga} />
      <InfoboxRow label="Confirmations" value={report.confirmations} />
      <InfoboxRow label="Reference" value={report.id} />
    </Infobox>
  )
}
