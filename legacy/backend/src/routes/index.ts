import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { adminRouter } from './admin.routes.js'
import { authRouter } from './auth.routes.js'
import { reportsRouter } from './reports.routes.js'

const apiRouter = Router()

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

apiRouter.use('/auth', authRouter)
apiRouter.get('/me', requireAuth, authController.me)
apiRouter.use('/reports', reportsRouter)
apiRouter.use('/admin', adminRouter)

export { apiRouter }
