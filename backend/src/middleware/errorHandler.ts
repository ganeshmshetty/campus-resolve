import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import { HTTP_STATUS } from '../constants/http.js'
import { HttpError } from '../utils/httpError.js'

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(HTTP_STATUS.notFound, `Route not found: ${req.method} ${req.path}`))
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details,
      },
    })
    return
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error'

  res.status(HTTP_STATUS.internalServerError).json({
    error: {
      message,
      stack: env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    },
  })
}
