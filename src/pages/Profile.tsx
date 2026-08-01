import { Link } from 'react-router-dom'
import { PageHeader, PageShell } from '../components/PageHeader'

const settings = [
  { label: 'Notifications', href: '#' },
  { label: 'Language', value: 'English', href: '#' },
  { label: 'Help & FAQ', href: '#' },
  { label: 'Privacy policy', href: '#' },
]

export function ProfilePage() {
  return (
    <PageShell header={<PageHeader title="Profile" />}>
      <div className="max-w-lg mx-auto lg:max-w-xl px-4 py-6">
        <h1 className="text-xl font-bold lg:hidden">Profile</h1>

        <div className="mt-6 lg:mt-0 flex items-center gap-4 p-4 fw-panel-card">
          <div className="w-14 h-14 rounded-full bg-[var(--color-fw-primary-container)] text-[var(--color-fw-primary)] flex items-center justify-center text-lg font-bold">
            AO
          </div>
          <div>
            <p className="text-[17px] font-bold text-[var(--color-fw-text)]">Ada O.</p>
            <p className="text-[15px] text-[var(--color-fw-text-secondary)]">@ada_lagos</p>
          </div>
        </div>

        <ul className="mt-4 fw-panel-card divide-y divide-[var(--color-fw-divider)]">
          {settings.map(({ label, value, href }) => (
            <li key={label}>
              <Link
                to={href}
                className="flex items-center justify-between px-4 py-4 text-[15px] no-underline hover:bg-[var(--color-fw-panel)]"
              >
                <span className="text-[var(--color-fw-text)]">{label}</span>
                {value && (
                  <span className="text-[var(--color-fw-text-secondary)]">{value}</span>
                )}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="w-full text-left px-4 py-4 text-[15px] text-[var(--color-fw-flooded)] bg-transparent border-none cursor-pointer hover:bg-[var(--color-fw-panel)]"
            >
              Sign out
            </button>
          </li>
        </ul>

        <footer className="mt-8 text-[13px] text-[var(--color-fw-text-secondary)] space-y-1 px-1">
          <p>FloodWatch · Lagos · A civic reporting tool</p>
          <p>Version 1.0.0</p>
        </footer>
      </div>
    </PageShell>
  )
}
