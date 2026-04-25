import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/Button'

export function ReportsManagementPage() {
  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Admin"
        title="Reports management"
        subtitle="Triage incoming reports, assign authorities, and keep status transitions auditable."
      />

      <Card>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Category</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', paddingBlock: '24px' }}>
                  No report records loaded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="button-row">
          <Button size="sm">Refresh</Button>
        </div>
      </Card>
    </div>
  )
}
