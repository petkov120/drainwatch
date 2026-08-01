import type { Report } from '../data/mock'
import { getHazardHeadline, getHazardTone } from '../lib/report-utils'

type HazardTone = ReturnType<typeof getHazardTone>

const toneLabels: Record<HazardTone, string> = {
  safe: 'All clear',
  caution: 'Use caution',
  danger: 'Hazard advisory',
  info: 'Response update',
}

function HazardIcon({ tone }: { tone: HazardTone }) {
  if (tone === 'safe') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4 8.5l2.5 2.5 5.5-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (tone === 'info') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7v4M8 5.25v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (tone === 'caution') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 3.5l5.5 9.5H2.5L8 3.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 7v2.25M8 10.75h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3.5l5.5 9.5H2.5L8 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 7v2.25M8 10.75h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function HazardSummary({
  report,
  embedded = false,
}: {
  report: Report
  embedded?: boolean
}) {
  const tone = getHazardTone(report)
  const headline = getHazardHeadline(report)
  const responding =
    report.status === 'in_progress' && report.govResponses.length > 0
      ? report.govResponses[0].agency
      : null

  const content = (
    <>
      <div className="fw-hazard-icon" aria-hidden>
        <HazardIcon tone={tone} />
      </div>
      <div className="min-w-0 pt-0.5 flex-1">
        <p className="fw-hazard-label">{toneLabels[tone]}</p>
        <p className="fw-hazard-headline">{headline}</p>
        {responding && (
          <p className="fw-hazard-sub">{responding} is responding</p>
        )}
      </div>
    </>
  )

  if (embedded) {
    return (
      <div className="fw-status-brief-hazard" role="status" aria-live="polite">
        {content}
      </div>
    )
  }

  return (
    <div
      className={`fw-hazard-banner fw-hazard-${tone}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-3 items-start w-full">
        {content}
      </div>
    </div>
  )
}
