import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ReportDetailPanel } from '../components/ReportDetailPanel'
import { useReports } from '../context/ReportsContext'

export function ReportDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getReport } = useReports()

  const report = id ? getReport(id) : undefined
  if (!report) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <ReportDetailPanel
        report={report}
        onClose={() => navigate('/')}
        showFullPageLink={false}
      />
    </div>
  )
}
