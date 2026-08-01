import { Link } from 'react-router-dom'
import { ProfileAvatar } from '../components/ProfileAvatar'
import { PageHeader, PageShell } from '../components/PageHeader'
import { useOnboarding } from '../context/OnboardingContext'
import { useReports } from '../context/ReportsContext'
import { useUser } from '../context/UserContext'

const settings = [
  { label: 'Notifications', href: '#' },
  { label: 'Language', value: 'English', href: '#' },
  { label: 'Help & FAQ', href: '#' },
  { label: 'Privacy policy', href: '#' },
]

export function ProfilePage() {
  const { resetDemo } = useReports()
  const { replayTutorial, signOut: signOutTour } = useOnboarding()
  const { user, isSignedIn, signIn, signOut: signOutUser } = useUser()

  const handleSignOut = () => {
    signOutUser()
    signOutTour()
  }

  return (
    <PageShell header={<PageHeader title="Profile" />}>
      <div className="max-w-lg mx-auto lg:max-w-xl">
        <h1 className="fw-type-display lg:hidden mb-6">Profile</h1>

        {isSignedIn ? (
          <div className="flex items-center gap-4 p-5 fw-panel-card">
            <ProfileAvatar size="md" />
            <div className="space-y-0.5">
              <p className="fw-type-title">{user.name}</p>
              <p className="fw-type-meta">{user.handle}</p>
            </div>
          </div>
        ) : (
          <div className="p-5 fw-panel-card text-center space-y-4">
            <ProfileAvatar size="md" className="mx-auto" />
            <div>
              <p className="fw-type-title">Sign in to FloodWatch</p>
              <p className="fw-type-meta mt-1">Track reports and save your preferences</p>
            </div>
            <button type="button" className="fw-btn-primary w-full" onClick={signIn}>
              Continue as demo user
            </button>
          </div>
        )}

        <ul className="mt-5 fw-panel-card divide-y divide-[var(--color-fw-divider)]">
          {isSignedIn &&
            settings.map(({ label, value, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  className="flex items-center justify-between px-5 py-4 fw-type-body no-underline hover:bg-[var(--color-fw-panel)]"
                >
                  <span className="text-[var(--color-fw-text)]">{label}</span>
                  {value && <span className="fw-type-meta">{value}</span>}
                </Link>
              </li>
            ))}
          <li>
            <button
              type="button"
              onClick={replayTutorial}
              className="w-full text-left px-5 py-4 fw-type-body text-[var(--color-fw-link)] bg-transparent border-none cursor-pointer hover:bg-[var(--color-fw-panel)]"
            >
              Replay tutorial
            </button>
          </li>
          {isSignedIn && (
            <li>
              <button
                type="button"
                onClick={resetDemo}
                className="w-full text-left px-5 py-4 fw-type-body text-[var(--color-fw-link)] bg-transparent border-none cursor-pointer hover:bg-[var(--color-fw-panel)]"
              >
                Reset demo data
              </button>
            </li>
          )}
          {isSignedIn ? (
            <li>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-5 py-4 fw-type-body text-[var(--color-fw-flooded)] bg-transparent border-none cursor-pointer hover:bg-[var(--color-fw-panel)]"
              >
                Sign out
              </button>
            </li>
          ) : null}
        </ul>

        <footer className="mt-10 fw-type-caption space-y-1.5 px-1">
          <p>FloodWatch · Lagos · A civic reporting tool</p>
          <p>Version 1.0.0</p>
        </footer>
      </div>
    </PageShell>
  )
}
