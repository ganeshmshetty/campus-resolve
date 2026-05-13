import type { HTMLAttributes } from 'react'
import type { ReportStatus } from '../../constants/report'
import { cn } from '../../utils/cn'

type StatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  status: ReportStatus
}

export function StatusChip({ className, status, ...props }: StatusChipProps) {
  return (
    <span
      className={cn('status-chip', `status-chip--${status.toLowerCase()}`, className)}
      {...props}
    >
      {status.replace('_', ' ')}
    </span>
  )
}
