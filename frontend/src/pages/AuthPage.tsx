import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { api } from '../utils/api'
import { TextInput } from '../components/ui/TextInput'

type AuthResponse = {
  data: {
    accessToken: string
    user: {
      role: string
      name?: string
      email: string
    }
  }
}

export function AuthPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function navigateByRole(role: string) {
    if (role === 'admin') {
      navigate('/admin/dashboard')
      return
    }

    if (role === 'authority') {
      navigate('/authority/dashboard')
      return
    }

    navigate('/')
  }

  useEffect(() => {
    async function completeOAuthLogin() {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash

      if (!hash) {
        return
      }

      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')

      if (!accessToken) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        localStorage.setItem('access_token', accessToken)
        const meResponse = await api.get<{ data: { role: string; name?: string; email: string } }>('/auth/me')
        localStorage.setItem('user', JSON.stringify(meResponse.data))
        window.history.replaceState(null, '', window.location.pathname)
        navigateByRole(meResponse.data.role)
      } catch (err) {
        localStorage.removeItem('access_token')
        setError(err instanceof Error ? err.message : 'Unable to complete Google login')
      } finally {
        setIsLoading(false)
      }
    }

    completeOAuthLogin()
  }, [navigate])

  async function handleGoogleLogin() {
    setError(null)
    setIsLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth`
      const response = await api.post<{ data: { url: string } }>('/auth/oauth/google/start', {
        redirectTo,
      })
      window.location.assign(response.data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed. Please try again.')
      setIsLoading(false)
    }
  }

  async function handleManualLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: email.trim(),
        password,
      })
      localStorage.setItem('access_token', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigateByRole(response.data.user.role)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
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
            <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-1)' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
              Sign in with your university credentials to access your dashboard.
            </p>
          </div>

          <div className="stack-md" style={{ marginTop: 'var(--space-4)' }}>
            {error && (
              <div className="error-banner" role="alert" style={{ fontSize: '14px', padding: '12px' }}>
                {error}
              </div>
            )}

            <Button
              variant="secondary" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <span className="material-symbols-outlined icon">school</span>
              Continue with Google
            </Button>

            <div className="divider">
              <div className="divider__line"></div>
              <span className="divider__text">or</span>
              <div className="divider__line"></div>
            </div>

            <form className="stack-md" onSubmit={handleManualLogin}>
              <TextInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="name@campus.edu"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <TextInput
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Button type="submit" disabled={isLoading} style={{ width: '100%', justifyContent: 'center' }}>
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
              </Button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
              By logging in, you agree to the University Acceptable Use Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
