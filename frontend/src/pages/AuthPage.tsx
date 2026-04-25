import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TextInput } from '../components/ui/TextInput'
import { Button } from '../components/ui/Button'
import { api } from '../utils/api'

export function AuthPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await api.post<{ data: { accessToken: string; user: any } }>('/auth/login', {
        email,
        password,
      })
      
      localStorage.setItem('access_token', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Redirect based on role
      const role = response.data.user.role
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'authority') navigate('/authority/dashboard')
      else navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-split">
      <aside className="auth-split__aside">
        <img 
          src="https://images.unsplash.com/photo-1523050853064-85916f7c4451?auto=format&fit=crop&q=80&w=1000" 
          className="auth-split__image" 
          alt="Campus architecture" 
        />
        <div className="auth-split__overlay"></div>
        <div className="auth-split__content">
          <div className="split" style={{ color: 'white' }}>
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined icon--fill">assured_workload</span>
              <span style={{ fontSize: '1.5rem' }}>CampusResolve</span>
            </div>
          </div>
          
          <div style={{ marginTop: 'auto', marginBottom: 'var(--space-7)' }}>
            <h1 style={{ color: 'white', marginBottom: 'var(--space-4)', fontSize: '2.5rem' }}>
              A reliable partner for our community.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', maxWidth: '400px' }}>
              Transparent reporting and swift resolution for students, faculty, and staff. Build a better campus, together.
            </p>
          </div>
        </div>
      </aside>

      <main className="auth-split__main">
        <div className="auth-card">
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-1)' }}>Sign in</h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
              Access your dashboard and manage reports.
            </p>
          </div>

          <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <span className="material-symbols-outlined icon">school</span>
            Sign in with Campus Email
          </Button>

          <div className="divider">
            <div className="divider__line"></div>
            <span className="divider__text">or continue with email</span>
            <div className="divider__line"></div>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: 'var(--color-error)', fontSize: '14px', background: 'var(--color-error-container)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            <TextInput
              id="email"
              type="email"
              name="email"
              label="Email Address"
              placeholder="name@campus.edu"
              autoComplete="email"
              required
            />
            <div className="stack-sm">
              <div className="split">
                <label className="field__label" htmlFor="password">Password</label>
                <Link to="#" className="inline-link" style={{ fontSize: '14px' }}>Forgot password?</Link>
              </div>
              <input
                className="field__input"
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            
            <Button type="submit" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
              Don't have an account? 
              <Link to="#" className="inline-link" style={{ marginLeft: '8px' }}>Register here</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
