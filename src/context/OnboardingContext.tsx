import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tutorialSteps } from '../data/tutorial-steps'
import {
  clearOnboardingState,
  saveOnboardingCompleted,
  shouldShowTour,
} from '../lib/onboarding-storage'
import { useUser } from './UserContext'

export type OnboardingPhase = 'idle' | 'trail' | 'done'

interface OnboardingContextValue {
  phase: OnboardingPhase
  stepIndex: number
  totalSteps: number
  isActive: boolean
  startTrail: () => void
  skipOnboarding: () => void
  replayTutorial: () => void
  signOut: () => void
  nextStep: () => void
  prevStep: () => void
  finishTrail: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { signIn, signOut: signOutUser } = useUser()
  const [phase, setPhase] = useState<OnboardingPhase>(() =>
    shouldShowTour() ? 'trail' : 'idle'
  )
  const [stepIndex, setStepIndex] = useState(0)

  const beginTrail = useCallback(() => {
    setStepIndex(0)
    setPhase('trail')
    navigate('/', { replace: true })
  }, [navigate])

  // Full page load / refresh / bfcache — show tour until user taps Done on last step
  useEffect(() => {
    const syncTour = () => {
      if (shouldShowTour()) beginTrail()
    }

    syncTour()
    window.addEventListener('pageshow', syncTour)
    return () => window.removeEventListener('pageshow', syncTour)
  }, [beginTrail])

  const startTrail = beginTrail

  const finishTrail = useCallback(() => {
    saveOnboardingCompleted()
    signIn()
    setPhase('done')
    setStepIndex(0)
    window.setTimeout(() => setPhase('idle'), 300)
  }, [signIn])

  const skipOnboarding = useCallback(() => {
    // Temporary — refresh or new visit shows the tour again
    setPhase('idle')
    setStepIndex(0)
  }, [])

  const replayTutorial = useCallback(() => {
    clearOnboardingState()
    beginTrail()
  }, [beginTrail])

  const signOut = useCallback(() => {
    signOutUser()
    clearOnboardingState()
    beginTrail()
  }, [beginTrail, signOutUser])

  const nextStep = useCallback(() => {
    setStepIndex((current) => {
      if (current >= tutorialSteps.length - 1) {
        finishTrail()
        return current
      }

      const next = current + 1
      const step = tutorialSteps[next]
      if (step && pathname !== step.route) {
        navigate(step.route, { replace: true })
      }
      return next
    })
  }, [finishTrail, navigate, pathname])

  const prevStep = useCallback(() => {
    setStepIndex((current) => {
      const prev = Math.max(0, current - 1)
      const step = tutorialSteps[prev]
      if (step && pathname !== step.route) {
        navigate(step.route, { replace: true })
      }
      return prev
    })
  }, [navigate, pathname])

  const value = useMemo(
    (): OnboardingContextValue => ({
      phase,
      stepIndex,
      totalSteps: tutorialSteps.length,
      isActive: phase === 'trail',
      startTrail,
      skipOnboarding,
      replayTutorial,
      signOut,
      nextStep,
      prevStep,
      finishTrail,
    }),
    [
      phase,
      stepIndex,
      startTrail,
      skipOnboarding,
      replayTutorial,
      signOut,
      nextStep,
      prevStep,
      finishTrail,
    ]
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
