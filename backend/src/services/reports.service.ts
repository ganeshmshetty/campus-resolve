import type { Express } from 'express'
import { env, isSupabaseConfigured } from '../config/env.js'
import { getAdminSupabaseClient } from '../config/supabase.js'
import { HTTP_STATUS } from '../constants/http.js'
import {
  createId,
  findMockUserByRole,
  mockReportImages,
  mockReports,
  mockReportUpdates,
  updateReportStatus,
} from '../data/mockStore.js'
import type {
  AuthUser,
  ReportCategory,
  ReportImageRecord,
  ReportRecord,
  ReportStatus,
  ReportUpdateRecord,
} from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'

type CreateReportInput = {
  title: string
  description: string
  category: ReportCategory
  status?: ReportStatus
  address: string
  latitude?: number | null
  longitude?: number | null
}

type StatusInput = {
  status: ReportStatus
  notes?: string
}

type AssignInput = {
  authorityId: string
}

type AddUpdateInput = {
  status?: ReportStatus
  notes: string
}

type AddImageInput = {
  reportId: string
  uploadedBy: string
  imageType: 'issue' | 'resolution'
  file: Express.Multer.File
}

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
}

function assertReportAccess(user: AuthUser, report: ReportRecord) {
  if (user.role === 'admin') {
    return
  }

  if (user.role === 'authority' && report.assigned_to === user.id) {
    return
  }

  if (user.role === 'user' && report.created_by === user.id) {
    return
  }

  throw new HttpError(HTTP_STATUS.forbidden, 'You do not have access to this report')
}

