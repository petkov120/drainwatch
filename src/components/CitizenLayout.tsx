import { useLocation, Outlet } from 'react-router-dom'
import { NavTopBar } from './CitizenNav'

export function CitizenLayout() {
  const { pathname } = useLocation()
  const isMapPage = pathname === '/'

  if (isMapPage) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-[#e8e4df]">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-fw-surface-secondary)]">
      <NavTopBar />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden px-3 pb-20 lg:px-4 lg:pb-4">
        <div className="flex-1 flex flex-col min-h-0 fw-glass-panel rounded-2xl overflow-hidden bg-white/90">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
