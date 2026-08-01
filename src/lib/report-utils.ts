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
