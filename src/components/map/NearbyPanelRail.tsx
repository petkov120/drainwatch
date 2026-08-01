import type { CSSProperties } from 'react'
import type { Report } from '../../data/mock'
import { issueTypeLabels, statusLabels } from '../../data/mock'
import { FwTooltip } from '../FwTooltip'
import { IssueSceneThumb } from './IssueSceneThumb'

const issueRing: Record<Report['type'], string> = {
  flooded: '#0071e3',
  blocked: '#7c3aed',
  dumping: '#b45309',
}

interface NearbyPanelRailProps {
  reports: Report[]
  selectedId: string | null
  onExpand: () => void
  onSelectReport: (id: string) => void
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10 4L6 8l4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function railItemTooltip(report: Report) {
  return `${report.location} · ${issueTypeLabels[report.type]} · ${statusLabels[report.status]}`
}

export function NearbyPanelRail({
  reports,
  selectedId,
  onExpand,
  onSelectReport,
}: NearbyPanelRailProps) {
  return (
    <div className="fw-nearby-rail">
      <FwTooltip label="Expand nearby panel" side="left">
        <button
          type="button"
          onClick={onExpand}
          className="fw-nearby-rail-expand"
          aria-label="Expand nearby panel"
        >
          <ChevronLeftIcon />
        </button>
      </FwTooltip>

      <span className="fw-nearby-rail-label" aria-hidden>
        {reports.length}
      </span>

      <div className="fw-nearby-rail-items" aria-label="Nearby reports">
        {reports.map((report) => {
          const selected = report.id === selectedId
          const ring = issueRing[report.type]
          return (
            <FwTooltip key={report.id} label={railItemTooltip(report)} side="left">
              <button
                type="button"
                aria-label={railItemTooltip(report)}
                aria-current={selected ? 'true' : undefined}
                onClick={() => {
                  onSelectReport(report.id)
                  onExpand()
                }}
                className={`fw-nearby-rail-item ${selected ? 'is-selected' : ''}`}
                style={{ '--rail-ring': ring } as CSSProperties}
              >
                <IssueSceneThumb scene={report.type} size={28} className="block rounded-md" />
              </button>
            </FwTooltip>
          )
        })}
      </div>
    </div>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PanelCollapseButton({ onClick }: { onClick: () => void }) {
  return (
    <FwTooltip label="Collapse to rail" side="left">
      <button
        type="button"
        onClick={onClick}
        className="fw-panel-collapse-btn"
        aria-label="Collapse to rail"
      >
        <ChevronRightIcon />
      </button>
    </FwTooltip>
  )
}
