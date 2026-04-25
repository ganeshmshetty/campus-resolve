import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env, isSupabaseConfigured } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { apiRouter } from './routes/index.js'

const app = express()

const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim())

// Use type assertion to handle CJS/ESM hybrid packages that TS struggles with in NodeNext mode
app.use((helmet as any)())
app.use((cors as any)({ origin: corsOrigins }))
app.use((morgan as any)('dev'))
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => {
  res.json({
    data: {
      status: 'ok',
      mode: isSupabaseConfigured ? 'supabase' : 'mock',
      timestamp: new Date().toISOString(),
    },
  })
})

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
export { app }
