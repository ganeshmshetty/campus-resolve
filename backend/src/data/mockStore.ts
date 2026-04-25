import { randomUUID } from 'node:crypto'
import type {
  Profile,
  ReportImageRecord,
  ReportRecord,
  ReportStatus,
  ReportUpdateRecord,
  Role,
} from '../types/domain.js'

type MockUser = Profile & {
  password: string
}

const now = new Date().toISOString()

const adminId = randomUUID()
const authorityId = randomUUID()
const userId = randomUUID()

export const mockUsers: MockUser[] = [
  {
    id: adminId,
    name: 'Campus Admin',
    email: 'admin@campus.edu',
    role: 'admin',
    password: 'Password123!',
    created_at: now,
  },
  {
    id: authorityId,
    name: 'Facilities Team',
    email: 'authority@campus.edu',
    role: 'authority',
    password: 'Password123!',
    created_at: now,
  },
  {
    id: userId,
    name: 'Student User',
    email: 'user@campus.edu',
    role: 'user',
    password: 'Password123!',
    created_at: now,
  },
]

export const mockReports: ReportRecord[] = [
  {
    id: createId('rep'),
    title: 'Streetlight outage near Block C',
    description: 'Area is dark after 8 PM and creates safety concerns.',
    category: 'streetlights',
    status: 'IN_PROGRESS',
    address: 'Block C walkway',
    latitude: null,
    longitude: null,
    created_by: userId,
    assigned_to: authorityId,
    created_at: now,
    updated_at: now,
  },
  {
    id: createId('rep'),
    title: 'Overflowing waste bin at cafeteria',
    description: 'Waste collection missed for two days.',
    category: 'waste',
    status: 'OPEN',
    address: 'North cafeteria entrance',
    latitude: null,
    longitude: null,
    created_by: userId,
    assigned_to: null,
    created_at: now,
    updated_at: now,
  },
]

export const mockReportUpdates: ReportUpdateRecord[] = [
  {
    id: createId('upd'),
    report_id: mockReports[0].id,
    author_id: authorityId,
    status: 'IN_PROGRESS',
    notes: 'Field team inspection completed, replacement scheduled.',
    created_at: now,
  },
]

export const mockReportImages: ReportImageRecord[] = []

export function createId(prefix: string) {
  return `${prefix}_${randomUUID().slice(0, 8)}`
}

export function findMockUserByRole(role: Role) {
  return mockUsers.find((user) => user.role === role)
}

export function updateReportStatus(report: ReportRecord, status: ReportStatus) {
  report.status = status
  report.updated_at = new Date().toISOString()
}
