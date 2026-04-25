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
          { label: 'All reports', value: '--', icon: 'assignment' },
          { label: 'Unassigned', value: '--', icon: 'person_off', accent: 'var(--color-error)' },
          { label: 'Resolved this week', value: '--', icon: 'check_circle', accent: 'var(--status-resolved)' },
          { label: 'Reopened', value: '--', icon: 'refresh', accent: 'var(--status-in-progress)' },
        ]}
      />

      <section className="cards-grid cards-grid--two">
        <Card>
          <h2>Assignment backlog</h2>
          <p>Backlog details will appear here after connecting admin analytics.</p>
          <Button size="sm">Open assignment queue</Button>
        </Card>
        <Card>
          <h2>Category performance</h2>
          <p>Category SLA insights will appear here after live report data sync.</p>
          <Button size="sm" variant="secondary">
            View analytics
          </Button>
        </Card>
      </section>
    </div>
  )
}
