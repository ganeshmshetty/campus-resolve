import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card } from '../../components/ui/Card'
import { StatusChip } from '../../components/ui/StatusChip'
import { api } from '../../utils/api'
import type { Report, ReportUpdate, ReportImage } from '../../types/domain'

export function ReportDetailsPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const [data, setData] = useState<{ report: Report; updates: ReportUpdate[]; images: ReportImage[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDetails() {
      if (!reportId) return
      try {
        const response = await api.get<{ data: { report: Report; updates: ReportUpdate[]; images: ReportImage[] } }>(`/reports/${reportId}`)
        setData(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch report details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [reportId])

  if (isLoading) return <div style={{ textAlign: 'center', padding: 'var(--space-7)' }}>Loading details...</div>
  if (error || !data) return (
    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-7)' }}>
      <p style={{ color: 'var(--color-error)' }}>{error || 'Report not found'}</p>
      <Link to="/user/dashboard" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
        <StatusChip status="OPEN" style={{ background: 'var(--color-primary)', color: 'white' }}>Back to dashboard</StatusChip>
      </Link>
    </div>
  )

  const { report, updates, images } = data

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow={`Report #${report.id.slice(0, 8)}`}
        title={report.title}
        subtitle={`Submitted on ${new Date(report.created_at).toLocaleDateString()} at ${report.address}`}
      />

      <div className="two-col">
        <Card>
          <div className="between-row">
            <h2>Description</h2>
            <StatusChip status={report.status} />
          </div>
          <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>{report.description}</p>
          
          {images.length > 0 && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <h3>Images</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', marginTop: '8px' }}>
                {images.map(img => (
                  <a key={img.id} href={img.image_url} target="_blank" rel="noreferrer">
                    <img 
                      src={img.image_url} 
                      alt="Report evidence" 
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-outline-variant)' }} 
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2>Updates & Timeline</h2>
          {updates.length === 0 ? (
            <p style={{ color: 'var(--color-on-surface-variant)' }}>No updates yet for this report.</p>
          ) : (
            <ol className="timeline">
              {updates.map((update) => (
                <li key={update.id} className="timeline__item">
                  <div className="timeline__dot" aria-hidden="true" />
                  <div>
                    <div className="split" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                      <p className="timeline__title">
                        {update.status ? `Status changed to ${update.status}` : 'Update provided'}
                      </p>
                      <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                        {new Date(update.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="timeline__meta">{update.notes}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  )
}
