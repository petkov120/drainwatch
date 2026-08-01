import { useState } from 'react'
import { issueTypeLabels, severityLabels } from '../data/mock'
import type { IssueType, Severity } from '../data/mock'
import { IssueSceneThumb } from './map/IssueSceneThumb'

const issueTypes: IssueType[] = ['flooded', 'blocked', 'dumping']

const severities: Severity[] = ['low', 'moderate', 'high', 'critical']

const severityColor: Record<Severity, string> = {
  low: '#059669',
  moderate: '#d97706',
  high: '#dc2626',
  critical: '#991b1b',
}

const severityRing: Record<Severity, number> = {
  low: 2,
  moderate: 3,
  high: 4,
  critical: 5,
}

export function MapLegend() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fw-map-legend-wrap">
      {open && (
        <div id="map-legend-panel" className="fw-map-legend-panel" role="region" aria-label="Map legend">
          <div className="fw-map-legend-section">
            <p className="fw-map-legend-heading">Issue type</p>
            <ul className="fw-map-legend-types">
              {issueTypes.map((type) => (
                <li key={type} className="fw-map-legend-type">
                  <span className="fw-map-legend-type-icon">
                    <IssueSceneThumb scene={type} size={24} />
                  </span>
                  <span className="fw-map-legend-type-label">{issueTypeLabels[type]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="fw-map-legend-section">
            <p className="fw-map-legend-heading">Severity ring</p>
            <ul className="fw-map-legend-severity">
              {severities.map((s) => (
                <li key={s} className="fw-map-legend-severity-item" title={severityLabels[s]}>
                  <span
                    className="fw-map-legend-severity-dot"
                    style={{
                      boxShadow: `0 0 0 ${severityRing[s]}px ${severityColor[s]}`,
                    }}
                    aria-hidden
                  />
                  <span className="fw-map-legend-severity-label">{severityLabels[s]}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="fw-map-legend-meta">
            <li className="fw-map-legend-meta-item">
              <span className="fw-map-legend-meta-icon fw-map-legend-meta-icon--a11y" aria-hidden>
                ♿
              </span>
              <span>Accessibility</span>
            </li>
            <li className="fw-map-legend-meta-item">
              <span className="fw-map-legend-meta-icon fw-map-legend-meta-icon--verified" aria-hidden>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4l1.5 1.5 3.5-3.5"
                    stroke="white"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Verified</span>
            </li>
          </ul>
        </div>
      )}

      <button
        type="button"
        className="fw-map-legend-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="map-legend-panel"
      >
        <LegendMapIcon />
        <span>Legend</span>
      </button>
    </div>
  )
}

function LegendMapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 4.5l4.5-2 4.5 2v7l-4.5-2-4.5 2V4.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M6.5 2.5v7M10 4.5v7" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}
