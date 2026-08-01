interface ReportFlowStepNavProps {
  step: number
  steps: readonly string[]
  onGoToStep?: (index: number) => void
}

export function ReportFlowStepNav({ step, steps, onGoToStep }: ReportFlowStepNavProps) {
  return (
    <nav
      className="flex gap-5 mb-6 border-b border-[var(--color-fw-divider)] overflow-x-auto"
      aria-label="Report steps"
      data-tour="report-flow-nav"
    >
      {steps.map((label, i) => {
        const active = i === step
        const done = i < step
        const canNavigate = done && onGoToStep

        return (
          <button
            key={label}
            type="button"
            disabled={!active && !canNavigate}
            onClick={() => canNavigate && onGoToStep(i)}
            aria-current={active ? 'step' : undefined}
            className={`pb-3 fw-type-nav bg-transparent border-none shrink-0 -mb-px transition-colors ${
              active
                ? 'text-[var(--color-fw-text)] border-b-2 border-[var(--color-fw-text)] font-bold cursor-default'
                : done
                  ? 'text-[var(--color-fw-link)] cursor-pointer'
                  : 'text-[var(--color-fw-text-tertiary)] cursor-default'
            }`}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}
