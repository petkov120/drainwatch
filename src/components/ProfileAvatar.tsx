import { useUser } from '../context/UserContext'

interface ProfileAvatarProps {
  size?: 'sm' | 'md'
  className?: string
}

export function ProfileAvatar({ size = 'sm', className = '' }: ProfileAvatarProps) {
  const { user, isSignedIn } = useUser()
  const sizeClass = size === 'md' ? 'w-14 h-14 fw-type-title' : 'w-8 h-8 text-xs font-bold'

  return (
    <span
      className={`rounded-full bg-[var(--color-fw-primary-container)] text-[var(--color-fw-primary)] flex items-center justify-center shrink-0 ${sizeClass} ${className}`}
      aria-hidden={!isSignedIn}
    >
      {isSignedIn ? (
        user.initials
      ) : (
        <svg width={size === 'md' ? 24 : 16} height={size === 'md' ? 24 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}
