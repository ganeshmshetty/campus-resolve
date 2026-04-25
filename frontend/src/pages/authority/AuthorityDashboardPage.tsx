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
          { label: 'Assigned', value: '--', icon: 'assignment_ind', accent: 'var(--color-primary)' },
          { label: 'Due today', value: '--', icon: 'calendar_today', accent: 'var(--color-error)' },
          { label: 'Average closure', value: '--', icon: 'timer', accent: 'var(--status-resolved)' },
        ]}
      />

      <Card>
        <div className="between-row">
          <div>
            <h2>No active assignment loaded</h2>
            <p>Assigned report details will appear here when authority queue data is available.</p>
          </div>
          <StatusChip status="OPEN" />
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
