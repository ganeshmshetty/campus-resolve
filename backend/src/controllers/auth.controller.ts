import type { Request, Response } from 'express'
import { authService } from '../services/auth.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HTTP_STATUS } from '../constants/http.js'
import type { AuthUser } from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'

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

  oauthMock: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.oauthMock(req.body)
    res.json({ data })
  }),

  startGoogleOAuth: asyncHandler(async (req: Request, res: Response) => {
    const redirectTo = req.body?.redirectTo

    if (typeof redirectTo !== 'string' || !redirectTo) {
      throw new HttpError(HTTP_STATUS.badRequest, 'redirectTo is required')
    }

    const data = await authService.startGoogleOAuth({ redirectTo })
    res.json({ data })
  }),
}
