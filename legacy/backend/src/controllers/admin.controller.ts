import type { Request, Response } from 'express'
import { HTTP_STATUS } from '../constants/http.js'
import { adminService } from '../services/admin.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const adminController = {
  stats: asyncHandler(async (_req: Request, res: Response) => {
    const data = await adminService.getStats()
    res.json({ data })
  }),

  createAuthority: asyncHandler(async (req: Request, res: Response) => {
    const data = await adminService.createAuthorityUser(req.body)
    res.status(HTTP_STATUS.created).json({ data })
  }),
}
