import { Link } from 'react-router-dom'

/** Stationed report FAB — always-visible mascot anchor on the map. */
export function ReportMascotFab() {
  return (
    <Link
      to="/report"
      className="fw-report-mascot pointer-events-auto no-underline hover:no-underline"
      aria-label="Report an issue"
      data-tour="report-fab"
    >
      <span className="fw-report-mascot-body" aria-hidden>
        <CatMascot />
      </span>
      <span className="fw-report-mascot-label">Report</span>
    </Link>
  )
}

function CatMascot() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ears */}
      <path d="M8 14L11 5L15 13" fill="#0071e3" />
      <path d="M28 14L25 5L21 13" fill="#0071e3" />
      <path d="M9.5 13L11.5 7.5L14 12.5" fill="#38bdf8" />
      <path d="M26.5 13L24.5 7.5L22 12.5" fill="#38bdf8" />
      {/* head */}
      <ellipse cx="18" cy="20" rx="11" ry="10" fill="#0071e3" />
      <ellipse cx="18" cy="21" rx="8.5" ry="7" fill="#e8f2fd" />
      {/* eyes */}
      <ellipse cx="14" cy="19.5" rx="1.6" ry="2" fill="#1d1d1f" />
      <ellipse cx="22" cy="19.5" rx="1.6" ry="2" fill="#1d1d1f" />
      <circle cx="14.6" cy="18.6" r="0.55" fill="#fff" />
      <circle cx="22.6" cy="18.6" r="0.55" fill="#fff" />
      {/* nose + mouth */}
      <path d="M18 21.5l-1.2 1h2.4l-1.2-1z" fill="#f97316" />
      <path
        d="M18 22.5c-1.8 0-2.8 1-2.8 1.6M18 22.5c1.8 0 2.8 1 2.8 1.6"
        stroke="#64748b"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      {/* whiskers */}
      <path d="M6 20h5M6 22.5h4.5M25 20h5M25 22.5h4.5" stroke="#94a3b8" strokeWidth="0.7" strokeLinecap="round" />
      {/* rain drop badge */}
      <circle cx="27" cy="10" r="6.5" fill="#fff" stroke="#0071e3" strokeWidth="1.5" />
      <path
        d="M27 6.5c1.8 2.2 2.8 3.6 2.8 4.8a2.8 2.8 0 1 1-5.6 0c0-1.2 1-2.6 2.8-4.8z"
        fill="#0071e3"
      />
      <path d="M25.5 12.5h3" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}
