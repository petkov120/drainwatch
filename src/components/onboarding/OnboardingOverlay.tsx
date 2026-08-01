import { useOnboarding } from '../../context/OnboardingContext'
import { TutorialTrail } from './TutorialTrail'

export function OnboardingOverlay() {
  const { phase } = useOnboarding()

  if (phase === 'trail') return <TutorialTrail />
  return null
}
