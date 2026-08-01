import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader, PageShell } from '../components/PageHeader'
import { StatusBadge } from '../components/badges/ReportBadges'
import { IssueTypePicker } from '../components/map/IssueTypePicker'
import { IssueSceneThumb } from '../components/map/IssueSceneThumb'
import {
  ReportFlowActions,
  ReportFlowSection,
  ReportFlowStep,
} from '../components/report/ReportFlowStep'
import { ReportFlowStepNav } from '../components/report/ReportFlowStepNav'
import { ReportPhotoUpload } from '../components/report/ReportPhotoUpload'
import { IssueType, issueTypeLabels } from '../data/mock'

const steps = ['Issue', 'Photo', 'Location', 'Review'] as const

export function ReportFlowPage() {
  const [step, setStep] = useState(0)
  const [issueType, setIssueType] = useState<IssueType | null>(null)
  const [description, setDescription] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handlePhotoChange = useCallback((file: File | null) => {
    setPhotoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    setPhotoFile(file)
  }, [])

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    }
  }, [photoPreviewUrl])

  const goToStep = useCallback((index: number) => {
    if (index < step) setStep(index)
  }, [step])

  const shell = (content: React.ReactNode, title: string, subtitle: string) => (
    <PageShell header={<PageHeader title={title} subtitle={subtitle} />}>
      <div className="max-w-3xl mx-auto lg:max-w-2xl">{content}</div>
    </PageShell>
  )

  if (submitted) {
    return shell(
      <>
        <h1 className="fw-type-display lg:hidden mb-6">Report received</h1>
        <div className="fw-panel-card p-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-fw-primary-container)] flex items-center justify-center text-[var(--color-fw-primary)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="fw-type-lead">Sent to Lagos drainage teams</p>
          <p className="fw-type-body text-[var(--color-fw-text-secondary)]">
            Reference <strong className="text-[var(--color-fw-text)] font-semibold">FW-2848</strong>
            {' '}· updates will appear in My reports and Nearby.
          </p>
        </div>

        {issueType && (
          <div className="fw-panel-card mt-5">
            <ReportPreviewRow
              issueType={issueType}
              photoPreviewUrl={photoPreviewUrl}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <Link to="/reports/FW-2847" className="fw-btn-secondary flex-1 no-underline hover:no-underline text-center">
            View report
          </Link>
          <button type="button" className="fw-btn-primary flex-1" onClick={() => navigate('/')}>
            Back to nearby
          </button>
        </div>
      </>,
      'Report received',
      'Reference FW-2848'
    )
  }

  return shell(
    <>
      <Link
        to="/"
        className="lg:hidden fw-type-body font-medium text-[var(--color-fw-link)] no-underline hover:no-underline mb-4 inline-block"
      >
        ← Cancel
      </Link>
      <h1 className="fw-type-display lg:hidden mb-6">Report an issue</h1>

      <ReportFlowStepNav step={step} steps={steps} onGoToStep={goToStep} />

      {step === 0 && (
        <StepIssue
          selected={issueType}
          onSelect={setIssueType}
          onContinue={() => issueType && setStep(1)}
        />
      )}
      {step === 1 && (
        <StepPhoto
          previewUrl={photoPreviewUrl}
          fileName={photoFile?.name ?? null}
          onPhotoChange={handlePhotoChange}
          onBack={() => setStep(0)}
          onContinue={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepLocation onBack={() => setStep(1)} onContinue={() => setStep(3)} />
      )}
      {step === 3 && issueType && (
        <StepReview
          issueType={issueType}
          description={description}
          photoPreviewUrl={photoPreviewUrl}
          photoFileName={photoFile?.name ?? null}
          onDescriptionChange={setDescription}
          onBack={() => setStep(2)}
          onSubmit={() => setSubmitted(true)}
        />
      )}
    </>,
    'Report an issue',
    'Submit a new flood or drainage issue'
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
  return (
    <ReportFlowStep
      intro="Select the issue type you observed."
      actions={
        <ReportFlowActions
          onPrimary={onContinue}
          primaryLabel="Continue"
          primaryDisabled={!selected}
        />
      }
    >
      <IssueTypePicker value={selected} onChange={onSelect} />
    </ReportFlowStep>
  )
}

function StepPhoto({
  previewUrl,
  fileName,
  onPhotoChange,
  onBack,
  onContinue,
}: {
  previewUrl: string | null
  fileName: string | null
  onPhotoChange: (file: File | null) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <ReportFlowStep
      intro="A clear photo helps responders assess the issue."
      bare
      actions={
        <ReportFlowActions onBack={onBack} onPrimary={onContinue} primaryLabel="Continue" />
      }
    >
      <div className="fw-panel-card p-4">
        <ReportPhotoUpload previewUrl={previewUrl} fileName={fileName} onChange={onPhotoChange} />
      </div>
    </ReportFlowStep>
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
    <ReportFlowStep
      intro="We use GPS to route your report to the correct area."
      bare
      actions={
        <ReportFlowActions onBack={onBack} onPrimary={onContinue} primaryLabel="Continue" />
      }
    >
      <div className="fw-panel-card overflow-hidden">
        <div className="aspect-[16/10] fw-map-bg relative overflow-hidden">
          <div className="absolute inset-0 fw-map-vignette pointer-events-none opacity-60" aria-hidden />
          <div
            className="absolute w-6 h-6 -translate-x-1/2 -translate-y-full z-[1]"
            style={{ top: '50%', left: '50%' }}
          >
            <svg viewBox="0 0 24 36" className="w-6 h-9 text-[var(--color-fw-flooded)]" aria-hidden>
              <path fill="currentColor" d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 17 9 17s9-10.25 9-17c0-4.97-4.03-9-9-9z" />
              <circle cx="12" cy="9" r="3" fill="white" />
            </svg>
          </div>
        </div>
        <div className="px-4 py-4 border-t border-[var(--color-fw-divider)]">
          <p className="fw-type-title">Admiralty Way, Lekki Phase 1</p>
          <p className="fw-type-meta mt-0.5">Lagos State · GPS confirmed</p>
        </div>
      </div>
    </ReportFlowStep>
  )
}

function StepReview({
  issueType,
  description,
  photoPreviewUrl,
  photoFileName,
  onDescriptionChange,
  onBack,
  onSubmit,
}: {
  issueType: IssueType
  description: string
  photoPreviewUrl: string | null
  photoFileName: string | null
  onDescriptionChange: (v: string) => void
  onBack: () => void
  onSubmit: () => void
}) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="space-y-5 fw-panel-enter">
      <p className="fw-type-body text-[var(--color-fw-text-secondary)]">
        Review your report before submitting.
      </p>

      <div className="fw-panel-card">
        <ReportPreviewRow issueType={issueType} photoPreviewUrl={photoPreviewUrl} />
      </div>

      {photoPreviewUrl && photoFileName && (
        <p className="fw-type-meta -mt-2 px-1 truncate" title={photoFileName}>
          Photo: {photoFileName}
        </p>
      )}

      <ReportFlowSection title="Description (optional)">
        <label htmlFor="desc" className="sr-only">
          Description
        </label>
        <textarea
          id="desc"
          rows={4}
          maxLength={280}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe what you see…"
          className="fw-comment-input"
        />
        <p className="fw-type-meta mt-2">{description.length} / 280</p>
      </ReportFlowSection>

      <div className="fw-panel-card p-4">
        <label className="flex items-start gap-2 fw-type-body cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>I confirm this report is accurate</span>
        </label>
      </div>

      <ReportFlowActions
        onBack={onBack}
        onPrimary={onSubmit}
        primaryLabel="Submit report"
        primaryDisabled={!confirmed}
      />
    </div>
  )
}

function ReportPreviewRow({
  issueType,
  photoPreviewUrl,
}: {
  issueType: IssueType
  photoPreviewUrl: string | null
}) {
  return (
    <div className="fw-report-card border-none cursor-default hover:!bg-transparent">
      <div className="w-14 h-14 shrink-0 rounded-xl border border-[var(--color-fw-divider)] overflow-hidden fw-nearby-card-thumb">
        {photoPreviewUrl ? (
          <img
            src={photoPreviewUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-fw-surface-secondary)]">
            <IssueSceneThumb scene={issueType} size={44} className="rounded-lg" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <span className="fw-type-caption">{issueTypeLabels[issueType]}</span>
        <h3 className="fw-type-title truncate">Admiralty Way, Lekki Phase 1</h3>
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <StatusBadge status="received" />
        </div>
        <p className="fw-type-meta pt-0.5">New report · pending submission</p>
      </div>
    </div>
  )
}
