import multer from 'multer'
import { Router } from 'express'
import { env } from '../config/env.js'
import { reportsController } from '../controllers/reports.controller.js'
import { authorize, requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  addImageBodySchema,
  addReportUpdateSchema,
  assignReportSchema,
  createReportSchema,
  reportIdParamsSchema,
  updateStatusSchema,
} from '../validators/report.schemas.js'

const reportsRouter = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_UPLOAD_BYTES,
  },
})

reportsRouter.post('/', requireAuth, authorize('user', 'admin'), validate(createReportSchema), reportsController.create)

reportsRouter.get('/', requireAuth, reportsController.list)

reportsRouter.get('/:id', requireAuth, validate(reportIdParamsSchema, 'params'), reportsController.getById)

reportsRouter.patch(
  '/:id/status',
  requireAuth,
  authorize('authority', 'admin'),
  validate(reportIdParamsSchema, 'params'),
  validate(updateStatusSchema),
  reportsController.updateStatus,
)

reportsRouter.patch(
  '/:id/assign',
  requireAuth,
  authorize('admin'),
  validate(reportIdParamsSchema, 'params'),
  validate(assignReportSchema),
  reportsController.assign,
)

reportsRouter.post(
  '/:id/images',
  requireAuth,
  validate(reportIdParamsSchema, 'params'),
  upload.single('image'),
  validate(addImageBodySchema),
  reportsController.addImage,
)

reportsRouter.post(
  '/:id/updates',
  requireAuth,
  authorize('authority', 'admin'),
  validate(reportIdParamsSchema, 'params'),
  validate(addReportUpdateSchema),
  reportsController.addUpdate,
)

export { reportsRouter }
