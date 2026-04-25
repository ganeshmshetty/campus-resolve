import { env, isSupabaseConfigured } from './config/env.js'
import { app } from './app.js'

app.listen(env.PORT, () => {
  const mode = isSupabaseConfigured ? 'supabase' : 'mock'
  console.log(`Backend listening on http://localhost:${env.PORT} (${mode} mode)`)
})
