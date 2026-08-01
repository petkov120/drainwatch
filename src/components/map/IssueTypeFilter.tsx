import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Report } from '../../data/mock'
import type { IssueType } from '../../data/mock'
import { issueTypeLabels } from '../../data/mock'
import { IssueSceneThumb } from './IssueSceneThumb'

export type IssueFilter = 'all' | IssueType

const filters: {
  key: IssueFilter
  short: string
  label: string
  ring: string
  scene: string
}[] = [
  { key: 'all', short: 'All', label: 'All types', ring: '#8e8e93', scene: 'all' },
  { key: 'flooded', short: 'Flood', label: issueTypeLabels.flooded, ring: '#0071e3', scene: 'flooded' },
  { key: 'blocked', short: 'Drain', label: issueTypeLabels.blocked, ring: '#7c3aed', scene: 'blocked' },
  { key: 'dumping', short: 'Dump', label: issueTypeLabels.dumping, ring: '#b45309', scene: 'dumping' },
]

const DRAG_THRESHOLD = 8

interface IssueTypeFilterProps {
  value: IssueFilter
  onChange: (value: IssueFilter) => void
  reports: Report[]
}

export function IssueTypeFilter({ value, onChange, reports }: IssueTypeFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ tracking: false, dragging: false, startX: 0, scrollLeft: 0 })
  const edgeShakeTimer = useRef<number | null>(null)

  const [dragging, setDragging] = useState(false)
  const [edgeShake, setEdgeShake] = useState(false)
  const [selectShake, setSelectShake] = useState<IssueFilter | null>(null)

  const counts = useMemo(() => {
    const byType = { flooded: 0, blocked: 0, dumping: 0 }
    for (const r of reports) byType[r.type]++
    return {
      all: reports.length,
      flooded: byType.flooded,
      blocked: byType.blocked,
      dumping: byType.dumping,
    } satisfies Record<IssueFilter, number>
  }, [reports])

  useEffect(() => {
    setSelectShake(value)
    const t = window.setTimeout(() => setSelectShake(null), 400)
    return () => clearTimeout(t)
  }, [value])

  const triggerEdgeShake = useCallback(() => {
    if (edgeShakeTimer.current) return
    setEdgeShake(true)
    edgeShakeTimer.current = window.setTimeout(() => {
      setEdgeShake(false)
      edgeShakeTimer.current = null
    }, 320)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el || e.button !== 0) return
    dragRef.current = {
      tracking: true,
      dragging: false,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    }
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.tracking) return
      const el = scrollRef.current
      if (!el) return

      const dx = e.clientX - dragRef.current.startX

      if (!dragRef.current.dragging) {
        if (Math.abs(dx) <= DRAG_THRESHOLD) return
        dragRef.current.dragging = true
        setDragging(true)
        el.setPointerCapture(e.pointerId)
      }

      const maxScroll = el.scrollWidth - el.clientWidth
      const next = dragRef.current.scrollLeft - dx
      el.scrollLeft = Math.max(0, Math.min(maxScroll, next))

      const overscrollStart = el.scrollLeft <= 0 && dx > 0
      const overscrollEnd = el.scrollLeft >= maxScroll - 1 && dx < 0
      if (overscrollStart || overscrollEnd) triggerEdgeShake()
    },
    [triggerEdgeShake]
  )

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.tracking) return
    const wasDragging = dragRef.current.dragging
    dragRef.current = { tracking: false, dragging: false, startX: 0, scrollLeft: 0 }
    setDragging(false)
    if (wasDragging) {
      scrollRef.current?.releasePointerCapture(e.pointerId)
    }
  }, [])

  const handleSelect = useCallback(
    (key: IssueFilter, e: React.PointerEvent<HTMLButtonElement>) => {
      if (dragRef.current.dragging) {
        e.preventDefault()
        return
      }
      onChange(key)
    },
    [onChange]
  )

  return (
    <div
      ref={scrollRef}
      className={`overflow-x-hidden overflow-y-visible ${
        dragging ? 'cursor-grabbing select-none' : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={`grid grid-cols-4 gap-1 py-1 w-full min-w-0 ${edgeShake ? 'fw-filter-edge-shake' : ''}`}
        role="tablist"
        aria-label="Filter by issue type"
      >
        {filters.map(({ key, short, label, ring, scene }) => {
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
              onPointerUp={(e) => handleSelect(key, e)}
              onClick={() => {
                if (!dragRef.current.dragging) onChange(key)
              }}
              className={`flex items-center gap-1.5 pl-0.5 pr-1.5 py-1 rounded-xl border-none min-w-0 w-full transition-colors ${
                dragging ? 'cursor-grabbing' : 'cursor-pointer'
              } ${active ? 'bg-white/70 shadow-sm' : 'bg-transparent hover:bg-white/40'}`}
              style={active ? { boxShadow: `0 0 0 1.5px ${ring}33, 0 1px 4px rgba(0,0,0,0.05)` } : undefined}
            >
              <IssueSquircle scene={scene as IssueFilter} ring={ring} active={active} shake={shaking} />
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
    </div>
  )
}

function IssueSquircle({
  scene,
  ring,
  active,
  shake,
}: {
  scene: IssueFilter
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
        style={{
          boxShadow: active ? `0 0 0 1.5px ${ring}22` : undefined,
        }}
      >
        <IssueSceneThumb scene={scene} />
      </div>
    </div>
  )
}
