import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/shared/PageHeader'
import { StatsGrid } from '../../components/shared/StatsGrid'
import { Card } from '../../components/ui/Card'
import { api } from '../../utils/api'
import type { Report } from '../../types/domain'

export function AdminDashboardPage() {
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

  const totalCount = reports.length;
  const unassignedCount = reports.filter(r => !r.assigned_to).length;
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED' || r.status === 'REJECTED').length;
  const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ACKNOWLEDGED').length;

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Admin"
        title="Operations overview"
        subtitle="Monitor workload, assignment health, and closure trends across departments."
      />

      <StatsGrid
        items={[
          { label: 'All reports', value: isLoading ? '--' : totalCount.toString(), icon: 'assignment' },
          { label: 'Unassigned', value: isLoading ? '--' : unassignedCount.toString(), icon: 'person_off', accent: 'var(--color-error)' },
          { label: 'Resolved', value: isLoading ? '--' : resolvedCount.toString(), icon: 'check_circle', accent: 'var(--status-resolved)' },
          { label: 'In Progress', value: isLoading ? '--' : inProgressCount.toString(), icon: 'engineering', accent: 'var(--status-in-progress)' },
        ]}
      />

      <section className="cards-grid cards-grid--two">
        <Card>
          <h2>Assignment backlog</h2>
          <p>You have {unassignedCount} reports pending assignment.</p>
        </Card>
        <Card>
          <h2>Category performance</h2>
          <p>Total resolved reports: {resolvedCount}. View details in reports management.</p>
        </Card>
      </section>
    </div>
  )
}
