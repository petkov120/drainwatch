import type { CSSProperties } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { NavSceneThumb, type NavSceneType } from './nav/NavSceneThumb'

export const citizenTabs = [
  { to: '/', label: 'Nearby', shortLabel: 'Nearby', scene: 'nearby' as const },
  { to: '/report', label: 'Report', shortLabel: 'Report', scene: 'report' as const },
  { to: '/my-reports', label: 'My Reports', shortLabel: 'Reports', scene: 'reports' as const },
  { to: '/dashboard', label: 'Dashboard', shortLabel: 'Ops', scene: 'dashboard' as const },
  { to: '/profile', label: 'Profile', shortLabel: 'Profile', scene: 'profile' as const },
] as const

interface NavTab {
  to: string
  label: string
  shortLabel: string
  scene: NavSceneType
}

export function NavLogo({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="no-underline hover:no-underline shrink-0">
      <div className={compact ? 'fw-type-brand' : 'text-lg font-bold tracking-tight text-[var(--color-fw-text)]'}>
        FloodWatch
      </div>
      <div className="fw-type-brand-sub mt-0.5">Lagos</div>
    </Link>
  )
}

/** Glass chip nav — floating pill tabs */
export function NavGlassChip({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <nav
      className={`fw-nav-chip fw-float-pill pointer-events-auto ${className}`}
      style={style}
      aria-label="Main navigation"
      data-tour="main-nav"
    >
      {(citizenTabs as readonly NavTab[]).map(({ to, label, scene }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `fw-nav-chip-item no-underline hover:no-underline ${isActive ? 'is-active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`fw-nav-chip-thumb ${isActive ? 'is-active' : ''}`} aria-hidden>
                <NavSceneThumb scene={scene} size={18} />
              </span>
              <span className="fw-nav-chip-label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/** Map overlay — split floating pills (reference: canvas UI) */
export function NavMapOverlay() {
  return (
    <>
      <div className="absolute top-4 left-4 z-[500] hidden lg:flex items-center gap-3 pointer-events-none">
        <div className="fw-float-pill pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-2 shrink-0">
          <NavLogo compact />
          <span className="w-px h-5 bg-[var(--color-fw-divider)] shrink-0" aria-hidden />
          <Link
            to="/report"
            className="fw-type-nav text-[var(--color-fw-text)] no-underline hover:no-underline whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="fw-nav-chip-thumb">
              <NavSceneThumb scene="report" size={16} />
            </span>
            Report
          </Link>
        </div>
        <NavGlassChip className="pointer-events-auto shrink-0" />
      </div>
      <NavMobilePill />
    </>
  )
}

/** Top bar — in-flow pages */
export function NavTopBar({ overlay = false }: { overlay?: boolean }) {
  if (overlay) return <NavMapOverlay />

  return (
    <>
      <header className="hidden lg:flex shrink-0 px-4 pt-4 pb-2 items-center gap-3">
        <div className="fw-float-pill flex items-center gap-3 pl-4 pr-3 py-2 shrink-0">
          <NavLogo compact />
          <span className="w-px h-5 bg-[var(--color-fw-divider)] shrink-0" aria-hidden />
          <Link
            to="/report"
            className="fw-type-nav text-[var(--color-fw-text)] no-underline hover:no-underline flex items-center gap-1.5"
          >
            <span className="fw-nav-chip-thumb">
              <NavSceneThumb scene="report" size={16} />
            </span>
            Report
          </Link>
        </div>
        <NavGlassChip className="shrink-0" />
      </header>
      <NavMobilePill />
    </>
  )
}

/** @deprecated Use NavTopBar — kept for imports */
export function NavSidebar() {
  return null
}

/** Glass pill nav — mobile (all routes) */
export function NavMobilePill() {
  return (
    <nav
      className="lg:hidden fixed bottom-4 inset-x-4 z-[500] fw-nav-mobile pointer-events-auto"
      aria-label="Main navigation"
      data-tour="main-nav"
    >
      {(citizenTabs as readonly NavTab[]).map(({ to, shortLabel, scene }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `fw-nav-mobile-item no-underline hover:no-underline ${isActive ? 'is-active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`fw-nav-chip-thumb fw-nav-chip-thumb--mobile ${isActive ? 'is-active' : ''}`}>
                <NavSceneThumb scene={scene} size={22} />
              </span>
              <span className="fw-nav-mobile-label">{shortLabel}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

// Legacy exports for compatibility
export const CitizenBottomNav = NavMobilePill
export const CitizenSideNav = NavSidebar
