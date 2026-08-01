import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif'
const MAX_BYTES = 10 * 1024 * 1024

interface ReportPhotoUploadProps {
  previewUrl: string | null
  fileName: string | null
  onChange: (file: File | null) => void
}

export function ReportPhotoUpload({ previewUrl, fileName, onChange }: ReportPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndSet = (file: File | undefined) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPEG, PNG, or WebP).')
      return
    }

    if (file.size > MAX_BYTES) {
      setError('Image must be under 10 MB.')
      return
    }

    setError(null)
    onChange(file)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndSet(e.target.files?.[0])
  }

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragOver(false)
    validateAndSet(e.dataTransfer.files?.[0])
  }

  const openPicker = () => inputRef.current?.click()

  const handleRemove = () => {
    setError(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(' ') || undefined

  const hiddenInput = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={ACCEPT}
      capture="environment"
      className="sr-only"
      aria-describedby={describedBy}
      onChange={handleInputChange}
    />
  )

  if (previewUrl) {
    return (
      <div className="fw-report-photo-preview">
        {hiddenInput}
        <img
          src={previewUrl}
          alt={fileName ? `Selected photo: ${fileName}` : 'Selected report photo'}
          className="fw-report-photo-preview-img"
        />
        <div className="fw-report-photo-preview-actions">
          <button type="button" className="fw-btn-secondary flex-1" onClick={openPicker}>
            Change photo
          </button>
          <button type="button" className="fw-report-photo-remove flex-1" onClick={handleRemove}>
            Remove
          </button>
        </div>
        {fileName && (
          <p className="fw-type-meta text-center truncate" title={fileName}>
            {fileName}
          </p>
        )}
        {error && (
          <p id={errorId} className="fw-report-photo-error" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className={`fw-report-photo-drop aspect-[4/3] flex flex-col items-center justify-center gap-2 cursor-pointer ${
          dragOver ? 'is-dragover' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hiddenInput}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-fw-text-tertiary)" strokeWidth="1.5" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <circle cx="8.5" cy="10.5" r="1.5" />
          <path d="m21 17-5-5-4 4-2-2-5 5" />
        </svg>
        <span className="fw-type-body text-center px-4">
          <span className="text-[var(--color-fw-link)] font-medium">Choose a photo</span>
          <span className="text-[var(--color-fw-text-secondary)]"> or drag and drop</span>
        </span>
        <span className="fw-type-meta">JPEG, PNG, or WebP · up to 10 MB</span>
      </label>
      <p id={hintId} className="fw-type-meta">
        Include the drain or flooded area in the frame. On mobile, your camera may open automatically.
      </p>
      {error && (
        <p id={errorId} className="fw-report-photo-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
