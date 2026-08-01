import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="hidden lg:flex items-center min-h-[4.5rem] px-8 py-5 border-b border-[var(--color-fw-divider)] shrink-0 bg-white sticky top-0 z-10">
      <div className="space-y-1">
        <h1 className="fw-type-lead">{title}</h1>
        {subtitle && <p className="fw-type-meta">{subtitle}</p>}
      </div>
    </header>
  )
}

export function PageShell({ header, children }: { header?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {header}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">{children}</div>
    </div>
  )
}
