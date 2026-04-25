import { Card } from '../ui/Card'

type StatItem = {
  label: string
  value: string
  icon?: string
  accent?: string
  trend?: string
}

type StatsGridProps = {
  items: StatItem[]
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <section className={`bento-grid ${items.length === 3 ? 'bento-grid--three' : ''}`} aria-label="Overview stats">
      {items.map((item) => (
        <div key={item.label} className={item.accent ? 'stat-card stat-card--accent' : 'stat-card'} style={item.accent ? { '--accent-color': item.accent } as any : undefined}>
          <div className="stat-card__header">
            {item.icon && <span className="material-symbols-outlined icon" style={item.accent ? { color: item.accent } : undefined}>{item.icon}</span>}
            {item.label}
          </div>
          <div className="stat-card__value">{item.value}</div>
          {item.trend && <div style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>{item.trend}</div>}
        </div>
      ))}
    </section>
  )
}
