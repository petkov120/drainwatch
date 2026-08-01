import { IssueType, ReportStatus } from '../data/mock'

const issueColors: Record<IssueType, string> = {
  flooded: 'var(--color-fw-flooded)',
  blocked: 'var(--color-fw-blocked)',
  dumping: 'var(--color-fw-dumping)',
}

const statusColors: Record<ReportStatus, string> = {
  received: 'var(--color-fw-received)',
  in_progress: 'var(--color-fw-in-progress)',
  resolved: 'var(--color-fw-resolved)',
}

export function IssueDot({ type, size = 10 }: { type: IssueType; size?: number }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size, backgroundColor: issueColors[type] }}
      aria-hidden
    />
  )
}

export function StatusDot({ status }: { status: ReportStatus }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: statusColors[status] }}
      aria-hidden
    />
  )
}

export function IssueMarker({
  type,
  selected,
}: {
  type: IssueType
  selected?: boolean
}) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${selected ? 'ring-2 ring-[var(--color-fw-primary)] ring-offset-1' : ''}`}
      style={{ backgroundColor: issueColors[type] }}
    >
      <span className="w-2 h-2 bg-white rounded-full" />
    </div>
  )
}
