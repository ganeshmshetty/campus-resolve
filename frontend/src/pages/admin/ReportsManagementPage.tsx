import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/shared/PageHeader'
import { StatusChip } from '../../components/ui/StatusChip'
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
                <td>rep_001</td>
                <td>roads</td>
                <td>
                  <StatusChip status="OPEN" />
                </td>
                <td>Unassigned</td>
                <td>
                  <Button size="sm">Assign</Button>
                </td>
              </tr>
              <tr>
                <td>rep_002</td>
                <td>water</td>
                <td>
                  <StatusChip status="IN_PROGRESS" />
                </td>
                <td>Facilities North</td>
                <td>
                  <Button size="sm" variant="secondary">
                    Reassign
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
