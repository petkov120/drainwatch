import type { CSSProperties } from 'react'
import type { IssueType } from '../../data/mock'
import { issueTypeDescriptions, issueTypeLabels } from '../../data/mock'
import { IssueSceneThumb } from './IssueSceneThumb'

const options: {
  key: IssueType
  ring: string
}[] = [
  { key: 'flooded', ring: '#0071e3' },
  { key: 'blocked', ring: '#7c3aed' },
  { key: 'dumping', ring: '#b45309' },
]

interface IssueTypePickerProps {
  value: IssueType | null
  onChange: (value: IssueType) => void
}

export function IssueTypePicker({ value, onChange }: IssueTypePickerProps) {
  return (
    <div className="fw-issue-pick-list" role="radiogroup" aria-label="Issue type">
      {options.map(({ key, ring }) => {
        const selected = value === key
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(key)}
            className={`fw-issue-pick-card ${selected ? 'is-selected' : ''}`}
            style={selected ? ({ '--pick-ring': ring } as CSSProperties) : undefined}
          >
            <IssuePickSquircle scene={key} ring={ring} active={selected} />
            <span className="min-w-0 flex-1 text-left">
              <span className="fw-type-title block">{issueTypeLabels[key]}</span>
              <span className="fw-type-meta block mt-0.5">{issueTypeDescriptions[key]}</span>
            </span>
            <span
              className={`fw-issue-pick-check ${selected ? 'is-visible' : ''}`}
              aria-hidden
            >
              {selected && (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6l2.5 2.5 4.5-5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function IssuePickSquircle({
  scene,
  ring,
  active,
}: {
  scene: IssueType
  ring: string
  active: boolean
}) {
  return (
    <div
      className={`fw-issue-pick-squircle ${active ? 'is-active' : ''}`}
      style={{
        boxShadow: active
          ? `inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px ${ring}33`
          : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.06)',
        borderColor: active ? `${ring}44` : 'rgba(0,0,0,0.06)',
      }}
      aria-hidden
    >
      <div
        className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
        style={{ boxShadow: active ? `0 0 0 1.5px ${ring}22` : undefined }}
      >
        <IssueSceneThumb scene={scene} size={40} />
      </div>
    </div>
  )
}
