import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl bg-[var(--color-fw-surface-secondary)] flex items-center justify-center mb-4"
        aria-hidden
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-fw-text-tertiary)" strokeWidth="1.5">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <h3 className="fw-type-title text-[1.0625rem]">{title}</h3>
      <p className="fw-type-body text-[var(--color-fw-text-secondary)] mt-2 max-w-[280px]">
        {description}
      </p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  )
}

export function ReportListSkeleton() {
  return (
    <div className="p-4 space-y-4" aria-busy="true" aria-label="Loading reports">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="fw-skeleton w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="fw-skeleton h-3 w-20" />
            <div className="fw-skeleton h-4 w-full" />
            <div className="fw-skeleton h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}
