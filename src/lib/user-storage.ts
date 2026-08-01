export const USER_SESSION_KEY = 'floodwatch:user-session:v1'

export interface UserSession {
  version: 1
  signedIn: boolean
  name: string
  handle: string
  initials: string
}

export const DEMO_USER: UserSession = {
  version: 1,
  signedIn: true,
  name: 'Ada O.',
  handle: '@ada_lagos',
  initials: 'AO',
}

export const GUEST_SESSION: UserSession = {
  version: 1,
  signedIn: false,
  name: '',
  handle: '',
  initials: '',
}

export function loadUserSession(): UserSession {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY)
    if (!raw) return GUEST_SESSION

    const parsed = JSON.parse(raw) as UserSession
    if (parsed.version !== 1 || typeof parsed.signedIn !== 'boolean') {
      return GUEST_SESSION
    }
    return parsed
  } catch {
    return GUEST_SESSION
  }
}

export function saveUserSession(session: UserSession): void {
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session))
  } catch {
    // Keep authentication state in memory when persistence is unavailable.
  }
}

export function signInDemoUser(): UserSession {
  saveUserSession(DEMO_USER)
  return DEMO_USER
}

export function signOutUser(): UserSession {
  saveUserSession(GUEST_SESSION)
  return GUEST_SESSION
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(USER_SESSION_KEY)
  } catch {
    // Storage may be disabled by browser privacy settings.
  }
}
