import { useEffect, useMemo, useState } from 'react'
import type { Report } from '../../data/mock'
import { IssueSceneThumb } from '../map/IssueSceneThumb'

export type StatusFilter = 'all' | 'active' | 'resolved'

const filters: {
  key: StatusFilter
  short: string
  label: string
  ring: string
  kind: 'all' | 'active' | 'resolved'
}[] = [
  { key: 'all', short: 'All', label: 'All reports', ring: '#8e8e93', kind: 'all' },
  { key: 'active', short: 'Active', label: 'Active reports', ring: '#0071e3', kind: 'active' },
  { key: 'resolved', short: 'Cleared', label: 'Resolved reports', ring: '#059669', kind: 'resolved' },
]

interface ReportStatusFilterProps {
  value: StatusFilter
  onChange: (value: StatusFilter) => void
  reports: Report[]
}

export function ReportStatusFilter({ value, onChange, reports }: ReportStatusFilterProps) {
  const [selectShake, setSelectShake] = useState<StatusFilter | null>(null)

  const counts = useMemo(
    () => ({
      all: reports.length,
      active: reports.filter((r) => r.status !== 'resolved').length,
      resolved: reports.filter((r) => r.status === 'resolved').length,
    }),
    [reports]
  )

  useEffect(() => {
    setSelectShake(value)
    const t = window.setTimeout(() => setSelectShake(null), 400)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div
      className="grid grid-cols-3 gap-1 py-1 w-full min-w-0"
      role="tablist"
      aria-label="Filter by status"
    >
      {filters.map(({ key, short, label, ring, kind }) => {
        const active = value === key
        const count = counts[key]
        const shaking = selectShake === key

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`${label}, ${count} reports`}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1.5 pl-0.5 pr-1.5 py-1 rounded-xl border-none min-w-0 w-full cursor-pointer transition-colors ${
              active ? 'bg-white/70 shadow-sm' : 'bg-transparent hover:bg-white/40'
            }`}
            style={
              active
                ? { boxShadow: `0 0 0 1.5px ${ring}33, 0 1px 4px rgba(0,0,0,0.05)` }
                : undefined
            }
          >
            <StatusSquircle kind={kind} ring={ring} active={active} shake={shaking} />
            <span
              className={`fw-type-nav truncate min-w-0 ${
                active ? 'font-bold text-[#2c2c2e]' : 'font-medium text-[#636366]'
              }`}
            >
              {short}
              <span className="text-[#86868b] font-normal"> · {count}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function StatusSquircle({
  kind,
  ring,
  active,
  shake,
}: {
  kind: 'all' | 'active' | 'resolved'
  ring: string
  active: boolean
  shake?: boolean
}) {
  return (
    <div
      className={`relative w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 overflow-hidden transition-transform ${
        active ? 'scale-100' : 'scale-[0.96] opacity-90'
      } ${shake ? 'fw-filter-shake' : ''}`}
      style={{
        background: '#f4f4f5',
        boxShadow: active
          ? `inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px ${ring}33`
          : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.06)',
        border: `1px solid ${active ? `${ring}44` : 'rgba(0,0,0,0.06)'}`,
      }}
      aria-hidden
    >
      <div
        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
        style={{ boxShadow: active ? `0 0 0 1.5px ${ring}22` : undefined }}
      >
        {kind === 'all' ? (
          <IssueSceneThumb scene="all" />
        ) : kind === 'active' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="8" stroke="#0071e3" strokeWidth="2" />
            <path d="M12 7v5l3 2" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="8" fill="#ecfdf5" stroke="#059669" strokeWidth="1.75" />
            <path
              d="M8.5 12l2.2 2.2 4.8-5"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  )
}
