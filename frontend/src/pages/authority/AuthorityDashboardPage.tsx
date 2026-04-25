import { PageHeader } from '../../components/shared/PageHeader'
import { StatsGrid } from '../../components/shared/StatsGrid'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { StatusChip } from '../../components/ui/StatusChip'

export function AuthorityDashboardPage() {
  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Authority"
        title="Assigned work queue"
        subtitle="Review active assignments, prioritize by urgency, and post resolution updates."
      />

      <StatsGrid
        items={[
          { label: 'Assigned', value: '18', icon: 'assignment_ind', accent: 'var(--color-primary)' },
          { label: 'Due today', value: '4', icon: 'calendar_today', accent: 'var(--color-error)' },
          { label: 'Average closure', value: '2.8 days', icon: 'timer', accent: 'var(--status-resolved)' },
        ]}
      />

      <Card>
        <div className="between-row">
          <div>
            <h2>Drainage blockage near Library Lane</h2>
            <p>Category: drainage. Reported by student desk.</p>
          </div>
          <StatusChip status="ACKNOWLEDGED" />
        </div>
        <div className="button-row">
          <Button>Mark In Progress</Button>
          <Button variant="secondary">Add field note</Button>
          <Button variant="ghost">Upload proof image</Button>
        </div>
      </Card>
    </div>
  )
}
