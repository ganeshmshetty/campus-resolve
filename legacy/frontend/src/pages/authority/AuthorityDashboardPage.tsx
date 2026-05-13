import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/shared/PageHeader'
import { StatsGrid } from '../../components/shared/StatsGrid'
import { Card } from '../../components/ui/Card'
import { StatusChip } from '../../components/ui/StatusChip'
import { api } from '../../utils/api'
import type { Report } from '../../types/domain'

export function AuthorityDashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await api.get<{ data: Report[] }>('/reports')
        setReports(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  const assignedCount = reports.length;
  const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ACKNOWLEDGED').length;
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED' || r.status === 'REJECTED').length;

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Authority"
        title="Assigned work queue"
        subtitle="Review active assignments, prioritize by urgency, and post resolution updates."
      />

      <StatsGrid
        items={[
          { label: 'Assigned', value: isLoading ? '--' : assignedCount.toString(), icon: 'assignment_ind', accent: 'var(--color-primary)' },
          { label: 'In Progress', value: isLoading ? '--' : inProgressCount.toString(), icon: 'engineering', accent: 'var(--color-error)' },
          { label: 'Resolved', value: isLoading ? '--' : resolvedCount.toString(), icon: 'check_circle', accent: 'var(--status-resolved)' },
        ]}
      />

      {isLoading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>Loading assignments...</div>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <div className="between-row">
            <div>
              <h2>No active assignment loaded</h2>
              <p>Assigned report details will appear here when authority queue data is available.</p>
            </div>
            <StatusChip status="OPEN" />
          </div>
        </Card>
      ) : (
        reports.map(report => (
          <Card key={report.id}>
            <div className="between-row">
              <div>
                <h2>{report.title}</h2>
                <p>{report.address} - {new Date(report.created_at).toLocaleDateString()}</p>
              </div>
              <StatusChip status={report.status} />
            </div>
            <div className="button-row" style={{ marginTop: 'var(--space-4)' }}>
              <Link to={`/reports/${report.id}`} className="btn">View Details</Link>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
