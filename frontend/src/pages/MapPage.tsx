import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { PageHeader } from '../components/shared/PageHeader'
import { StatusChip } from '../components/ui/StatusChip'
import { api } from '../utils/api'
import type { Report } from '../types/domain'
import { Link } from 'react-router-dom'

// Fix default marker icon issue with webpack/vite
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center)
  return null
}

export function MapPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default campus center (fallback)
  const defaultCenter: [number, number] = [12.9716, 77.5946]

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await api.get<{ data: Report[] }>('/reports')
        setReports(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch map data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Filter reports with valid coordinates
  const mappedReports = reports.filter(r => r.latitude !== null && r.longitude !== null)

  const mapCenter = mappedReports.length > 0 
    ? [mappedReports[0].latitude!, mappedReports[0].longitude!] as [number, number]
    : defaultCenter

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Campus Map"
        title="Interactive Issue Map"
        subtitle="View the geographic distribution of reported campus issues and active resolution sites."
      />

      {error && (
        <div style={{ color: 'var(--color-error)', padding: 'var(--space-4)', background: 'var(--color-error-container)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-7)', color: 'var(--color-on-surface-variant)' }}>
          Loading map data...
        </div>
      ) : (
        <div style={{ 
          height: '60vh', 
          minHeight: '400px', 
          width: '100%', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden', 
          border: '1px solid var(--color-outline-variant)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} />
            
            {mappedReports.map(report => (
              <Marker key={report.id} position={[report.latitude!, report.longitude!]}>
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>{report.title}</strong>
                    </div>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StatusChip status={report.status} style={{ fontSize: '10px', padding: '2px 6px' }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>{report.category}</span>
                    </div>
                    <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: '#444' }}>{report.address}</p>
                    <Link to={`/reports/${report.id}`} style={{ 
                      display: 'block', 
                      textAlign: 'center', 
                      padding: '6px 12px', 
                      background: 'var(--color-primary)', 
                      color: 'white', 
                      textDecoration: 'none', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  )
}
