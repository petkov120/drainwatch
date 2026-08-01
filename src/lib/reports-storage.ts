import { mockReports, type Report } from '../data/mock'

export const REPORTS_STORAGE_KEY = 'floodwatch:reports:v1'
export const USER_ACTIONS_STORAGE_KEY = 'floodwatch:user-actions:v1'

export interface ReportsStore {
  version: 1
  reports: Report[]
  updatedAt: string
}

export interface UserActionsStore {
  version: 1
  confirmedReportIds: string[]
}

function cloneSeedReports(): Report[] {
  if (typeof structuredClone === 'function') return structuredClone(mockReports)
  return JSON.parse(JSON.stringify(mockReports)) as Report[]
}

export function formatReportTimestamp(date = new Date()): string {
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function loadReportsFromStorage(): Report[] {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY)
    if (!raw) return seedReports()

    const parsed = JSON.parse(raw) as ReportsStore
    if (parsed.version !== 1 || !Array.isArray(parsed.reports)) {
      return seedReports()
    }
    return parsed.reports
  } catch {
    return cloneSeedReports()
  }
}

export function saveReportsToStorage(reports: Report[]): void {
  const store: ReportsStore = {
    version: 1,
    reports,
    updatedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Keep the in-memory application usable when storage is unavailable.
  }
}

export function seedReports(): Report[] {
  const reports = cloneSeedReports()
  saveReportsToStorage(reports)
  return reports
}

export function loadUserActions(): UserActionsStore {
  try {
    const raw = localStorage.getItem(USER_ACTIONS_STORAGE_KEY)
    if (!raw) return { version: 1, confirmedReportIds: [] }

    const parsed = JSON.parse(raw) as UserActionsStore
    if (parsed.version !== 1 || !Array.isArray(parsed.confirmedReportIds)) {
      return { version: 1, confirmedReportIds: [] }
    }
    return parsed
  } catch {
    return { version: 1, confirmedReportIds: [] }
  }
}

export function saveUserActions(actions: UserActionsStore): void {
  try {
    localStorage.setItem(USER_ACTIONS_STORAGE_KEY, JSON.stringify(actions))
  } catch {
    // Confirmation state remains available in memory for this session.
  }
}

export function clearReportsStorage(): void {
  try {
    localStorage.removeItem(REPORTS_STORAGE_KEY)
    localStorage.removeItem(USER_ACTIONS_STORAGE_KEY)
  } catch {
    // Reset the in-memory state even if persistent storage is unavailable.
  }
}
