import type { NextFunction, Request, Response } from 'express'
import type { z } from 'zod'
import { HTTP_STATUS } from '../constants/http.js'
import { HttpError } from '../utils/httpError.js'

type ValidationTarget = 'body' | 'params' | 'query'

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  target: ValidationTarget = 'body',
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      next(
        new HttpError(
          HTTP_STATUS.unprocessableEntity,
          'Validation failed',
          result.error.flatten(),
        ),
      )
      return
    }

    req[target] = result.data
    next()
  }
}
