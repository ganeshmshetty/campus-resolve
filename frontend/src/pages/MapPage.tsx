import { useEffect, useState, useMemo } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { PageHeader } from '../components/shared/PageHeader'
import { LoadingState } from '../components/shared/LoadingState'
import { StatusChip } from '../components/ui/StatusChip'
import { api } from '../utils/api'
import type { Report } from '../types/domain'
import { Link } from 'react-router-dom'

export function MapPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  // Default campus center (fallback)
  const defaultCenter = { latitude: 12.9716, longitude: 77.5946, zoom: 15 }

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await api.get<{ data: Report[] }>('/reports/public')
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
  const mappedReports = useMemo(() => reports.filter(r => r.latitude !== null && r.longitude !== null).map(r => {
    // Add small deterministic jitter to prevent overlap
    let hash = 0;
    for (let i = 0; i < r.id.length; i++) hash = r.id.charCodeAt(i) + ((hash << 5) - hash);
    const jitterLat = ((hash % 100) - 50) * 0.000001;
    const jitterLng = (((hash >> 2) % 100) - 50) * 0.000001;
    return {
      ...r,
      latitude: r.latitude! + jitterLat,
      longitude: r.longitude! + jitterLng
    }
  }), [reports]);

  const initialViewState = mappedReports.length > 0 
    ? { latitude: mappedReports[0].latitude!, longitude: mappedReports[0].longitude!, zoom: 15 }
    : defaultCenter

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Campus Map"
        title="Interactive Issue Map"
        subtitle="View the geographic distribution of reported campus issues and active resolution sites."
      />

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <LoadingState variant="map" />
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
          <Map
            initialViewState={initialViewState}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          >
            <NavigationControl position="top-right" />
            
            {mappedReports.map(report => (
              <Marker 
                key={report.id} 
                latitude={report.latitude!} 
                longitude={report.longitude!}
                onClick={e => {
                  e.originalEvent.stopPropagation()
                  setSelectedReport(report)
                }}
              >
                <div style={{
                  backgroundColor: 'var(--color-primary)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: '3px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }} />
              </Marker>
            ))}

            {selectedReport && (
              <Popup
                latitude={selectedReport.latitude!}
                longitude={selectedReport.longitude!}
                anchor="bottom"
                onClose={() => setSelectedReport(null)}
                closeOnClick={false}
              >
                <div style={{ minWidth: '200px', padding: '8px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>{selectedReport.title}</strong>
                  </div>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StatusChip status={selectedReport.status} style={{ fontSize: '10px', padding: '2px 6px' }} />
                    <span style={{ fontSize: '12px', color: '#666' }}>{selectedReport.category}</span>
                  </div>
                  <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: '#444' }}>{selectedReport.address}</p>
                  <Link to={`/reports/${selectedReport.id}`} style={{ 
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
            )}
          </Map>
        </div>
      )}
    </div>
  )
}
