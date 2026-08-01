import { useId } from 'react'
import type { IssueType } from '../../data/mock'

export type IssueSceneType = IssueType | 'all'

interface IssueSceneThumbProps {
  scene: IssueSceneType
  size?: number
  showGrid?: boolean
  className?: string
}

function SceneDefs({ uid, showGrid }: { uid: string; showGrid: boolean }) {
  return (
    <defs>
      <filter id={`fw-grain-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="4"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
        <feComponentTransfer in="mono" result="grain">
          <feFuncA type="linear" slope="0.55" intercept="-0.08" />
        </feComponentTransfer>
      </filter>

      <radialGradient id={`fw-vignette-${uid}`} cx="50%" cy="45%" r="68%">
        <stop offset="55%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
      </radialGradient>

      {showGrid && (
        <pattern id={`fw-grid-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.55" fill="#1a1a1a" opacity="0.055" />
        </pattern>
      )}
    </defs>
  )
}

function SceneFinish({ uid, showGrid }: { uid: string; showGrid: boolean }) {
  return (
    <>
      {showGrid && <rect width="32" height="32" fill={`url(#fw-grid-${uid})`} />}
      <rect
        width="32"
        height="32"
        filter={`url(#fw-grain-${uid})`}
        opacity="0.62"
        style={{ mixBlendMode: 'overlay' }}
      />
      <rect width="32" height="32" fill={`url(#fw-vignette-${uid})`} />
    </>
  )
}

