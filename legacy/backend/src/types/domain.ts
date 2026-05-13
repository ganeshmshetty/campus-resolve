export const ROLES = ['user', 'authority', 'admin'] as const

export type Role = (typeof ROLES)[number]

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

export type ReportCategory = (typeof REPORT_CATEGORIES)[number]

export const REPORT_STATUSES = [
  'OPEN',
  'ACKNOWLEDGED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
] as const

export type ReportStatus = (typeof REPORT_STATUSES)[number]

export interface Profile {
  id: string
  name: string
  email: string
  role: Role
  created_at: string
}

export interface ReportRecord {
  id: string
  title: string
  description: string
  category: ReportCategory
  status: ReportStatus
  address: string
  latitude: number | null
  longitude: number | null
  created_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface ReportImageRecord {
  id: string
  report_id: string
  uploaded_by: string
  image_path: string
  image_url: string
  image_type: 'issue' | 'resolution'
  created_at: string
}

export interface ReportUpdateRecord {
  id: string
  report_id: string
  author_id: string
  status: ReportStatus | null
  notes: string
  created_at: string
}

export interface AuthUser {
  id: string
  email: string
  role: Role
  name?: string
}
