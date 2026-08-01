import type { Report } from '../data/mock'
import { getHazardHeadline, getHazardTone } from '../lib/report-utils'

const toneIcons: Record<string, string> = {
  safe: '✓',
  caution: '!',
  danger: '⚠',
  info: 'ℹ',
}

export function HazardSummary({ report }: { report: Report }) {
  const tone = getHazardTone(report)
  const headline = getHazardHeadline(report)

  return (
    <div
      className={`fw-hazard-banner fw-hazard-${tone}`}
      role="status"
      aria-live="polite"
    >
      <span
        className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-lg font-bold shrink-0"
        aria-hidden
      >
        {toneIcons[tone]}
      </span>
      <div>
        <p className="text-[15px] font-semibold text-[var(--color-fw-text)]">
          {headline}
        </p>
        {report.status === 'in_progress' && report.govResponses.length > 0 && (
          <p className="text-[13px] text-[var(--color-fw-text-secondary)] mt-0.5">
            {report.govResponses[0].agency} is responding
          </p>
        )}
      </div>
    </div>
  )
}