export function IssueSceneThumb({
  scene,
  size = 32,
  showGrid = false,
  className = '',
}: IssueSceneThumbProps) {
  const uid = useId().replace(/:/g, '')

  switch (scene) {
    case 'flooded':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={showGrid} />
            <linearGradient id={`fw-flood-sky-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="45%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e3a5f" />
            </linearGradient>
            <linearGradient id={`fw-flood-water-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          <rect width="32" height="32" fill={`url(#fw-flood-sky-${uid})`} />

          {/* Rain */}
          {[4, 9, 14, 19, 24, 28].map((x, i) => (
            <line
              key={`rain-${x}`}
              x1={x}
              y1={2 + (i % 3)}
              x2={x - 1.5}
              y2={10 + (i % 4)}
              stroke="#e2e8f0"
              strokeWidth="0.6"
              opacity={0.25 + (i % 3) * 0.08}
              strokeLinecap="round"
            />
          ))}

          {/* Roofline */}
          <path
            d="M0 18 L6 13 L12 16 L18 12 L26 15 L32 13 V32 H0Z"
            fill="#334155"
            opacity="0.85"
          />

          {/* Water — layered waves */}
          <path
            d="M0 21.5 Q3 19 6 21.5 T12 21.5 T18 21.5 T24 21.5 T30 21.5 V32 H0Z"
            fill={`url(#fw-flood-water-${uid})`}
            opacity="0.92"
          />
          <path
            d="M0 24 Q4 21.5 8 24 T16 24 T24 24 T32 24 V32 H0Z"
            fill="#0ea5e9"
            opacity="0.55"
          />
          <path
            d="M2 23.5 Q5 22.5 8 23.5 T14 23.5"
            stroke="#bae6fd"
            strokeWidth="0.8"
            fill="none"
            opacity="0.7"
            strokeLinecap="round"
          />

          {/* Submerged curb + cone */}
          <rect x="3" y="20" width="26" height="2.5" rx="0.5" fill="#57534e" opacity="0.65" />
          <path d="M20 17.5 L21.5 14 H23.5 L25 17.5 Z" fill="#f97316" />
          <rect x="21" y="17.5" width="3" height="2" fill="#c2410c" />
          <path d="M21.2 15.2 H23.8" stroke="white" strokeWidth="0.7" opacity="0.85" />

          {/* Tiny car half in water */}
          <rect x="7" y="22" width="7" height="3" rx="1" fill="#64748b" />
          <circle cx="8.5" cy="25.5" r="1.1" fill="#1e293b" />
          <circle cx="12.5" cy="25.5" r="1.1" fill="#1e293b" />

          <SceneFinish uid={uid} showGrid={showGrid} />
        </svg>
      )

    case 'blocked':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={showGrid} />
            <linearGradient id={`fw-drain-bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ddd6fe" />
              <stop offset="55%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
            <linearGradient id={`fw-grate-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8a29e" />
              <stop offset="100%" stopColor="#57534e" />
            </linearGradient>
          </defs>

          <rect width="32" height="32" fill={`url(#fw-drain-bg-${uid})`} />

          {/* Wet pavement */}
          <ellipse cx="16" cy="27" rx="13" ry="3" fill="#312e81" opacity="0.25" />

          {/* Grate frame */}
          <rect x="6" y="11" width="20" height="16" rx="2.5" fill={`url(#fw-grate-${uid})`} />
          <rect x="7.5" y="12.5" width="17" height="13" rx="1.5" fill="#292524" opacity="0.35" />

          {/* Grate bars — slightly wobbly */}
          {[10, 13.5, 17, 20.5, 24].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="12"
              x2={x + (x === 17 ? 0 : 0.3)}
              y2="26"
              stroke="#44403c"
              strokeWidth="1.4"
              opacity="0.75"
              strokeLinecap="round"
            />
          ))}
          {[15, 19, 23].map((y) => (
            <line
              key={`h${y}`}
              x1="7"
              y1={y}
              x2="25"
              y2={y + 0.2}
              stroke="#44403c"
              strokeWidth="1.1"
              opacity="0.55"
              strokeLinecap="round"
            />
          ))}

          {/* Debris pile — personality */}
          <ellipse cx="19" cy="10.5" rx="5" ry="2.5" fill="#65a30d" opacity="0.85" />
          <path d="M15 9 Q17 6.5 19 8 Q21 6 23 9" fill="#84cc16" opacity="0.9" />
          <ellipse cx="13" cy="11" rx="2.2" ry="1.4" fill="#78716c" />
          <path
            d="M12 10.5 Q13 9 14 10.5"
            stroke="#44403c"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x="21"
            y="9.5"
            width="2"
            height="3"
            rx="0.4"
            fill="#0284c7"
            opacity="0.8"
            transform="rotate(12 22 11)"
          />

          {/* Weed peeking through */}
          <path
            d="M11 26 Q11.5 23.5 12 26 Q12.5 24 13 26"
            stroke="#4ade80"
            strokeWidth="0.9"
            fill="none"
            strokeLinecap="round"
          />

          <SceneFinish uid={uid} showGrid={showGrid} />
        </svg>
      )

    case 'dumping':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={showGrid} />
            <linearGradient id={`fw-dump-bg-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>

          <rect width="32" height="32" fill={`url(#fw-dump-bg-${uid})`} />

          {/* Ground shadow */}
          <ellipse cx="16" cy="28" rx="12" ry="2.5" fill="#78350f" opacity="0.35" />

          {/* Bin — bulging */}
          <path d="M9.5 10 H22.5 L21 25.5 H11 Z" fill="#78350f" />
          <path d="M10 10 Q16 7 22 10" stroke="#451a03" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <rect x="14" y="7.5" width="4" height="2.5" rx="0.6" fill="#57534e" />
          <path d="M11 14 Q16 16.5 21 14" stroke="#451a03" strokeWidth="0.8" fill="none" opacity="0.5" />

          {/* Overflow bags */}
          <ellipse cx="8" cy="24" rx="3.5" ry="2.2" fill="#44403c" />
          <path d="M6 24 Q8 21 10 24" fill="#57534e" />
          <ellipse cx="24" cy="23.5" rx="3" ry="2" fill="#a8a29e" />
          <rect x="22" y="21" width="4" height="3" rx="0.8" fill="#d6d3d1" transform="rotate(-8 24 22.5)" />

          {/* Cardboard + bottle */}
          <path d="M13 26 L17 24 L19 27 L15 29 Z" fill="#d97706" opacity="0.85" />
          <rect x="18" y="20" width="1.8" height="5" rx="0.4" fill="#059669" transform="rotate(6 19 22.5)" />
          <circle cx="19" cy="19.5" r="1" fill="#059669" />

          {/* Stink lines — playful */}
          {[15, 18, 21].map((x, i) => (
            <path
              key={`stink-${x}`}
              d={`M${x} 8 Q${x + (i - 1) * 1.5} 5.5 ${x} 3`}
              stroke="#451a03"
              strokeWidth="0.7"
              fill="none"
              opacity={0.35 + i * 0.1}
              strokeLinecap="round"
            />
          ))}

          <SceneFinish uid={uid} showGrid={showGrid} />
        </svg>
      )

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
          <defs>
            <SceneDefs uid={uid} showGrid={showGrid} />
            <linearGradient id={`fw-all-bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5f5f4" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>
          </defs>

          <rect width="32" height="32" fill={`url(#fw-all-bg-${uid})`} />

          {/* Map fold lines */}
          <path d="M16 2 V30" stroke="#a8a29e" strokeWidth="0.5" opacity="0.35" />
          <path d="M2 16 H30" stroke="#a8a29e" strokeWidth="0.5" opacity="0.25" />

          {/* Roads — hand-drawn curves */}
          <path
            d="M4 24 Q12 18 20 22 T28 14"
            stroke="#cbd5e1"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M6 10 Q14 14 22 8"
            stroke="#e2e8f0"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Pins with little shadows */}
          {[
            { cx: 11, cy: 20, fill: '#0071e3' },
            { cx: 21, cy: 17, fill: '#7c3aed' },
            { cx: 18, cy: 24, fill: '#b45309' },
          ].map(({ cx, cy, fill }) => (
            <g key={`${cx}-${cy}`}>
              <ellipse cx={cx} cy={cy + 2.5} rx="2.2" ry="0.8" fill="#000" opacity="0.12" />
              <circle cx={cx} cy={cy} r="2.8" fill={fill} stroke="white" strokeWidth="1.1" />
              <circle cx={cx} cy={cy} r="1" fill="white" opacity="0.55" />
            </g>
          ))}

          <SceneFinish uid={uid} showGrid={showGrid} />
        </svg>
      )
  }
}
