import { ReactNode } from 'react'

interface InfoboxRowProps {
  label: string
  value: ReactNode
}

export function Infobox({ children }: { children: ReactNode }) {
  return <aside className="fw-infobox">{children}</aside>
}

export function InfoboxRow({ label, value }: InfoboxRowProps) {
  return (
    <div className="fw-infobox-row">
      <dt className="fw-infobox-label">{label}</dt>
      <dd className="fw-infobox-value">{value}</dd>
    </div>
  )
}

export function SectionHeader({ children }: { children: ReactNode }) {
  return <h2 className="fw-section-header">{children}</h2>
}
