import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusChip } from '../../components/ui/StatusChip'
import { LoadingState } from '../../components/shared/LoadingState'
import { api } from '../../utils/api'
import type { Report } from '../../types/domain'

export function ReportsFeedPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await api.get<{ data: Report[] }>('/reports/public')
        setReports(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reports')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  return (
    <div className="stack-lg">
      <section className="page-header">
        <div>
          <h1 className="hero__title" style={{ fontSize: '2.25rem' }}>Public Reports Feed</h1>
          <p className="hero__description">View all reported issues across campus and track their current resolution status.</p>
        </div>
      </section>

      <section className="stack-lg">
        <div className="split">
          <h2>All Reports</h2>
          <div className="button-row" style={{ flex: 1, justifyContent: 'flex-end' }}>
            <div className="field" style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
              <span className="material-symbols-outlined icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>search</span>
              <input 
                className="field__input" 
                style={{ paddingLeft: '40px', paddingBlock: '8px' }} 
                placeholder="Search reports..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingState count={3} />
        ) : reports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-7)' }}>
            <p>No reports have been submitted yet.</p>
          </div>
        ) : (
          <div className="stack-md">
            {reports.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map((report) => (
              <article key={report.id} className="report-article">
                <div className="report-article__content">
                  <div className="between-row">
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{report.title}</h3>
                      <div className="button-row" style={{ gap: '16px', color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>
                        <span className="split" style={{ gap: '4px' }}>
                          <span className="material-symbols-outlined icon" style={{ fontSize: '16px' }}>location_on</span>
                          {report.address}
                        </span>
                        <span className="split" style={{ gap: '4px' }}>
                          <span className="material-symbols-outlined icon" style={{ fontSize: '16px' }}>calendar_today</span>
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StatusChip status={report.status} />
                  </div>
                  <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
                    {report.description}
                  </p>
                  <Link to={`/reports/${report.id}`} className="inline-link">
                    View full details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
