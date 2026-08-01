import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Report, ReportStatus, TimelineEvent, GovResponse } from '../data/mock'
import {
  clearReportsStorage,
  formatReportTimestamp,
  loadReportsFromStorage,
  loadUserActions,
  saveReportsToStorage,
  saveUserActions,
  seedReports,
} from '../lib/reports-storage'

interface ReportsContextValue {
  reports: Report[]
  getReport: (id: string) => Report | undefined
  updateStatus: (id: string, status: ReportStatus) => void
  confirmReport: (id: string) => void
  hasConfirmed: (id: string) => boolean
  resetDemo: () => void
}

const ReportsContext = createContext<ReportsContextValue | null>(null)

function appendStatusTransition(
  report: Report,
  status: ReportStatus,
  timestamp: string
): Pick<Report, 'timeline' | 'govResponses' | 'avoidArea'> {
  const timeline: TimelineEvent[] = [...report.timeline]
  const govResponses: GovResponse[] = [...report.govResponses]
  let avoidArea = report.avoidArea

  if (status === 'in_progress') {
    timeline.push({
      id: `t-${Date.now()}`,
      type: 'in_progress',
      title: 'Crew dispatched',
      description: 'Response team en route to location',
      timestamp,
      actor: 'Lagos State Drainage',
    })
    if (govResponses.length === 0) {
      govResponses.unshift({
        id: `g-${Date.now()}`,
        agency: 'Lagos State Drainage Services',
        message: 'Team dispatched. Estimated arrival within 2 hours.',
        timestamp,
      })
    }
  } else if (status === 'resolved') {
    timeline.push({
      id: `t-${Date.now()}`,
      type: 'resolved',
      title: 'Issue resolved',
      description: 'Area cleared and passable',
      timestamp,
      actor: 'Lagos State Drainage',
    })
    govResponses.unshift({
      id: `g-${Date.now()}-gov`,
      agency: 'Lagos State Drainage Services',
      message: 'Issue cleared. Road is now passable. Thank you for reporting.',
      timestamp,
    })
    avoidArea = false
  } else if (status === 'received') {
    timeline.push({
      id: `t-${Date.now()}`,
      type: 'reported',
      title: 'Status reset to received',
      description: 'Report returned to triage queue',
      timestamp,
      actor: 'Ops dashboard',
    })
  }

  return { timeline, govResponses, avoidArea }
}

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(() => loadReportsFromStorage())
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(
    () => new Set(loadUserActions().confirmedReportIds)
  )

  const persistReports = useCallback((next: Report[]) => {
    setReports(next)
    saveReportsToStorage(next)
  }, [])

  const getReport = useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports]
  )

  const updateStatus = useCallback(
    (id: string, status: ReportStatus) => {
      persistReports(
        reports.map((report) => {
          if (report.id !== id || report.status === status) return report

          const timestamp = formatReportTimestamp()
          const transition = appendStatusTransition(report, status, timestamp)

          return {
            ...report,
            status,
            ...transition,
          }
        })
      )
    },
    [persistReports, reports]
  )

  const hasConfirmed = useCallback((id: string) => confirmedIds.has(id), [confirmedIds])

  const confirmReport = useCallback(
    (id: string) => {
      if (confirmedIds.has(id)) return

      const timestamp = formatReportTimestamp()
      const nextConfirmed = new Set(confirmedIds)
      nextConfirmed.add(id)
      setConfirmedIds(nextConfirmed)
      saveUserActions({ version: 1, confirmedReportIds: [...nextConfirmed] })

      persistReports(
        reports.map((report) => {
          if (report.id !== id) return report

          return {
            ...report,
            confirmations: report.confirmations + 1,
            timeline: [
              ...report.timeline,
              {
                id: `t-confirm-${Date.now()}`,
                type: 'confirmed',
                title: 'You confirmed this issue',
                timestamp,
                actor: 'You',
              },
            ],
          }
        })
      )
    },
    [confirmedIds, persistReports, reports]
  )

  const resetDemo = useCallback(() => {
    clearReportsStorage()
    const fresh = seedReports()
    setReports(fresh)
    setConfirmedIds(new Set())
    saveUserActions({ version: 1, confirmedReportIds: [] })
  }, [])

  const value = useMemo(
    () => ({
      reports,
      getReport,
      updateStatus,
      confirmReport,
      hasConfirmed,
      resetDemo,
    }),
    [reports, getReport, updateStatus, confirmReport, hasConfirmed, resetDemo]
  )

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
}

export function useReports(): ReportsContextValue {
  const ctx = useContext(ReportsContext)
  if (!ctx) {
    throw new Error('useReports must be used within ReportsProvider')
  }
  return ctx
}
