import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/Button'
import { StatusChip } from '../../components/ui/StatusChip'
import { api } from '../../utils/api'
import type { Report } from '../../types/domain'

export function ReportsManagementPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchReports() {
    setIsLoading(true)
    try {
      const response = await api.get<{ data: Report[] }>('/reports')
      setReports(response.data)
    } catch (err) {
      console.error(err)
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
        eyebrow="Admin"
        title="Reports management"
        subtitle="Triage incoming reports, assign authorities, and keep status transitions auditable."
      />

      <Card>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', paddingBlock: '24px' }}>
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', paddingBlock: '24px' }}>
                    No report records loaded yet.
                  </td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id}>
                    <td>{report.title}</td>
                    <td>{report.category}</td>
                    <td><StatusChip status={report.status} style={{ fontSize: '10px' }} /></td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/reports/${report.id}`} className="btn btn--sm btn--ghost">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="button-row">
          <Button size="sm" onClick={fetchReports} disabled={isLoading}>Refresh</Button>
        </div>
      </Card>
    </div>
  )
}