async function createReportSupabase(user: AuthUser, input: CreateReportInput) {
  const client = getAdminSupabaseClient()

  const { data, error } = await client
    .from('reports')
    .insert({
      ...input,
      status: 'OPEN',
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      created_by: user.id,
      assigned_to: null,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new HttpError(HTTP_STATUS.badRequest, error?.message ?? 'Unable to create report')
  }

  return data as ReportRecord
}

function createReportMock(user: AuthUser, input: CreateReportInput) {
  const now = new Date().toISOString()
  const report: ReportRecord = {
    id: createId('rep'),
    title: input.title,
    description: input.description,
    category: input.category,
    status: 'OPEN',
    address: input.address,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    created_by: user.id,
    assigned_to: null,
    created_at: now,
    updated_at: now,
  }

  mockReports.unshift(report)
  return report
}

async function listReportsSupabase(user: AuthUser) {
  const client = getAdminSupabaseClient()
  let query = client.from('reports').select('*').order('created_at', { ascending: false })

  if (user.role === 'user') {
    query = query.eq('created_by', user.id)
  }

  if (user.role === 'authority') {
    query = query.eq('assigned_to', user.id)
  }

  const { data, error } = await query

  if (error) {
    throw new HttpError(HTTP_STATUS.badRequest, error.message)
  }

  return (data ?? []) as ReportRecord[]
}

function listReportsMock(user: AuthUser) {
  if (user.role === 'admin') {
    return mockReports
  }

  if (user.role === 'authority') {
    return mockReports.filter((report) => report.assigned_to === user.id)
  }

  return mockReports.filter((report) => report.created_by === user.id)
}

async function getReportDetailsSupabase(user: AuthUser, reportId: string) {
  const client = getAdminSupabaseClient()

  const { data: report, error: reportError } = await client
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .maybeSingle()

  if (reportError) {
    throw new HttpError(HTTP_STATUS.badRequest, reportError.message)
  }

  if (!report) {
    throw new HttpError(HTTP_STATUS.notFound, 'Report not found')
  }

  assertReportAccess(user, report as ReportRecord)

  const [{ data: updates, error: updatesError }, { data: images, error: imagesError }] = await Promise.all([
    client.from('report_updates').select('*').eq('report_id', reportId).order('created_at'),
    client.from('report_images').select('*').eq('report_id', reportId).order('created_at'),
  ])

  if (updatesError || imagesError) {
    throw new HttpError(
      HTTP_STATUS.badRequest,
      updatesError?.message ?? imagesError?.message ?? 'Unable to fetch report details',
    )
  }

  return {
    report: report as ReportRecord,
    updates: (updates ?? []) as ReportUpdateRecord[],
    images: (images ?? []) as ReportImageRecord[],
  }
}

function getReportDetailsMock(user: AuthUser, reportId: string) {
  const report = mockReports.find((entry) => entry.id === reportId)

  if (!report) {
    throw new HttpError(HTTP_STATUS.notFound, 'Report not found')
  }

  assertReportAccess(user, report)

  return {
    report,
    updates: mockReportUpdates.filter((update) => update.report_id === reportId),
    images: mockReportImages.filter((image) => image.report_id === reportId),
  }
}

async function updateReportStatusSupabase(user: AuthUser, reportId: string, input: StatusInput) {
  const client = getAdminSupabaseClient()
  await getReportDetailsSupabase(user, reportId)

  const { data: updatedReport, error: updateError } = await client
    .from('reports')
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq('id', reportId)
    .select('*')
    .single()

  if (updateError || !updatedReport) {
    throw new HttpError(HTTP_STATUS.badRequest, updateError?.message ?? 'Unable to update status')
  }

  const { error: updateInsertError } = await client.from('report_updates').insert({
    report_id: reportId,
    author_id: user.id,
    status: input.status,
    notes: input.notes ?? `Status changed to ${input.status}`,
  })

  if (updateInsertError) {
    throw new HttpError(HTTP_STATUS.badRequest, updateInsertError.message)
  }

  return updatedReport as ReportRecord
}

function updateReportStatusMock(user: AuthUser, reportId: string, input: StatusInput) {
  const report = mockReports.find((entry) => entry.id === reportId)

  if (!report) {
    throw new HttpError(HTTP_STATUS.notFound, 'Report not found')
  }

  if (user.role === 'authority' && report.assigned_to !== user.id) {
    throw new HttpError(HTTP_STATUS.forbidden, 'Only assigned authority can update this report')
  }

  updateReportStatus(report, input.status)

  mockReportUpdates.push({
    id: createId('upd'),
    report_id: reportId,
    author_id: user.id,
    status: input.status,
    notes: input.notes ?? `Status changed to ${input.status}`,
    created_at: new Date().toISOString(),
  })

  return report
}

async function assignReportSupabase(reportId: string, input: AssignInput) {
  const client = getAdminSupabaseClient()

  const { data, error } = await client
    .from('reports')
    .update({ assigned_to: input.authorityId, updated_at: new Date().toISOString() })
    .eq('id', reportId)
    .select('*')
    .single()

  if (error || !data) {
    throw new HttpError(HTTP_STATUS.badRequest, error?.message ?? 'Unable to assign report')
  }

  return data as ReportRecord
}

function assignReportMock(reportId: string, input: AssignInput) {
  const report = mockReports.find((entry) => entry.id === reportId)

  if (!report) {
    throw new HttpError(HTTP_STATUS.notFound, 'Report not found')
  }

  report.assigned_to = input.authorityId
  report.updated_at = new Date().toISOString()

  return report
}

async function addImageSupabase({ reportId, uploadedBy, imageType, file }: AddImageInput) {
  const client = getAdminSupabaseClient()
  const path = `reports/${reportId}/${Date.now()}-${sanitizeFilename(file.originalname)}`

  const { error: uploadError } = await client.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })

  if (uploadError) {
    throw new HttpError(HTTP_STATUS.badRequest, uploadError.message)
  }

  const {
    data: { publicUrl },
  } = client.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path)

  const { data, error } = await client
    .from('report_images')
    .insert({
      report_id: reportId,
      uploaded_by: uploadedBy,
      image_path: path,
      image_url: publicUrl,
      image_type: imageType,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new HttpError(HTTP_STATUS.badRequest, error?.message ?? 'Unable to save image metadata')
  }

  return data as ReportImageRecord
}

