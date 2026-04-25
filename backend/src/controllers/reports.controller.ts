import type { Request, Response } from 'express'
import { HTTP_STATUS } from '../constants/http.js'
import { reportsService } from '../services/reports.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'

function getAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new HttpError(HTTP_STATUS.unauthorized, 'Not authenticated')
  }

  return req.user
}

function getReportId(req: Request) {
  const id = req.params.id
  return Array.isArray(id) ? id[0] : id
}

export const reportsController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req)
    const data = await reportsService.createReport(user, req.body)
    res.status(HTTP_STATUS.created).json({ data })
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req)
    const data = await reportsService.listReports(user)
    res.json({ data })
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req)
    const data = await reportsService.getReportById(user, getReportId(req))
    res.json({ data })
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req)
    const data = await reportsService.updateStatus(user, getReportId(req), req.body)
    res.json({ data })
  }),

  assign: asyncHandler(async (req: Request, res: Response) => {
    const data = await reportsService.assignReport(getReportId(req), req.body)
    res.json({ data })
  }),

  addImage: asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req)

    if (!req.file) {
      throw new HttpError(HTTP_STATUS.badRequest, 'Image file is required')
    }

    const data = await reportsService.addImage({
      reportId: getReportId(req),
      uploadedBy: user.id,
      imageType: req.body.imageType,
      file: req.file,
    })

    res.status(HTTP_STATUS.created).json({ data })
  }),

  addUpdate: asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req)
    const data = await reportsService.addUpdate(user, getReportId(req), req.body)
    res.status(HTTP_STATUS.created).json({ data })
  }),
}
