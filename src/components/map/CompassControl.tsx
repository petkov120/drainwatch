interface CompassControlProps {
  onResetNorth?: () => void
  bearing?: number
}

export function CompassControl({ onResetNorth, bearing = 0 }: CompassControlProps) {
  return (
    <button
      type="button"
      onClick={onResetNorth}
      className="fw-compass"
      aria-label="Reset map to north"
      title="Reset north"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden
        style={{ transform: `rotate(${-bearing}deg)`, transition: 'transform 0.3s ease' }}
      >
        <circle cx="18" cy="18" r="16" fill="white" stroke="#d2d2d7" strokeWidth="1" />
        {/* N pointer */}
        <path d="M18 6 L20 18 L18 16 L16 18 Z" fill="#dc2626" />
        <path d="M18 30 L16 18 L18 20 L20 18 Z" fill="#86868b" />
        <text x="18" y="5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#dc2626">N</text>
      </svg>
    </button>
  )
}
