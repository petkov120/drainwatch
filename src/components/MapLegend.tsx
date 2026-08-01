import { issueTypeLabels } from '../data/mock'
import { severityLabels } from '../data/mock'

export function MapLegend() {
  return (
    <div className="fw-map-legend" role="region" aria-label="Map legend">
      <p className="font-semibold text-[var(--color-fw-text)] mb-2">Legend</p>
      <div className="space-y-1.5 text-[var(--color-fw-text-secondary)]">
        <LegendRow shape="circle" color="#0071e3" label={issueTypeLabels.flooded} />
        <LegendRow shape="diamond" color="#7c3aed" label={issueTypeLabels.blocked} />
        <LegendRow shape="square" color="#b45309" label={issueTypeLabels.dumping} />
        <div className="border-t border-[var(--color-fw-divider)] my-2 pt-2">
          <p className="font-medium text-[var(--color-fw-text)] mb-1">Severity ring</p>
          {(['low', 'moderate', 'high', 'critical'] as const).map((s) => (
            <div key={s} className="flex items-center gap-2 mt-1">
              <span
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{
                  boxShadow: `0 0 0 ${s === 'low' ? 2 : s === 'moderate' ? 3 : s === 'high' ? 4 : 5}px ${
                    s === 'low' ? '#059669' : s === 'moderate' ? '#d97706' : s === 'high' ? '#dc2626' : '#991b1b'
                  }`,
                }}
                aria-hidden
              />
              <span>{severityLabels[s]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-[#1d1d1f] text-white w-4 h-4 rounded-full flex items-center justify-center" aria-hidden>♿</span>
          <span>Accessibility impact</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" aria-hidden>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="white"><path d="M1 4l2 2 4-4" /></svg>
          </span>
          <span>Community verified</span>
        </div>
      </div>
    </div>
  )
}

function LegendRow({
  shape,
  color,
  label,
}: {
  shape: 'circle' | 'diamond' | 'square'
  color: string
  label: string
}) {
  const shapeStyle =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'diamond'
        ? 'rounded-sm rotate-45'
        : 'rounded-sm'

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-4 h-4 ${shapeStyle} shrink-0`}
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span>{label}</span>
    </div>
  )
}
