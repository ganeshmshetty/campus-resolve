import { Router } from 'express'
import { adminController } from '../controllers/admin.controller.js'
import { authorize, requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createAuthoritySchema } from '../validators/admin.schemas.js'

const adminRouter = Router()

adminRouter.get('/stats', requireAuth, authorize('admin'), adminController.stats)

adminRouter.post(
  '/users/authorities',
  requireAuth,
  authorize('admin'),
  validate(createAuthoritySchema),
  adminController.createAuthority,
)

export { adminRouter }
