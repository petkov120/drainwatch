export const ONBOARDING_STORAGE_KEY = 'floodwatch:onboarding:v1'

export interface OnboardingStore {
  version: 1
  completed: boolean
  completedAt?: string
}

export function loadOnboardingState(): OnboardingStore {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!raw) return { version: 1, completed: false }

    const parsed = JSON.parse(raw) as OnboardingStore
    if (parsed.version !== 1) return { version: 1, completed: false }
    return parsed
  } catch {
    return { version: 1, completed: false }
  }
}

export function saveOnboardingCompleted(): void {
  const store: OnboardingStore = {
    version: 1,
    completed: true,
    completedAt: new Date().toISOString(),
  }
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(store))
}

export function clearOnboardingState(): void {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY)
}

export function shouldShowTour(): boolean {
  return !loadOnboardingState().completed
}
