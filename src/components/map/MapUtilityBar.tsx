import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { SearchBar } from '../SearchBar'

export function MapUtilityBar({ style }: { style?: CSSProperties }) {
  return (
    <div
      className="absolute top-4 z-[500] hidden lg:flex pointer-events-none transition-[right] duration-300 ease-out"
      style={style}
    >
      <div className="fw-float-pill flex items-center gap-2 pl-3 pr-2 py-1 pointer-events-auto">
        <SearchBar
          placeholder="Search…"
          className="!h-9 !px-0 !bg-transparent !border-none !shadow-none min-w-[140px] max-w-[180px]"
        />
        <span className="w-px h-5 bg-[var(--color-fw-divider)] shrink-0" aria-hidden />
        <Link
          to="/profile"
          className="w-8 h-8 rounded-full bg-[var(--color-fw-primary-container)] text-[var(--color-fw-primary)] flex items-center justify-center text-xs font-bold no-underline hover:no-underline shrink-0"
          aria-label="Profile"
        >
          AO
        </Link>
      </div>
    </div>
  )
}
