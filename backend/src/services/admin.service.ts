import { isSupabaseConfigured } from '../config/env.js'
import { getAdminSupabaseClient } from '../config/supabase.js'
import { mockReports } from '../data/mockStore.js'
import { authService } from './auth.service.js'

function getMockStats() {
  const totalReports = mockReports.length
  const unassignedReports = mockReports.filter((report) => !report.assigned_to).length
  const closedReports = mockReports.filter((report) => report.status === 'CLOSED').length
  const openReports = mockReports.filter((report) => ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS'].includes(report.status)).length

  return {
    totalReports,
    unassignedReports,
    openReports,
    closedReports,
  }
}

async function getSupabaseStats() {
  const client = getAdminSupabaseClient()
  const { data, error } = await client.from('reports').select('id, status, assigned_to')

  if (error) {
    throw new Error(error.message)
  }

  const reports = data ?? []

  return {
    totalReports: reports.length,
    unassignedReports: reports.filter((report) => !report.assigned_to).length,
    openReports: reports.filter((report) => ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS'].includes(report.status)).length,
    closedReports: reports.filter((report) => report.status === 'CLOSED').length,
  }
}

export const adminService = {
  async getStats() {
    if (isSupabaseConfigured) {
      return getSupabaseStats()
    }

    return getMockStats()
  },

  async createAuthorityUser(input: { name: string; email: string; password: string }) {
    return authService.registerAuthority(input)
  },
}
