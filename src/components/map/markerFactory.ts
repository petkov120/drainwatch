import L from 'leaflet'
import type { Report } from '../../data/mock'
import {
  getIssueShape,
  getSeverityColor,
  getSeverityRingWidth,
  shouldPulseMarker,
  getVerificationLevel,
} from '../../lib/report-utils'

const issueIcons: Record<string, string> = {
  flooded: `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white"/>`,
  blocked: `<rect x="6" y="6" width="12" height="12" rx="1" fill="white"/>`,
  dumping: `<path d="M6 8h12l-1.5 10H7.5L6 8zm3-3h6l1 3H8l1-3z" fill="white"/>`,
}

const issueColors: Record<string, string> = {
  flooded: '#0071e3',
  blocked: '#7c3aed',
  dumping: '#b45309',
}

function shapeClipPath(shape: 'circle' | 'diamond' | 'square'): string {
  if (shape === 'circle') return 'border-radius:50%'
  if (shape === 'diamond') return 'border-radius:4px;transform:rotate(45deg)'
  return 'border-radius:4px'
}

function innerTransform(shape: 'circle' | 'diamond' | 'square'): string {
  return shape === 'diamond' ? 'transform:rotate(-45deg)' : ''
}

export function createReportMarkerIcon(report: Report, selected: boolean) {
  const shape = getIssueShape(report.type)
  const color = issueColors[report.type]
  const severityColor = getSeverityColor(report.severity)
  const ringWidth = getSeverityRingWidth(report.severity)
  const pulse = shouldPulseMarker(report)
  const verified = getVerificationLevel(report.confirmations)
  const size = selected ? 44 : 38
  const iconSize = selected ? 18 : 16

  const a11yBadge =
    report.accessibilityImpact !== 'none'
      ? `<div style="position:absolute;top:-4px;left:-4px;width:16px;height:16px;background:#1d1d1f;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;" aria-hidden="true">♿</div>`
      : ''

  const verifyBadge =
    verified !== 'unverified'
      ? `<div style="position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;background:#059669;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="white"><path d="M1 4l2 2 4-4"/></svg>
        </div>`
      : ''

  const severityRing = `<div style="position:absolute;inset:-${ringWidth}px;border:${ringWidth}px solid ${severityColor};${shapeClipPath(shape)};opacity:0.9;"></div>`

  const pulseClass = pulse ? 'fw-marker-pulse' : ''
  const selectedRing = selected
    ? `box-shadow:0 0 0 3px white,0 0 0 6px #0071e3;`
    : `box-shadow:0 2px 8px rgba(0,0,0,0.2);`

  const html = `
    <div class="${pulseClass}" style="position:relative;width:${size}px;height:${size}px;" role="img">
      ${severityRing}
      <div style="
        position:absolute;inset:0;
        background:${color};
        border:2.5px solid white;
        ${shapeClipPath(shape)};
        ${selectedRing}
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="${innerTransform(shape)}">
          <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="none">
            ${issueIcons[report.type]}
          </svg>
        </div>
      </div>
      ${a11yBadge}
      ${verifyBadge}
    </div>
  `

  const total = size + ringWidth * 2 + 8

  return L.divIcon({
    className: 'fw-custom-marker',
    iconSize: [total, total],
    iconAnchor: [total / 2, total / 2],
    html,
  })
}
