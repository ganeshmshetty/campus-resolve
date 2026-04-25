import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function LandingPage() {
  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="hero__content">
          <div className="badge">
            <span className="material-symbols-outlined icon text-primary">verified</span>
            The Official Campus Reporting Portal
          </div>
          <h1 className="hero__title">
            Report, Track, and Resolve Campus Issues Together.
          </h1>
          <p className="hero__description">
            From maintenance requests to safety concerns, CampusResolve is your direct line to a better, safer university environment.
          </p>
          <div className="button-row">
            <Link to="/reports/new">
              <Button>
                <span className="material-symbols-outlined icon">add_circle</span>
                Report an Issue
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="secondary">View Public Reports</Button>
            </Link>
          </div>
        </div>
        <div className="hero__image-container">
          <img
            className="hero__image"
            src="/RVCE-Gate.png"
            alt="University campus"
          />
          <div className="hero__floating-card">
            <div className="status-chip status-chip--resolved" style={{ padding: '8px' }}>
              <span className="material-symbols-outlined icon">check_circle</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Active Response</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Facilities team online</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bento-grid">
        <div className="bento-card bento-card--primary">
          <span className="material-symbols-outlined bento-card__icon-bg">assignment_turned_in</span>
          <div className="bento-card__label">Total Impact</div>
          <div>
            <div className="bento-card__value">Live</div>
            <div className="bento-card__description">Metrics appear here after backend analytics integration.</div>
          </div>
        </div>
        
        <div className="bento-card bento-card--surface">
          <div className="bento-card__label">
            <span className="material-symbols-outlined icon" style={{ fontSize: '18px' }}>timer</span>
            Average Resolution
          </div>
          <div>
            <div className="bento-card__value">--</div>
            <div className="bento-card__description">Will be calculated from real resolution timestamps.</div>
          </div>
        </div>

        <div className="bento-card bento-card--surface">
          <div className="bento-card__label">
            <span className="material-symbols-outlined icon" style={{ fontSize: '18px' }}>groups</span>
            Community
          </div>
          <div>
            <div className="bento-card__value">--</div>
            <div className="bento-card__description">Active users will be shown once identity data is connected.</div>
          </div>
        </div>
      </section>

      <section className="stack-lg">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Access your portal</h2>
        <div className="cards-grid cards-grid--three">
          <div className="card">
            <h3>For Users</h3>
            <p>Log issues with photos and monitor status updates in one place.</p>
            <Link to="/user/dashboard" className="inline-link">
              Open user dashboard →
            </Link>
          </div>
          <div className="card">
            <h3>For Authorities</h3>
            <p>Manage assigned incidents, post field notes, and upload closure proof.</p>
            <Link to="/authority/dashboard" className="inline-link">
              Open authority dashboard →
            </Link>
          </div>
          <div className="card">
            <h3>For Admins</h3>
            <p>Oversee all reports, assign ownership, and track SLA health.</p>
            <Link to="/admin/dashboard" className="inline-link">
              Open admin dashboard →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
