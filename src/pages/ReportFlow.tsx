import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader, PageShell } from '../components/PageHeader'
import {
  IssueType,
  issueTypeLabels,
  issueTypeDescriptions,
} from '../data/mock'

const steps = ['Issue', 'Photo', 'Location', 'Review'] as const

export function ReportFlowPage() {
  const [step, setStep] = useState(0)
  const [issueType, setIssueType] = useState<IssueType | null>(null)
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-fw-primary-container)] flex items-center justify-center text-[var(--color-fw-primary)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-xl font-normal">Report received</h1>
          <p className="text-sm text-[var(--color-fw-text-secondary)]">
            Your report has been sent to Lagos drainage response teams.
          </p>
          <p className="text-sm text-[var(--color-fw-text)]">
            Reference: <strong>FW-2848</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link to="/reports/FW-2847" className="fw-btn-secondary flex-1 no-underline hover:no-underline">
              View report
            </Link>
            <button type="button" className="fw-btn-primary flex-1" onClick={() => navigate('/')}>
              Back to nearby
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageShell
      header={
        <PageHeader
          title="Report an issue"
          subtitle={`Step ${step + 1} of ${steps.length} — ${steps[step]}`}
        />
      }
    >
      <div className="max-w-lg mx-auto px-4 py-6 lg:py-8">
        <Link to="/" className="text-sm text-[var(--color-fw-link)] lg:hidden">
          ← Cancel
        </Link>

        <header className="mt-4 lg:mt-0 mb-8">
          <h1 className="text-xl font-bold lg:hidden">Report an issue</h1>
          <p className="text-[13px] text-[var(--color-fw-text-secondary)] mt-1 lg:hidden">
            Step {step + 1} of {steps.length} — {steps[step]}
          </p>
          <div className="fw-progress-bar mt-4 rounded-full overflow-hidden">
            <div
              className="fw-progress-fill"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </header>

        {step === 0 && (
          <StepIssue
            selected={issueType}
            onSelect={setIssueType}
            onContinue={() => issueType && setStep(1)}
          />
        )}
        {step === 1 && (
          <StepPhoto onBack={() => setStep(0)} onContinue={() => setStep(2)} />
        )}
        {step === 2 && (
          <StepLocation onBack={() => setStep(1)} onContinue={() => setStep(3)} />
        )}
        {step === 3 && (
          <StepReview
            issueType={issueType!}
            description={description}
            onDescriptionChange={setDescription}
            onBack={() => setStep(2)}
            onSubmit={() => setSubmitted(true)}
          />
        )}
      </div>
    </PageShell>
  )
}

function StepIssue({
  selected,
  onSelect,
  onContinue,
}: {
  selected: IssueType | null
  onSelect: (t: IssueType) => void
  onContinue: () => void
}) {
  const types: IssueType[] = ['flooded', 'blocked', 'dumping']
  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-fw-text-secondary)]">
        Select the issue type you observed.
      </p>
      <ul className="border border-[var(--color-fw-divider)] divide-y divide-[var(--color-fw-divider)]">
        {types.map((type) => (
          <li key={type}>
            <label className="flex items-start gap-3 px-4 py-4 cursor-pointer hover:bg-[var(--color-fw-surface-secondary)]">
              <input
                type="radio"
                name="issue"
                checked={selected === type}
                onChange={() => onSelect(type)}
                className="mt-1"
              />
              <div>
                <div className="text-sm text-[var(--color-fw-text)]">
                  {issueTypeLabels[type]}
                </div>
                <div className="text-xs text-[var(--color-fw-text-secondary)] mt-0.5">
                  {issueTypeDescriptions[type]}
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="fw-btn-primary w-full"
        disabled={!selected}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  )
}

function StepPhoto({
  onBack,
  onContinue,
}: {
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-fw-text-secondary)]">
        A clear photo helps responders assess the issue.
      </p>
      <div className="aspect-[4/3] border border-dashed border-[var(--color-fw-border)] bg-[var(--color-fw-surface-secondary)] flex flex-col items-center justify-center gap-2">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-fw-text-tertiary)" strokeWidth="1.5" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <circle cx="8.5" cy="10.5" r="1.5" />
          <path d="m21 17-5-5-4 4-2-2-5 5" />
        </svg>
        <span className="text-sm text-[var(--color-fw-text)]">Take photo or choose from gallery</span>
      </div>
      <p className="text-xs text-[var(--color-fw-text-secondary)]">
        Include the drain or flooded area in the frame.
      </p>
      <div className="flex gap-3">
        <button type="button" className="fw-btn-secondary flex-1" onClick={onBack}>
          Back
        </button>
        <button type="button" className="fw-btn-primary flex-1" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

function StepLocation({
  onBack,
  onContinue,
}: {
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-fw-text-secondary)]">
        We use GPS to route your report to the correct area.
      </p>
      <div className="aspect-[16/10] fw-map-bg border border-[var(--color-fw-border)] relative">
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-full"
          style={{ top: '50%', left: '50%' }}
        >
          <svg viewBox="0 0 24 36" className="w-6 h-9 text-[var(--color-fw-flooded)]" aria-hidden>
            <path fill="currentColor" d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 17 9 17s9-10.25 9-17c0-4.97-4.03-9-9-9z" />
            <circle cx="12" cy="9" r="3" fill="white" />
          </svg>
        </div>
      </div>
      <div>
        <p className="text-sm text-[var(--color-fw-text)]">Admiralty Way, Lekki Phase 1</p>
        <p className="text-sm text-[var(--color-fw-text-secondary)]">Lagos State</p>
      </div>
      <div className="flex gap-3">
        <button type="button" className="fw-btn-secondary flex-1" onClick={onBack}>
          Back
        </button>
        <button type="button" className="fw-btn-primary flex-1" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

function StepReview({
  issueType,
  description,
  onDescriptionChange,
  onBack,
  onSubmit,
}: {
  issueType: IssueType
  description: string
  onDescriptionChange: (v: string) => void
  onBack: () => void
  onSubmit: () => void
}) {
  const [confirmed, setConfirmed] = useState(false)
  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-fw-text-secondary)]">
        Review your report before submitting.
      </p>
      <dl className="fw-infobox text-sm">
        <InfoboxRowSimple label="Issue type" value={issueTypeLabels[issueType]} />
        <InfoboxRowSimple label="Location" value="Admiralty Way, Lekki Phase 1" />
        <InfoboxRowSimple label="Photo" value="Attached" />
      </dl>
      <div>
        <label htmlFor="desc" className="text-sm text-[var(--color-fw-text)] block mb-2">
          Description (optional)
        </label>
        <textarea
          id="desc"
          rows={4}
          maxLength={280}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe what you see…"
          className="w-full border border-[var(--color-fw-border)] p-3 text-sm resize-none outline-none focus:border-[var(--color-fw-primary)]"
        />
        <p className="text-xs text-[var(--color-fw-text-secondary)] mt-1">
          {description.length} / 280
        </p>
      </div>
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5"
        />
        <span>I confirm this report is accurate</span>
      </label>
      <div className="flex gap-3">
        <button type="button" className="fw-btn-secondary flex-1" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="fw-btn-primary flex-1"
          disabled={!confirmed}
          onClick={onSubmit}
        >
          Submit report
        </button>
      </div>
    </div>
  )
}

function InfoboxRowSimple({ label, value }: { label: string; value: string }) {
  return (
    <div className="fw-infobox-row">
      <dt className="fw-infobox-label">{label}</dt>
      <dd className="fw-infobox-value">{value}</dd>
    </div>
  )
}
