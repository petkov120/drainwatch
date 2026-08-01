import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CitizenLayout } from './components/CitizenLayout'
import { MapHomePage } from './pages/MapHome'
import { ReportDetailsPage } from './pages/ReportDetails'
import { ReportFlowPage } from './pages/ReportFlow'
import { MyReportsPage } from './pages/MyReports'
import { ProfilePage } from './pages/Profile'
import { DashboardPage } from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
