interface CompassControlProps {
  onResetNorth?: () => void
  bearing?: number
  size?: number
}

export function CompassControl({ onResetNorth, bearing = 0, size = 36 }: CompassControlProps) {
  const half = size / 2
  const r = half - 2
  return (
    <button
      type="button"
      onClick={onResetNorth}
      className="fw-compass p-0 border-none bg-transparent"
      aria-label="Reset map to north"
      title="Reset north"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden
        style={{ transform: `rotate(${-bearing}deg)`, transition: 'transform 0.3s ease' }}
      >
        <circle cx={half} cy={half} r={r} fill="white" stroke="#d2d2d7" strokeWidth="1" />
        <path
          d={`M${half} ${half - r + 2} L${half + 2} ${half} L${half} ${half - 2} L${half - 2} ${half} Z`}
          fill="#dc2626"
        />
        <path
          d={`M${half} ${half + r - 2} L${half - 2} ${half} L${half} ${half + 2} L${half + 2} ${half} Z`}
          fill="#86868b"
        />
        <text x={half} y={half - r + 1} textAnchor="middle" fontSize={size * 0.17} fontWeight="700" fill="#dc2626">
          N
        </text>
      </svg>
    </button>
  )
}
