import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/shared/PageHeader'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        subtitle="The route you requested does not exist in this scaffold."
      />
      <Card>
        <p>Return to the landing page and continue through the primary navigation.</p>
        <Link to="/">
          <Button>Go to landing</Button>
        </Link>
      </Card>
    </div>
  )
}
