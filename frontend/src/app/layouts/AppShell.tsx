import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../../utils/api'

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<any>(null)
  const [backendStatus, setBackendStatus] = useState<string>('Checking backend...')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Failed to parse user from local storage', err)
        localStorage.removeItem('user')
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [location.pathname])

  useEffect(() => {
    api.get<{status: string}>('/health')
      .then(res => setBackendStatus(res.status === 'ok' ? 'Backend connected' : 'Backend issue'))
      .catch(err => {
        console.error('Health check failed:', err)
        setBackendStatus('Backend error')
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/auth')
  }

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/reports', label: 'Reports' },
    { to: '/reports/new', label: 'Create New' },
    { to: '/map', label: 'Map' },
  ]

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <div className="container topbar__content">
          <Link to="/" className="brand" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>
            CampusResolve
          </Link>
          
          <nav className="topbar__nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link--active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="button-row" style={{ color: 'var(--color-primary)', alignItems: 'center' }}>
            {user ? (
              <div className="split" style={{ gap: '12px' }}>
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'authority' ? '/authority/dashboard' : '/user/dashboard'}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit' }}
                  className="btn btn--ghost"
                  aria-label="Open account dashboard"
                >
                  <span className="material-symbols-outlined icon">account_circle</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.name || user.email}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn--ghost" style={{ padding: '8px', borderRadius: '50%' }} title="Logout" aria-label="Log out">
                  <span className="material-symbols-outlined icon">logout</span>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn--ghost" style={{ padding: '8px', borderRadius: '50%' }} title="Login" aria-label="Log in">
                <span className="material-symbols-outlined icon">account_circle</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main id="main-content" className="container page-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'}>
          <span className="material-symbols-outlined icon" style={{ fontSize: '24px' }}>home</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/reports" end className={({ isActive }) => isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'}>
          <span className="material-symbols-outlined icon" style={{ fontSize: '24px' }}>view_list</span>
          <span>Reports</span>
        </NavLink>
        <NavLink to="/reports/new" className={({ isActive }) => isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'}>
          <span className="material-symbols-outlined icon" style={{ fontSize: '24px' }}>add_circle</span>
          <span>Create</span>
        </NavLink>
        {user ? (
          <NavLink to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'authority' ? '/authority/dashboard' : '/user/dashboard'} className={({ isActive }) => isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'}>
            <span className="material-symbols-outlined icon" style={{ fontSize: '24px' }}>dashboard</span>
            <span>Dashboard</span>
          </NavLink>
        ) : (
          <NavLink to="/auth" className={({ isActive }) => isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'}>
            <span className="material-symbols-outlined icon" style={{ fontSize: '24px' }}>login</span>
            <span>Login</span>
          </NavLink>
        )}
      </nav>
      
      <footer style={{ borderTop: '1px solid var(--color-outline-variant)', marginTop: 'auto', paddingBlock: 'var(--space-5)' }}>
        <div className="container split" style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
          <div className="split" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <span>© {new Date().getFullYear()} Campus Resolve Portal. All rights reserved.</span>
            <span>|</span>
            <span style={{ fontWeight: 600, color: backendStatus === 'Backend connected' ? 'var(--status-resolved)' : 'var(--color-error)' }}>{backendStatus}</span>
          </div>
          <span>For urgent campus issues, contact the facilities desk directly.</span>
        </div>
      </footer>
    </div>
  )
}
