import { z } from 'zod'
import { REPORT_CATEGORIES, REPORT_STATUSES } from '../types/domain.js'

export const reportIdParamsSchema = z.object({
  id: z.string().min(2),
})

export const createReportSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(2000),
  category: z.enum(REPORT_CATEGORIES),
  address: z.string().trim().min(3).max(240),
  latitude: z.coerce.number().min(-90).max(90).nullable().optional(),
  longitude: z.coerce.number().min(-180).max(180).nullable().optional(),
})

export const updateStatusSchema = z.object({
  status: z.enum(REPORT_STATUSES),
  notes: z.string().trim().min(2).max(600).optional(),
})

export const assignReportSchema = z.object({
  authorityId: z.string().min(2),
})

export const addReportUpdateSchema = z.object({
  status: z.enum(REPORT_STATUSES).optional(),
  notes: z.string().trim().min(2).max(600),
})

export const addImageBodySchema = z.object({
  imageType: z.enum(['issue', 'resolution']).default('issue'),
})
