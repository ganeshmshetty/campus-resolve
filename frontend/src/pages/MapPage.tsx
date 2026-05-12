import { useEffect, useState, useMemo } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { PageHeader } from '../components/shared/PageHeader'
import { StatusChip } from '../components/ui/StatusChip'
import { api } from '../utils/api'
import type { Report } from '../types/domain'
import { Link } from 'react-router-dom'

export function MapPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const [viewState, setViewState] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 15
  })

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await api.get<{ data: Report[] }>('/reports')
        setReports(response.data)
        
        // Center map on first report if available
        const firstWithCoords = response.data.find(r => r.latitude !== null && r.longitude !== null)
        if (firstWithCoords) {
          setViewState(prev => ({
            ...prev,
            latitude: firstWithCoords.latitude!,
            longitude: firstWithCoords.longitude!
          }))
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch map data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Filter and jitter reports
  const mappedReports = useMemo(() => {
    return reports
      .filter(r => r.latitude !== null && r.longitude !== null)
      .map(r => {
        let hash = 0;
        for (let i = 0; i < r.id.length; i++) hash = r.id.charCodeAt(i) + ((hash << 5) - hash);
        const jitterLat = ((hash % 100) - 50) * 0.000001;
        const jitterLng = (((hash >> 2) % 100) - 50) * 0.000001;
        return {
          ...r,
          latitude: r.latitude! + jitterLat,
          longitude: r.longitude! + jitterLng
        }
      })
  }, [reports])

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
        <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-on-surface-variant)' }}>
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          position: 'relative'
        }}>
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />
            
            {mappedReports.map(report => (
              <Marker 
                key={report.id} 
                latitude={report.latitude} 
                longitude={report.longitude}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedReport(report);
                }}
              >
                <div style={{ cursor: 'pointer' }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="white" strokeWidth="2">
                     <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
                     <circle cx="12" cy="10" r="3" fill="white"/>
                   </svg>
                </div>
              </Marker>
            ))}

            {selectedReport && (
              <Popup
                latitude={selectedReport.latitude!}
                longitude={selectedReport.longitude!}
                anchor="bottom"
                onClose={() => setSelectedReport(null)}
                closeButton={true}
                closeOnClick={false}
                maxWidth="240px"
              >
                <div style={{ padding: '4px' }}>
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
