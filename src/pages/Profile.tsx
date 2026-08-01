import { Link } from 'react-router-dom'
import { PageHeader, PageShell } from '../components/PageHeader'
import { useReports } from '../context/ReportsContext'

const settings = [
  { label: 'Notifications', href: '#' },
  { label: 'Language', value: 'English', href: '#' },
  { label: 'Help & FAQ', href: '#' },
  { label: 'Privacy policy', href: '#' },
]

export function ProfilePage() {
  const { resetDemo } = useReports()

  return (
    <PageShell header={<PageHeader title="Profile" />}>
      <div className="max-w-lg mx-auto lg:max-w-xl">
        <h1 className="fw-type-display lg:hidden mb-6">Profile</h1>

        <div className="flex items-center gap-4 p-5 fw-panel-card">
          <div className="w-14 h-14 rounded-full bg-[var(--color-fw-primary-container)] text-[var(--color-fw-primary)] flex items-center justify-center fw-type-title">
            AO
          </div>
          <div className="space-y-0.5">
            <p className="fw-type-title">Ada O.</p>
            <p className="fw-type-meta">@ada_lagos</p>
          </div>
        </div>

        <ul className="mt-5 fw-panel-card divide-y divide-[var(--color-fw-divider)]">
          {settings.map(({ label, value, href }) => (
            <li key={label}>
              <Link
                to={href}
                className="flex items-center justify-between px-5 py-4 fw-type-body no-underline hover:bg-[var(--color-fw-panel)]"
              >
                <span className="text-[var(--color-fw-text)]">{label}</span>
                {value && (
                  <span className="fw-type-meta">{value}</span>
                )}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={resetDemo}
              className="w-full text-left px-5 py-4 fw-type-body text-[var(--color-fw-link)] bg-transparent border-none cursor-pointer hover:bg-[var(--color-fw-panel)]"
            >
              Reset demo data
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full text-left px-5 py-4 fw-type-body text-[var(--color-fw-flooded)] bg-transparent border-none cursor-pointer hover:bg-[var(--color-fw-panel)]"
            >
              Sign out
            </button>
          </li>
        </ul>

        <footer className="mt-10 fw-type-caption space-y-1.5 px-1">
          <p>FloodWatch · Lagos · A civic reporting tool</p>
          <p>Version 1.0.0</p>
        </footer>
      </div>
    </PageShell>
  )
}
