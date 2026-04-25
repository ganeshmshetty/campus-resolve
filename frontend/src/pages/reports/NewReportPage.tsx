import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { REPORT_CATEGORIES } from '../../types/domain'
import { Button } from '../../components/ui/Button'
import { TextInput } from '../../components/ui/TextInput'
import { api, BASE_URL, ApiError } from '../../utils/api'

export function NewReportPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  // GPS State
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isDetectingGps, setIsDetectingGps] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)

  function handleDetectGps() {
    setIsDetectingGps(true)
    setGpsError(null)
    
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser')
      setIsDetectingGps(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setIsDetectingGps(false)
      },
      () => {
        setGpsError('Unable to retrieve your location')
        setIsDetectingGps(false)
      }
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      address: formData.get('address'),
      latitude: formData.get('latitude') ? Number(formData.get('latitude')) : null,
      longitude: formData.get('longitude') ? Number(formData.get('longitude')) : null,
    }

    try {
      const response = await api.post<{ data: { id: string } }>('/reports', payload)
      const reportId = response.data.id

      // Upload images if any
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const imageFormData = new FormData()
          imageFormData.append('image', file)
          imageFormData.append('imageType', 'issue')
          
          await fetch(`${BASE_URL}/reports/${reportId}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: imageFormData
          })
        }
      }

      navigate('/user/dashboard')
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 422 && err.details?.fieldErrors) {
        setFieldErrors(err.details.fieldErrors)
        setError('Validation failed. Please check the highlighted fields.')
      } else {
        setError(err.message || 'Failed to submit report')
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files))
    }
  }

  return (
    <div className="form-layout">
      <div className="form-layout__main">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="hero__title" style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Create New Report</h1>
          <p className="hero__description">Provide details about the issue to help our campus teams resolve it quickly.</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <form className="form-stack" onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: 'var(--color-error)', padding: 'var(--space-4)', background: 'var(--color-error-container)', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            <section className="form-section">
              <h2 className="form-section__title">1. Essential Details</h2>
              <div className="stack-sm">
                <TextInput 
                  id="title" 
                  name="title" 
                  label="Issue Title" 
                  placeholder="e.g., Leaking pipe in Science Building bathroom" 
                  required
                />
                {fieldErrors.title && <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>{fieldErrors.title.join(', ')}</p>}
              </div>
              <div className="two-col">
                <div className="field stack-sm">
                  <label className="field__label" htmlFor="category">Category</label>
                  <select className="field__input" id="category" name="category" defaultValue={REPORT_CATEGORIES[0]} required>
                    <option disabled value="">Select a category</option>
                    {REPORT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category && <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>{fieldErrors.category.join(', ')}</p>}
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="urgency">Urgency Level</label>
                  <select className="field__input" id="urgency" name="urgency" defaultValue="medium">
                    <option value="low">Low (When possible)</option>
                    <option value="medium">Medium (Within 48 hours)</option>
                    <option value="high">High (Immediate attention)</option>
                  </select>
                </div>
              </div>
              <div className="field stack-sm">
                <label className="field__label" htmlFor="description">Description</label>
                <textarea
                  className="field__textarea"
                  id="description"
                  name="description"
                  placeholder="Provide as much detail as possible. What is the issue? Is it causing damage?"
                  rows={4}
                  required
                />
                {fieldErrors.description && <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>{fieldErrors.description.join(', ')}</p>}
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section__title">2. Location</h2>
              <div className="field stack-sm">
                <label className="field__label" htmlFor="address">Building / Area</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>location_city</span>
                  <input 
                    className="field__input" 
                    id="address" 
                    name="address" 
                    placeholder="e.g., Library, North Quad" 
                    style={{ paddingLeft: '40px' }}
                    required 
                  />
                </div>
                {fieldErrors.address && <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>{fieldErrors.address.join(', ')}</p>}
              </div>
              <div className="two-col">
                <TextInput id="room" name="room" label="Room Number (Optional)" placeholder="e.g., Room 304" />
                <div className="field" style={{ justifyContent: 'flex-end' }}>
                  <Button type="button" variant="secondary" style={{ width: '100%' }} onClick={handleDetectGps} disabled={isDetectingGps}>
                    <span className="material-symbols-outlined icon">my_location</span>
                    {isDetectingGps ? 'Detecting...' : (latitude && longitude ? 'Location Saved' : 'Use Current GPS Location')}
                  </Button>
                  {gpsError && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{gpsError}</p>}
                  {latitude && longitude && <p style={{ color: 'var(--status-resolved)', fontSize: '12px', marginTop: '4px' }}>Detected: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>}
                </div>
              </div>
              
              {/* Hidden GPS inputs */}
              {latitude && <input type="hidden" name="latitude" value={latitude} />}
              {longitude && <input type="hidden" name="longitude" value={longitude} />}
            </section>

            <section className="form-section">
              <h2 className="form-section__title">3. Photo Evidence</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '-8px' }}>
                Photos help our maintenance team bring the right tools for the job.
              </p>
              <label className="upload-zone" htmlFor="image-upload">
                <div className="upload-zone__icon">
                  <span className="material-symbols-outlined icon" style={{ fontSize: '32px' }}>add_a_photo</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700 }}>{selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Click to upload or drag and drop'}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>PNG, JPG or GIF (MAX. 10MB)</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  id="image-upload" 
                  onChange={handleFileChange}
                />
              </label>
              {selectedFiles.length > 0 && (
                <div className="button-row" style={{ marginTop: 'var(--space-2)' }}>
                  {selectedFiles.map(f => (
                    <div key={f.name} style={{ fontSize: '12px', background: 'var(--color-surface-high)', padding: '4px 8px', borderRadius: '4px' }}>
                      {f.name}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="button-row" style={{ justifyContent: 'flex-end', borderTop: '1px solid var(--color-outline-variant)', paddingTop: 'var(--space-6)' }}>
              <Button type="button" variant="ghost" disabled={isLoading}>Save Draft</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Report'}
                {!isLoading && <span className="material-symbols-outlined icon">send</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <aside className="form-layout__aside">
        <div className="stack-lg">
          <div className="help-card">
            <div className="help-card__title" style={{ color: 'var(--tertiary)' }}>
              <span className="material-symbols-outlined icon">info</span>
              Reporting Guidelines
            </div>
            <ul className="stack-sm" style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
              <li className="split" style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
                <span className="material-symbols-outlined icon text-primary" style={{ fontSize: '18px' }}>check_circle</span>
                <span>Provide a specific location to avoid delays.</span>
              </li>
              <li className="split" style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
                <span className="material-symbols-outlined icon text-primary" style={{ fontSize: '18px' }}>check_circle</span>
                <span>Include clear photos showing the scale of the issue.</span>
              </li>
              <li className="split" style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
                <span className="material-symbols-outlined icon text-primary" style={{ fontSize: '18px' }}>check_circle</span>
                <span>For immediate emergencies (fire, medical), call 911 immediately.</span>
              </li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-card__title">Need Help?</div>
            <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
              If you are unsure how to classify an issue, contact the facilities helpdesk.
            </p>
            <Link to="#" className="inline-link split" style={{ width: 'fit-content' }}>
              Contact Helpdesk
              <span className="material-symbols-outlined icon" style={{ fontSize: '16px' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}
