import type { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '../constants/http.js'
import type { AuthUser, Role } from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'
import { authService } from '../services/auth.service.js'

type RequestWithAuth = Request & {
  user?: AuthUser
  accessToken?: string
}

function getBearerToken(req: Request) {
  const authorizationHeader = req.header('authorization')

  if (!authorizationHeader) {
    return null
  }

  const [scheme, token] = authorizationHeader.split(' ')

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }

  return token
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const accessToken = getBearerToken(req)

  if (!accessToken) {
    next(new HttpError(HTTP_STATUS.unauthorized, 'Missing bearer token'))
    return
  }

  try {
    const user = await authService.getCurrentUser(accessToken)
    const authReq = req as RequestWithAuth
    authReq.user = user
    authReq.accessToken = accessToken
    next()
  } catch (error) {
    next(error)
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as RequestWithAuth

    if (!authReq.user) {
      next(new HttpError(HTTP_STATUS.unauthorized, 'Not authenticated'))
      return
    }

    if (!roles.includes(authReq.user.role)) {
      next(new HttpError(HTTP_STATUS.forbidden, 'Insufficient role permissions'))
      return
    }

    next()
  }
}
