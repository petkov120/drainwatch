import { useId } from 'react'
import { SceneDefs, SceneFinish } from '../map/IssueSceneThumb'

export type NavSceneType = 'nearby' | 'report' | 'reports' | 'dashboard' | 'profile'

interface NavSceneThumbProps {
  scene: NavSceneType
  size?: number
  className?: string
}

export function NavSceneThumb({ scene, size = 18, className = '' }: NavSceneThumbProps) {
  const uid = useId().replace(/:/g, '')

  switch (scene) {
    case 'nearby':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={false} />
            <linearGradient id={`fw-nav-map-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" fill={`url(#fw-nav-map-${uid})`} />
          <path
            d="M3 24 Q11 17 19 21 T29 13"
            stroke="#e2e8f0"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {[
            { cx: 10, cy: 19, fill: '#0071e3' },
            { cx: 20, cy: 16, fill: '#7c3aed' },
            { cx: 16, cy: 23, fill: '#b45309' },
          ].map(({ cx, cy, fill }) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="2.6" fill={fill} stroke="white" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="0.9" fill="white" opacity="0.6" />
            </g>
          ))}
          <circle cx="24" cy="9" r="4" fill="none" stroke="white" strokeWidth="1.2" opacity="0.55" />
          <SceneFinish uid={uid} showGrid={false} />
        </svg>
      )

    case 'report':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={false} />
            <linearGradient id={`fw-nav-report-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" fill={`url(#fw-nav-report-${uid})`} />
          {[6, 12, 18, 24].map((x, i) => (
            <line
              key={x}
              x1={x}
              y1={3 + (i % 2)}
              x2={x - 1}
              y2={9 + (i % 3)}
              stroke="#e0f2fe"
              strokeWidth="0.55"
              opacity="0.45"
              strokeLinecap="round"
            />
          ))}
          <path
            d="M16 7c2.2 2.8 3.5 4.6 3.5 6.2a3.5 3.5 0 1 1-7 0C12.5 11.6 13.8 9.8 16 7z"
            fill="#0071e3"
          />
          <circle cx="23" cy="9" r="5" fill="white" stroke="#0071e3" strokeWidth="1.2" />
          <path d="M23 6.5v5M20.5 9h5" stroke="#0071e3" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4 24 Q10 20 16 24 T28 24 V32 H4Z" fill="#0ea5e9" opacity="0.55" />
          <SceneFinish uid={uid} showGrid={false} />
        </svg>
      )

    case 'reports':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={false} />
            <linearGradient id={`fw-nav-list-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5f5f4" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" fill={`url(#fw-nav-list-${uid})`} />
          {[
            { y: 6, accent: '#0071e3', water: '#38bdf8' },
            { y: 13, accent: '#7c3aed', water: '#a78bfa' },
            { y: 20, accent: '#b45309', water: '#fbbf24' },
          ].map(({ y, accent, water }) => (
            <g key={y}>
              <rect x="5" y={y} width="22" height="6" rx="1.5" fill="white" opacity="0.92" />
              <rect x="5" y={y} width="1.5" height="6" rx="0.5" fill={accent} />
              <rect x="8" y={y + 1.5} width="8" height="1" rx="0.5" fill="#78716c" opacity="0.35" />
              <rect x="8" y={y + 3.2} width="5" height="0.8" rx="0.4" fill="#a8a29e" opacity="0.4" />
              <circle cx="23" cy={y + 3} r="2" fill={water} opacity="0.85" />
            </g>
          ))}
          <SceneFinish uid={uid} showGrid={false} />
        </svg>
      )

    case 'dashboard':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={false} />
            <linearGradient id={`fw-nav-dash-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ede9fe" />
              <stop offset="100%" stopColor="#5b21b6" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" fill={`url(#fw-nav-dash-${uid})`} />
          <rect x="5" y="5" width="10" height="10" rx="2" fill="white" opacity="0.9" />
          <rect x="6.5" y="11" width="2" height="2.5" rx="0.4" fill="#0071e3" />
          <rect x="9.5" y="9" width="2" height="4.5" rx="0.4" fill="#059669" />
          <rect x="12.5" y="10" width="2" height="3.5" rx="0.4" fill="#d97706" />
          <rect x="17" y="5" width="10" height="10" rx="2" fill="white" opacity="0.85" />
          <circle cx="22" cy="10" r="3" fill="#0071e3" opacity="0.2" />
          <circle cx="21" cy="9.5" r="1.5" fill="#0071e3" />
          <rect x="5" y="17" width="10" height="10" rx="2" fill="white" opacity="0.85" />
          <path d="M7 24 L10 20 L13 22 L16 18 L19 24" stroke="#7c3aed" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <rect x="17" y="17" width="10" height="10" rx="2" fill="white" opacity="0.9" />
          <rect x="19" y="21" width="6" height="1.2" rx="0.4" fill="#059669" opacity="0.8" />
          <rect x="19" y="23.2" width="4" height="1.2" rx="0.4" fill="#d97706" opacity="0.7" />
          <SceneFinish uid={uid} showGrid={false} />
        </svg>
      )

    case 'profile':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={false} />
            <linearGradient id={`fw-nav-profile-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8f2fd" />
              <stop offset="100%" stopColor="#0071e3" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" fill={`url(#fw-nav-profile-${uid})`} />
          <circle cx="16" cy="12" r="5.5" fill="#fff" opacity="0.95" />
          <path d="M7 27c0-5 4-8.5 9-8.5s9 3.5 9 8.5" fill="#fff" opacity="0.92" />
          <circle cx="16" cy="11.5" r="2" fill="#0071e3" opacity="0.25" />
          <path d="M14 26h4" stroke="#fff" strokeWidth="1" opacity="0.35" strokeLinecap="round" />
          <SceneFinish uid={uid} showGrid={false} />
        </svg>
      )
  }
}
