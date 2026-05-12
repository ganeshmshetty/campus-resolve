import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/Button'
import { StatusChip } from '../../components/ui/StatusChip'
import { api } from '../../utils/api'
import type { Report } from '../../types/domain'

export function ReportsFeedPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchReports() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get<{ data: Report[] }>('/reports')
      setReports(response.data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Community"
        title="Public Reports Feed"
        subtitle="Stay informed about campus issues and track their resolution progress in real-time."
      />

      {error && (
        <div style={{ color: 'var(--color-error)', padding: 'var(--space-4)', background: 'var(--color-error-container)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      <div className="grid grid--2" style={{ gap: 'var(--space-6)' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', gridColumn: '1 / -1' }}>
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', gridColumn: '1 / -1' }}>
            No reports found.
          </div>
        ) : (
          reports.map(report => (
            <Card key={report.id} className="stack-md p-6">
              <div className="flex items-center justify-between">
                <StatusChip status={report.status} />
                <span className="text-sm text-muted">{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">{report.title}</h3>
                <p className="text-sm text-muted mb-2">{report.category} • {report.address}</p>
                <p className="line-clamp-2">{report.description}</p>
              </div>
              <div className="pt-4 border-t">
                <Link to={`/reports/${report.id}`} className="btn btn--primary btn--sm w-full">
                  View Details
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {!isLoading && reports.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button onClick={fetchReports} disabled={isLoading}>Refresh Feed</Button>
        </div>
      )}
    </div>
  )
}
