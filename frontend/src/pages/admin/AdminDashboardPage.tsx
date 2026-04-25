import { PageHeader } from '../../components/shared/PageHeader'
import { StatsGrid } from '../../components/shared/StatsGrid'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export function AdminDashboardPage() {
  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Admin"
        title="Operations overview"
        subtitle="Monitor workload, assignment health, and closure trends across departments."
        actions={<Button>Invite Authority User</Button>}
      />

      <StatsGrid
        items={[
          { label: 'All reports', value: '148', icon: 'assignment' },
          { label: 'Unassigned', value: '11', icon: 'person_off', accent: 'var(--color-error)' },
          { label: 'Resolved this week', value: '24', icon: 'check_circle', accent: 'var(--status-resolved)' },
          { label: 'Reopened', value: '3', icon: 'refresh', accent: 'var(--status-in-progress)' },
        ]}
      />

      <section className="cards-grid cards-grid--two">
        <Card>
          <h2>Assignment backlog</h2>
          <p>11 reports are waiting for owner assignment.</p>
          <Button size="sm">Open assignment queue</Button>
        </Card>
        <Card>
          <h2>Category performance</h2>
          <p>Streetlights and sanitation are currently above target closure time.</p>
          <Button size="sm" variant="secondary">
            View analytics
          </Button>
        </Card>
      </section>
    </div>
  )
}
