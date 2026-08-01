import type { ReactNode } from 'react'

interface ReportFlowStepProps {
  intro?: string
  children: ReactNode
  actions: ReactNode
  bare?: boolean
}

export function ReportFlowStep({ intro, children, actions, bare = false }: ReportFlowStepProps) {
  return (
    <div className="space-y-5 fw-panel-enter">
      {intro && (
        <p className="fw-type-body text-[var(--color-fw-text-secondary)]">{intro}</p>
      )}
      {bare ? children : <div className="fw-panel-card p-4">{children}</div>}
      {actions}
    </div>
  )
}

interface ReportFlowActionsProps {
  onBack?: () => void
  backLabel?: string
  onPrimary: () => void
  primaryLabel: string
  primaryDisabled?: boolean
}

export function ReportFlowActions({
  onBack,
  backLabel = 'Back',
  onPrimary,
  primaryLabel,
  primaryDisabled,
}: ReportFlowActionsProps) {
  return (
    <div className="flex gap-3 pt-1">
      {onBack ? (
        <button type="button" className="fw-btn-secondary flex-1" onClick={onBack}>
          {backLabel}
        </button>
      ) : null}
      <button
        type="button"
        className="fw-btn-primary flex-1"
        disabled={primaryDisabled}
        onClick={onPrimary}
      >
        {primaryLabel}
      </button>
    </div>
  )
}

interface ReportFlowSectionProps {
  title: string
  children: ReactNode
}

export function ReportFlowSection({ title, children }: ReportFlowSectionProps) {
  return (
    <section className="fw-panel-card overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-fw-divider)] bg-[var(--color-fw-surface-secondary)]">
        <h3 className="fw-type-title">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}
