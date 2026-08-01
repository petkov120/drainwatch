import type {
  Report,
  Severity,
  IssueType,
  VerificationLevel,
} from '../data/mock'
import {
  severityLabels,
  accessibilityLabels,
  issueTypeLabels,
  statusLabels,
} from '../data/mock'

export function getVerificationLevel(confirmations: number): VerificationLevel {
  if (confirmations >= 10) return 'verified'
  if (confirmations >= 3) return 'community'
  return 'unverified'
}

export const verificationLabels: Record<VerificationLevel, string> = {
  unverified: 'Unverified',
  community: 'Community verified',
  verified: 'Highly verified',
}

export function getHazardHeadline(report: Report): string {
  if (report.status === 'resolved') return 'Area cleared — safe to pass'
  if (report.avoidArea && report.severity === 'critical')
    return 'Avoid this area — severe flooding'
  if (report.avoidArea) return 'Avoid if possible — active hazard'
  if (report.accessibilityImpact === 'blocked')
    return 'Not accessible — path blocked'
  if (report.status === 'in_progress') return 'Authorities responding'
  return 'Report received — use caution'
}

export function getHazardTone(
  report: Report
): 'safe' | 'caution' | 'danger' | 'info' {
  if (report.status === 'resolved') return 'safe'
  if (report.avoidArea || report.severity === 'critical') return 'danger'
  if (report.severity === 'high' || report.accessibilityImpact === 'blocked')
    return 'caution'
  if (report.status === 'in_progress') return 'info'
  return 'caution'
}

export function getSeverityColor(severity: Severity): string {
  const map: Record<Severity, string> = {
    low: '#059669',
    moderate: '#d97706',
    high: '#dc2626',
    critical: '#991b1b',
  }
  return map[severity]
}

export function getIssueShape(type: IssueType): 'circle' | 'diamond' | 'square' {
  const map: Record<IssueType, 'circle' | 'diamond' | 'square'> = {
    flooded: 'circle',
    blocked: 'diamond',
    dumping: 'square',
  }
  return map[type]
}

export function getMarkerAriaLabel(report: Report): string {
  const parts = [
    issueTypeLabels[report.type],
    severityLabels[report.severity],
    report.location,
    verificationLabels[getVerificationLevel(report.confirmations)],
  ]
  if (report.accessibilityImpact !== 'none') {
    parts.push(accessibilityLabels[report.accessibilityImpact])
  }
  if (report.avoidArea) parts.push('Avoid area recommended')
  return parts.join('. ')
}

export function getSeverityRingWidth(severity: Severity): number {
  const map: Record<Severity, number> = {
    low: 2,
    moderate: 3,
    high: 4,
    critical: 5,
  }
  return map[severity]
}

export function shouldPulseMarker(report: Report): boolean {
  return report.severity === 'critical' && report.status !== 'resolved'
}

export function getStatusProgressSubtitle(report: Report): string {
  switch (report.status) {
    case 'received':
      return 'Report received — shared with response teams'
    case 'in_progress':
      return report.govResponses[0]
        ? `${report.govResponses[0].agency} is responding`
        : 'Response team dispatched'
    case 'resolved': {
      const resolvedEvent = [...report.timeline].reverse().find((e) => e.type === 'resolved')
      if (resolvedEvent) {
        const date = resolvedEvent.timestamp.split(',')[0]
        return `Issue cleared · ${date}`
      }
      return 'Issue cleared — area passable'
    }
  }
}

/** Foot copy for the status stepper — primary = latest signal, secondary = context. */
export function getStatusFootContent(report: Report): {
  primary: string
  secondary: string | null
  variant: 'check' | 'gov' | 'neutral'
  statusLabel: string
  tooltip: string
} {
  const context = getStatusProgressSubtitle(report)
  const latest = report.timeline[report.timeline.length - 1]
  const latestDate = latest?.timestamp.split(',')[0]
  const statusLabel = statusLabels[report.status]

  const tooltipParts = [
    context,
    latest?.description,
    report.confirmations > 0 ? `${report.confirmations} community confirmations` : null,
  ].filter(Boolean)

  if (report.govResponses[0] && report.status !== 'received') {
    const gov = report.govResponses[0]
    return {
      primary: gov.message,
      secondary: `${gov.timestamp.split(',')[0]} · ${context}`,
      variant: 'gov',
      statusLabel,
      tooltip: [gov.message, gov.agency, context].filter(Boolean).join(' · '),
    }
  }

  if (latest && latest.type !== 'reported') {
    return {
      primary: latest.title,
      secondary: latestDate ? `${latestDate} · ${context}` : context,
      variant: latest.type === 'confirmed' || latest.type === 'resolved' ? 'check' : 'neutral',
      statusLabel,
      tooltip: tooltipParts.join(' · '),
    }
  }

  return {
    primary: context,
    secondary: latest && latestDate ? `${latestDate} · ${latest.title}` : null,
    variant: 'neutral',
    statusLabel,
    tooltip: tooltipParts.join(' · '),
  }
}
