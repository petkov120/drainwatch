export type TutorialPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

export interface TutorialStep {
  id: string
  route: string
  target?: string
  title: string
  body: string
  placement?: TutorialPlacement
}

/** All steps stay on `/` so the tour runs in one place without route hops. */
export const tutorialSteps: TutorialStep[] = [
  {
    id: 'map',
    route: '/',
    title: 'Your flood map',
    body: 'See flooding and drainage issues near you. Markers cluster when zoomed out — tap one to open details.',
    placement: 'center',
  },
  {
    id: 'nearby',
    route: '/',
    target: 'nearby-panel',
    title: 'Nearby reports',
    body: 'Browse live reports in your area. Each card shows distance, severity, and status.',
    placement: 'left',
  },
  {
    id: 'filter',
    route: '/',
    target: 'issue-filter',
    title: 'Filter by type',
    body: 'Narrow the list to floods, blocked drains, or illegal dumping.',
    placement: 'bottom',
  },
  {
    id: 'report',
    route: '/',
    target: 'report-fab',
    title: 'Report an issue',
    body: 'Spot something? Tap the mascot anytime to start a new report — photos and location included.',
    placement: 'top',
  },
  {
    id: 'nav',
    route: '/',
    target: 'main-nav',
    title: 'Navigate the app',
    body: 'Use Report for new issues, My Reports to track yours, Dashboard for ops, and Profile for settings.',
    placement: 'top',
  },
  {
    id: 'report-flow',
    route: '/',
    title: 'Submit in four steps',
    body: 'Tap Report to pick an issue type, add a photo, confirm location, then review and send.',
    placement: 'center',
  },
  {
    id: 'my-reports',
    route: '/',
    title: 'Track your reports',
    body: 'Open My Reports to see everything you’ve submitted and filter by active or resolved.',
    placement: 'center',
  },
  {
    id: 'done',
    route: '/',
    title: "You're all set",
    body: 'You can replay this tour anytime from Profile. Thanks for helping keep Lagos safer.',
    placement: 'center',
  },
]
