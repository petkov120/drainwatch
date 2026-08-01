import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CitizenLayout } from './components/CitizenLayout'
import { OnboardingProvider } from './context/OnboardingContext'
import { ReportsProvider } from './context/ReportsContext'
import { UserProvider } from './context/UserContext'
import { MapHomePage } from './pages/MapHome'

const OnboardingOverlay = lazy(() =>
  import('./components/onboarding/OnboardingOverlay').then((module) => ({
    default: module.OnboardingOverlay,
  }))
)
const ReportDetailsPage = lazy(() =>
  import('./pages/ReportDetails').then((module) => ({ default: module.ReportDetailsPage }))
)
const ReportFlowPage = lazy(() =>
  import('./pages/ReportFlow').then((module) => ({ default: module.ReportFlowPage }))
)
const MyReportsPage = lazy(() =>
  import('./pages/MyReports').then((module) => ({ default: module.MyReportsPage }))
)
const ProfilePage = lazy(() =>
  import('./pages/Profile').then((module) => ({ default: module.ProfilePage }))
)
const DashboardPage = lazy(() =>
  import('./pages/Dashboard').then((module) => ({ default: module.DashboardPage }))
)

function RouteFallback() {
  return <div className="min-h-dvh bg-[var(--color-fw-bg)]" aria-label="Loading page" />
}

export default function App() {
  return (
    <ReportsProvider>
      <UserProvider>
        <BrowserRouter>
          <OnboardingProvider>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route element={<CitizenLayout />}>
                  <Route path="/" element={<MapHomePage />} />
                  <Route path="/report" element={<ReportFlowPage />} />
                  <Route path="/my-reports" element={<MyReportsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/reports/:id" element={<ReportDetailsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
              </Routes>
              <OnboardingOverlay />
            </Suspense>
          </OnboardingProvider>
        </BrowserRouter>
      </UserProvider>
    </ReportsProvider>
  )
}
