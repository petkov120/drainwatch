import { useCallback, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type TooltipSide = 'left' | 'top'

interface FwTooltipProps {
  label: string
  side?: TooltipSide
  className?: string
  children: ReactNode
}

export function FwTooltip({ label, side = 'left', className = '', children }: FwTooltipProps) {
  const tooltipId = useId()
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const updatePosition = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (side === 'left') {
      setPosition({ x: rect.left - 8, y: rect.top + rect.height / 2 })
    } else {
      setPosition({ x: rect.left + rect.width / 2, y: rect.top - 8 })
    }
  }, [side])

  const show = () => {
    updatePosition()
    setOpen(true)
  }

  const hide = () => setOpen(false)

  return (
    <span
      ref={anchorRef}
      className={`fw-tooltip-anchor ${className}`.trim()}
      aria-describedby={open ? tooltipId : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className={`fw-tooltip fw-tooltip--${side}`}
            style={{ top: position.y, left: position.x }}
          >
            {label}
          </div>,
          document.body
        )}
    </span>
  )
}
