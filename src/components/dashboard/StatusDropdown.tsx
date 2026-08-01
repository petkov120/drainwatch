import { useEffect, useId, useRef, useState } from 'react'
import type { ReportStatus } from '../../data/mock'
import { statusLabels } from '../../data/mock'

const statusOptions: ReportStatus[] = ['received', 'in_progress', 'resolved']

const statusHints: Record<ReportStatus, string> = {
  received: 'Report in triage queue',
  in_progress: 'Team dispatched — updates Nearby',
  resolved: 'Issue cleared for citizens',
}

interface StatusDropdownProps {
  value: ReportStatus
  onChange: (status: ReportStatus) => void
  id?: string
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 text-[var(--color-fw-text-tertiary)] transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StatusDropdown({ value, onChange, id }: StatusDropdownProps) {
  const fallbackId = useId()
  const triggerId = id ?? fallbackId
  const listboxId = `${triggerId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const select = (status: ReportStatus) => {
    onChange(status)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="fw-status-dropdown">
      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((v) => !v)}
        className="fw-status-dropdown-trigger"
      >
        <span className={`fw-badge fw-badge-status-${value}`}>{statusLabels[value]}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul id={listboxId} role="listbox" aria-labelledby={triggerId} className="fw-status-dropdown-menu">
          {statusOptions.map((status) => {
            const selected = status === value
            return (
              <li key={status} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => select(status)}
                  className={`fw-status-dropdown-option fw-status-dropdown-option--${status} ${
                    selected ? 'is-selected' : ''
                  }`}
                >
                  <span className="min-w-0 flex-1 text-left">
                    <span className="fw-type-body font-medium block">{statusLabels[status]}</span>
                    <span className="fw-type-meta block mt-0.5">{statusHints[status]}</span>
                  </span>
                  {selected && (
                    <span className="fw-status-dropdown-check" aria-hidden>
                      <CheckIcon />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
