import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { StatusChip } from '../../components/ui/StatusChip'
import type { ReportStatus, Report } from '../../types/domain'
import { api } from '../../utils/api'

interface TimelineProps {
  status: ReportStatus
}

function ResolutionTimeline({ status }: TimelineProps) {
  const steps = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
  const currentIndex = steps.indexOf(status === 'ACKNOWLEDGED' ? 'OPEN' : status === 'CLOSED' || status === 'REJECTED' ? 'RESOLVED' : status)
  
  const getProgressWidth = () => {
    if (currentIndex <= 0) return '0%'
    if (currentIndex === 1) return '50%'
    return '100%'
  }

  const getAccentColor = () => {
    if (status === 'OPEN') return 'var(--color-error)'
    if (status === 'IN_PROGRESS' || status === 'ACKNOWLEDGED') return 'var(--color-primary)'
    return 'var(--color-secondary)'
  }

  return (
    <div className="progress-timeline" style={{ '--progress-color': getAccentColor() } as any}>
      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>Resolution Progress</div>
      <div className="progress-track">
        <div className="progress-track__fill" style={{ width: getProgressWidth() }}></div>
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`progress-step ${index === currentIndex ? 'progress-step--active' : index < currentIndex ? 'progress-step--completed' : ''}`}
          >
            <div className="progress-dot"></div>
          </div>
        ))}
      </div>
      <div className="progress-labels">
        <span className={currentIndex === 0 ? 'progress-labels__item--active' : ''}>Opened</span>
        <span className={currentIndex === 1 ? 'progress-labels__item--active' : ''}>Reviewing</span>
        <span className={currentIndex === 2 ? 'progress-labels__item--active' : ''}>Done</span>
      </div>
    </div>
  )
}

export function UserDashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await api.get<{ data: Report[] }>('/reports')
        setReports(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reports')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'OPEN').length,
    inProgress: reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ACKNOWLEDGED').length,
    resolved: reports.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED').length,
  }

  return (
    <div className="stack-lg">
      <section className="page-header">
        <div>
          <h1 className="hero__title" style={{ fontSize: '2.25rem' }}>My Overview</h1>
          <p className="hero__description">Track your submitted reports and their current resolution status.</p>
        </div>
        <Link to="/reports/new">
          <Button>
            <span className="material-symbols-outlined icon">add</span>
            New Report
          </Button>
        </Link>
      </section>

      <section className="bento-grid">
        <div className="stat-card">
          <div className="stat-card__header">
            <span className="material-symbols-outlined icon">assignment</span>
            Total Reports
          </div>
          <div className="stat-card__value">{stats.total}</div>
        </div>
        <div className="stat-card stat-card--accent" style={{ '--accent-color': 'var(--color-error)' } as any}>
          <div className="stat-card__header">
            <span className="material-symbols-outlined icon" style={{ color: 'var(--color-error)' }}>error</span>
            Open
          </div>
          <div className="stat-card__value">{stats.open}</div>
        </div>
        <div className="stat-card stat-card--accent" style={{ '--accent-color': 'var(--status-in-progress)' } as any}>
          <div className="stat-card__header">
            <span className="material-symbols-outlined icon" style={{ color: 'var(--status-in-progress)' }}>engineering</span>
            In Progress
          </div>
          <div className="stat-card__value">{stats.inProgress}</div>
        </div>
        <div className="stat-card stat-card--accent" style={{ '--accent-color': 'var(--status-resolved)' } as any}>
          <div className="stat-card__header">
            <span className="material-symbols-outlined icon" style={{ color: 'var(--status-resolved)' }}>check_circle</span>
            Resolved
          </div>
          <div className="stat-card__value">{stats.resolved}</div>
        </div>
      </section>

      <section className="stack-lg">
        <div className="split">
          <h2>My Reports</h2>
          <div className="button-row" style={{ flex: 1, justifyContent: 'flex-end' }}>
            <div className="field" style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
              <span className="material-symbols-outlined icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>search</span>
              <input className="field__input" style={{ paddingLeft: '40px', paddingBlock: '8px' }} placeholder="Search reports..." />
            </div>
            <Button variant="secondary" size="sm">
              <span className="material-symbols-outlined icon">filter_list</span>
              Filter
            </Button>
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--color-error)', padding: 'var(--space-4)', background: 'var(--color-error-container)', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-7)', color: 'var(--color-on-surface-variant)' }}>
            Loading your reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-7)' }}>
            <p>You haven't submitted any reports yet.</p>
            <Link to="/reports/new" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
              <Button>Submit your first report</Button>
            </Link>
          </div>
        ) : (
          <div className="stack-md">
            {reports.map((report) => (
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
                <div className="report-article__aside">
                  <ResolutionTimeline status={report.status} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
