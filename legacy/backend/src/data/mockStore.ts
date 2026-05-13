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

export const mockUsers: MockUser[] = []

export const mockReports: ReportRecord[] = []

export const mockReportUpdates: ReportUpdateRecord[] = []

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
