import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="hidden lg:flex items-center h-14 px-6 border-b border-[var(--color-fw-divider)] shrink-0 bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-[17px] font-bold text-[var(--color-fw-text)]">{title}</h1>
        {subtitle && (
          <p className="text-[13px] text-[var(--color-fw-text-secondary)]">{subtitle}</p>
        )}
      </div>
    </header>
  )
}

export function PageShell({ header, children }: { header?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {header}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
