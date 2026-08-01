import type { CSSProperties } from 'react'
import { NavLink, Link } from 'react-router-dom'

export const citizenTabs = [
  { to: '/', label: 'Nearby', icon: MapIcon },
  { to: '/report', label: 'Report', icon: PlusIcon },
  { to: '/my-reports', label: 'My Reports', icon: ListIcon },
  { to: '/profile', label: 'Profile', icon: PersonIcon },
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
]

function navLinkClass(isActive: boolean, horizontal: boolean) {
  if (horizontal) {
    return `px-3 py-1.5 text-[13px] font-medium rounded-full no-underline hover:no-underline transition-colors ${
      isActive
        ? 'bg-[var(--color-fw-text)] text-white'
        : 'text-[var(--color-fw-text-secondary)] hover:bg-white/60 hover:text-[var(--color-fw-text)]'
    }`
  }
  return `group flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline hover:no-underline transition-colors ${
    isActive
      ? 'bg-white/80 text-[var(--color-fw-text)] font-semibold shadow-sm'
      : 'text-[var(--color-fw-text-secondary)] hover:bg-white/50 hover:text-[var(--color-fw-text)]'
  }`
}

export function NavLogo({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="no-underline hover:no-underline shrink-0">
      <div className={`font-semibold text-[var(--color-fw-text)] tracking-tight leading-tight ${compact ? 'text-[15px]' : 'text-lg'}`}>
        FloodWatch
      </div>
      <div className="text-[11px] text-[var(--color-fw-text-secondary)]">Lagos</div>
    </Link>
  )
}

/** Glass chip nav — map overlay (desktop) */
export function NavGlassChip({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <nav
      className={`fw-glass-chip p-1 flex items-center gap-0.5 pointer-events-auto ${className}`}
      style={style}
      aria-label="Main navigation"
    >
      {citizenTabs.map(({ to, label }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => navLinkClass(isActive, true)}>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

/** Top bar — logo + glass chip (map overlay or in-flow) */
export function NavTopBar({ overlay = false }: { overlay?: boolean }) {
  const bar = (
    <div className="flex items-center gap-3">
      <div className="fw-glass-chip pointer-events-auto px-4 py-2 shrink-0">
        <NavLogo compact />
      </div>
      <NavGlassChip className="pointer-events-auto shrink-0" />
    </div>
  )

  if (overlay) {
    return (
      <>
        <div className="absolute top-4 left-4 z-[500] hidden lg:flex pointer-events-none">{bar}</div>
        <NavMobilePill />
      </>
    )
  }

  return (
    <>
      <header className="hidden lg:flex shrink-0 px-4 pt-4 pb-2">{bar}</header>
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
      className="lg:hidden fixed bottom-4 inset-x-4 z-[500] fw-glass-panel rounded-full flex items-center justify-around px-1 py-1 pointer-events-auto"
      aria-label="Main navigation"
    >
      {citizenTabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-full no-underline hover:no-underline min-w-[52px] flex-1 max-w-[72px] ${
              isActive ? 'text-[var(--color-fw-primary)]' : 'text-[var(--color-fw-text-secondary)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon active={isActive} size={20} />
              <span className="text-[9px] font-medium truncate w-full text-center">
                {label.split(' ')[0]}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/** Map page overlay — same top nav as other routes */
export function NavMapOverlay() {
  return <NavTopBar overlay />
}

function MapIcon({ active, size = 26 }: { active?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
      <path d="M8 2v16M16 6v16" />
    </svg>
  )
}

function PlusIcon({ active, size = 26 }: { active?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" fill={active ? 'currentColor' : 'none'} />
      <path d="M12 8v8M8 12h8" stroke={active ? 'white' : 'currentColor'} strokeWidth="2" />
    </svg>
  )
}

function ListIcon({ size = 26 }: { active?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  )
}

function PersonIcon({ active, size = 26 }: { active?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function DashboardIcon({ active, size = 26 }: { active?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

// Legacy exports for compatibility
export const CitizenBottomNav = NavMobilePill
export const CitizenSideNav = NavSidebar
