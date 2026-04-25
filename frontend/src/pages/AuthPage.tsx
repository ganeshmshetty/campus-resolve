import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TextInput } from '../components/ui/TextInput'
import { Button } from '../components/ui/Button'
import { api, ApiError } from '../utils/api'

export function AuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      if (!isLogin) {
        await api.post('/auth/register', { name, email, password })
      }

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
      if (err instanceof ApiError && err.status === 422 && err.details?.fieldErrors) {
        setFieldErrors(err.details.fieldErrors)
        setError('Validation failed. Please check the highlighted fields.')
      } else {
        setError(err.message || `Failed to ${isLogin ? 'sign in' : 'register'}`)
      }
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
              {isLogin ? 'Sign in' : 'Create an account'}
            </h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
              {isLogin ? 'Access your dashboard and manage reports.' : 'Join the CampusResolve community today.'}
            </p>
          </div>

          {isLogin && (
            <>
              <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <span className="material-symbols-outlined icon">school</span>
                Sign in with Campus Email
              </Button>

              <div className="divider">
                <div className="divider__line"></div>
                <span className="divider__text">or continue with email</span>
                <div className="divider__line"></div>
              </div>
            </>
          )}

          <form className="form-stack" onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: 'var(--color-error)', fontSize: '14px', background: 'var(--color-error-container)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="stack-sm">
                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                />
                {fieldErrors.name && <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>{fieldErrors.name.join(', ')}</p>}
              </div>
            )}

            <div className="stack-sm">
              <TextInput
                id="email"
                type="email"
                name="email"
                label="Email Address"
                placeholder="name@campus.edu"
                autoComplete="email"
                required
              />
              {fieldErrors.email && <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>{fieldErrors.email.join(', ')}</p>}
            </div>
            <div className="stack-sm">
              <div className="split">
                <label className="field__label" htmlFor="password">Password</label>
                {isLogin && (
                  <Link to="#" className="inline-link" style={{ fontSize: '14px' }}>Forgot password?</Link>
                )}
              </div>
              <input
                className="field__input"
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={8}
              />
              {fieldErrors.password && <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>{fieldErrors.password.join(', ')}</p>}
            </div>
            
            <Button type="submit" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
              {isLoading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button 
                type="button" 
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setFieldErrors({})
                }} 
                className="inline-link" 
                style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
              >
                {isLogin ? 'Register here' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
