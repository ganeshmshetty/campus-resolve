type LoadingStateProps = {
  count?: number
  variant?: 'card' | 'table' | 'map'
}

export function LoadingState({ count = 3, variant = 'card' }: LoadingStateProps) {
  if (variant === 'table') {
    return (
      <div className="skeleton-card" aria-label="Loading table data" aria-busy="true">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="between-row">
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-pill" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'map') {
    return (
      <div className="skeleton-card" aria-label="Loading map data" aria-busy="true">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-block" style={{ height: '360px' }} />
      </div>
    )
  }

  return (
    <div className="stack-md" aria-label="Loading content" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="between-row">
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-pill" />
          </div>
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      ))}
    </div>
  )
}
