import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '../../components/shared/PageHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { Card } from '../../components/ui/Card'
import { StatusChip } from '../../components/ui/StatusChip'
import { Button } from '../../components/ui/Button'
import { api } from '../../utils/api'
import { REPORT_STATUSES } from '../../types/domain'
import type { Report, ReportUpdate, ReportImage, ReportStatus } from '../../types/domain'

export function ReportDetailsPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const [data, setData] = useState<{ report: Report; updates: ReportUpdate[]; images: ReportImage[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canUpdate = useMemo(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined') return false;
      const user = JSON.parse(userStr);
      return user && (user.role === 'admin' || user.role === 'authority');
    } catch {
      return false;
    }
  }, []);
  
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateStatus, setUpdateStatus] = useState<ReportStatus | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchDetails()
  }, [reportId])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!updateNotes.trim()) return;
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const payload: any = { notes: updateNotes };
      if (updateStatus) payload.status = updateStatus;
      await api.post(`/reports/${reportId}/updates`, payload);
      await fetchDetails();
      setUpdateNotes('');
      setUpdateStatus('');
    } catch (err: any) {
      console.error(err);
      setUpdateError(err.message || 'Failed to post update. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <LoadingState count={2} />
  if (error || !data) return (
    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-7)' }}>
      <p style={{ color: 'var(--color-error)' }}>{error || 'Report not found'}</p>
      <Link to="/" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
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

          {canUpdate && (
            <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-outline-variant)', paddingTop: 'var(--space-4)' }}>
              <h3>Post an Update</h3>
              {updateError && (
                <div className="error-banner" role="alert" style={{ padding: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  {updateError}
                </div>
              )}
              <form onSubmit={handleUpdate} className="stack-sm" style={{ marginTop: '8px' }}>
                <div className="field">
                  <label className="field__label" htmlFor="status">Change Status (Optional)</label>
                  <select 
                    id="status" 
                    className="field__input" 
                    value={updateStatus} 
                    onChange={e => setUpdateStatus(e.target.value as ReportStatus)}
                  >
                    <option value="">-- Keep current status --</option>
                    {REPORT_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="notes">Notes</label>
                  <textarea 
                    id="notes" 
                    className="field__textarea" 
                    rows={3} 
                    placeholder="Enter update details or resolution notes"
                    value={updateNotes}
                    onChange={e => setUpdateNotes(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isUpdating || !updateNotes.trim()}>
                  {isUpdating ? 'Posting...' : 'Post Update'}
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
