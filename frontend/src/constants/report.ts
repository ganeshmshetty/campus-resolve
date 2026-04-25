export const REPORT_CATEGORIES = [
  'waste',
  'water',
  'roads',
  'streetlights',
  'drainage',
  'sanitation',
  'safety',
  'other',
] as const

export const REPORT_STATUSES = [
  'OPEN',
  'ACKNOWLEDGED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
] as const

export type ReportCategory = (typeof REPORT_CATEGORIES)[number]
export type ReportStatus = (typeof REPORT_STATUSES)[number]
