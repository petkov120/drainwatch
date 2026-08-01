import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEMO_USER,
  GUEST_SESSION,
  loadUserSession,
  signInDemoUser,
  signOutUser,
  type UserSession,
} from '../lib/user-storage'
import { loadOnboardingState } from '../lib/onboarding-storage'

interface UserContextValue {
  user: UserSession
  isSignedIn: boolean
  signIn: () => void
  signOut: () => void
}

const UserContext = createContext<UserContextValue | null>(null)

function loadInitialUserSession(): UserSession {
  const session = loadUserSession()
  if (session.signedIn) return session
  if (loadOnboardingState().completed) return signInDemoUser()
  return session
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession>(loadInitialUserSession)

  const signIn = useCallback(() => {
    setUser(signInDemoUser())
  }, [])

  const signOut = useCallback(() => {
    setUser(signOutUser())
  }, [])

  const value = useMemo(
    (): UserContextValue => ({
      user,
      isSignedIn: user.signedIn,
      signIn,
      signOut,
    }),
    [user, signIn, signOut]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

export { DEMO_USER, GUEST_SESSION }