function addImageMock({ reportId, uploadedBy, imageType, file }: AddImageInput) {
  const report = mockReports.find((entry) => entry.id === reportId)

  if (!report) {
    throw new HttpError(HTTP_STATUS.notFound, 'Report not found')
  }

  const image: ReportImageRecord = {
    id: createId('img'),
    report_id: reportId,
    uploaded_by: uploadedBy,
    image_path: `mock/reports/${reportId}/${Date.now()}-${sanitizeFilename(file.originalname)}`,
    image_url: `mock://reports/${reportId}/${file.originalname}`,
    image_type: imageType,
    created_at: new Date().toISOString(),
  }

  mockReportImages.push(image)
  return image
}

async function addUpdateSupabase(user: AuthUser, reportId: string, input: AddUpdateInput) {
  const client = getAdminSupabaseClient()

  await getReportDetailsSupabase(user, reportId)

  const { data, error } = await client
    .from('report_updates')
    .insert({
      report_id: reportId,
      author_id: user.id,
      status: input.status ?? null,
      notes: input.notes,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new HttpError(HTTP_STATUS.badRequest, error?.message ?? 'Unable to add report update')
  }

  if (input.status) {
    const { error: statusError } = await client
      .from('reports')
      .update({ status: input.status, updated_at: new Date().toISOString() })
      .eq('id', reportId)

    if (statusError) {
      throw new HttpError(HTTP_STATUS.badRequest, statusError.message)
    }
  }

  return data as ReportUpdateRecord
}

function addUpdateMock(user: AuthUser, reportId: string, input: AddUpdateInput) {
  const report = mockReports.find((entry) => entry.id === reportId)

  if (!report) {
    throw new HttpError(HTTP_STATUS.notFound, 'Report not found')
  }

  const update: ReportUpdateRecord = {
    id: createId('upd'),
    report_id: reportId,
    author_id: user.id,
    status: input.status ?? null,
    notes: input.notes,
    created_at: new Date().toISOString(),
  }

  mockReportUpdates.push(update)

  if (input.status) {
    updateReportStatus(report, input.status)
  }

  return update
}

export const reportsService = {
  async createReport(user: AuthUser, input: CreateReportInput) {
    if (isSupabaseConfigured) {
      return createReportSupabase(user, input)
    }

    return createReportMock(user, input)
  },

  async listReports(user: AuthUser) {
    if (isSupabaseConfigured) {
      return listReportsSupabase(user)
    }

    return listReportsMock(user)
  },

  async getReportById(user: AuthUser, reportId: string) {
    if (isSupabaseConfigured) {
      return getReportDetailsSupabase(user, reportId)
    }

    return getReportDetailsMock(user, reportId)
  },

  async updateStatus(user: AuthUser, reportId: string, input: StatusInput) {
    if (isSupabaseConfigured) {
      return updateReportStatusSupabase(user, reportId, input)
    }

    return updateReportStatusMock(user, reportId, input)
  },

  async assignReport(reportId: string, input: AssignInput) {
    if (isSupabaseConfigured) {
      return assignReportSupabase(reportId, input)
    }

    return assignReportMock(reportId, input)
  },

  async addImage(input: AddImageInput) {
    if (isSupabaseConfigured) {
      return addImageSupabase(input)
    }

    return addImageMock(input)
  },

  async addUpdate(user: AuthUser, reportId: string, input: AddUpdateInput) {
    if (isSupabaseConfigured) {
      return addUpdateSupabase(user, reportId, input)
    }

    return addUpdateMock(user, reportId, input)
  },

  getDefaultAuthorityId() {
    return findMockUserByRole('authority')?.id ?? null
  },
}
