import { CompassControl } from './CompassControl'

interface MapToolPillProps {
  onRecenter: () => void
  isLocating?: boolean
}

export function MapToolPill({ onRecenter, isLocating }: MapToolPillProps) {
  return (
    <div className="fw-float-pill flex items-center gap-0.5 p-1 pointer-events-auto">
      <button
        type="button"
        onClick={onRecenter}
        className={`fw-float-tool ${isLocating ? 'text-[var(--color-fw-primary)] bg-[var(--color-fw-primary-container)]' : ''}`}
        aria-label="Recenter map on your location"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      </button>
      <span className="w-px h-5 bg-[var(--color-fw-divider)]" aria-hidden />
      <div className="px-0.5">
        <CompassControl onResetNorth={onRecenter} size={28} />
      </div>
    </div>
  )
}
