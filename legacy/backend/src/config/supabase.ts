import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from './env.js'

let adminClient: SupabaseClient | null = null
let publicClient: SupabaseClient | null = null

if (isSupabaseConfigured) {
  adminClient = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  if (env.SUPABASE_ANON_KEY) {
    publicClient = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
}

export function getAdminSupabaseClient() {
  if (!adminClient) {
    throw new Error('Supabase admin client is not configured')
  }

  return adminClient
}

export function getPublicSupabaseClient() {
  if (!publicClient) {
    throw new Error('Supabase public client is not configured')
  }

  return publicClient
}
