import type { Request, Response } from 'express'
import { authService } from '../services/auth.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HTTP_STATUS } from '../constants/http.js'
import type { AuthUser } from '../types/domain.js'

type RequestWithAuth = Request & {
  user?: AuthUser
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.register(req.body)
    res.status(HTTP_STATUS.created).json({ data })
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.login(req.body)
    res.json({ data })
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as RequestWithAuth
    res.json({ data: authReq.user ?? null })
  }),
}
