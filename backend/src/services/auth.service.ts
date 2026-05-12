import { randomUUID } from 'node:crypto'
import { getAdminSupabaseClient, getPublicSupabaseClient } from '../config/supabase.js'
import { HTTP_STATUS } from '../constants/http.js'
import { mockUsers } from '../data/mockStore.js'
import { isSupabaseConfigured } from '../config/env.js'
import type { AuthUser, Role } from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'

type RegisterInput = {
  name: string
  email: string
  password: string
  role?: Role
}

type LoginInput = {
  email: string
  password: string
}

function buildMockToken(user: AuthUser) {
  return Buffer.from(JSON.stringify(user)).toString('base64url')
}

function parseMockToken(accessToken: string): AuthUser {
  try {
    const parsed = JSON.parse(Buffer.from(accessToken, 'base64url').toString('utf8'))

    if (!parsed?.id || !parsed?.email || !parsed?.role) {
      throw new Error('Invalid token payload')
    }

    return parsed as AuthUser
  } catch {
    throw new HttpError(HTTP_STATUS.unauthorized, 'Invalid access token')
  }
}

async function fetchRoleAndName(userId: string) {
  const client = getAdminSupabaseClient()
  const { data, error } = await client
    .from('profiles')
    .select('role, name')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new HttpError(HTTP_STATUS.internalServerError, error.message)
  }

  return {
    role: (data?.role ?? 'user') as Role,
    name: data?.name as string | undefined,
  }
}

async function registerWithSupabase({ name, email, password, role }: Required<RegisterInput>) {
  const client = getAdminSupabaseClient()

  const { data: createdUserData, error: createError } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role,
    },
  })

  if (createError) {
    const statusCode = createError.status === 422 ? HTTP_STATUS.conflict : HTTP_STATUS.badRequest
    throw new HttpError(statusCode, createError.message)
  }

  const userId = createdUserData.user?.id

  if (!userId) {
    throw new HttpError(HTTP_STATUS.internalServerError, 'Unable to create auth user')
  }

  const { error: profileError } = await client.from('profiles').insert({
    id: userId,
    name,
    email,
    role,
  })

  if (profileError) {
    throw new HttpError(HTTP_STATUS.internalServerError, profileError.message)
  }

  return {
    id: userId,
    email,
    name,
    role,
  }
}

async function loginWithSupabase({ email, password }: LoginInput) {
  const client = getPublicSupabaseClient()
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.session || !data.user) {
    throw new HttpError(HTTP_STATUS.unauthorized, 'Invalid email or password')
  }

  const { role, name } = await fetchRoleAndName(data.user.id)

  return {
    accessToken: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email ?? email,
      role,
      name,
    } satisfies AuthUser,
  }
}

function registerInMock({ name, email, password, role }: Required<RegisterInput>) {
  const normalizedEmail = email.toLowerCase()

  const existing = mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail)

  if (existing) {
    throw new HttpError(HTTP_STATUS.conflict, 'Email is already registered')
  }

  const now = new Date().toISOString()
  const newUser = {
    id: randomUUID(),
    name,
    email: normalizedEmail,
    password,
    role,
    created_at: now,
  }

  mockUsers.push(newUser)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  }
}

function loginInMock({ email, password }: LoginInput) {
  const user = mockUsers.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password,
  )

  if (!user) {
    throw new HttpError(HTTP_STATUS.unauthorized, 'Invalid email or password')
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }

  return {
    accessToken: buildMockToken(authUser),
    user: authUser,
  }
}

export const authService = {
  async register(input: RegisterInput) {
    const payload: Required<RegisterInput> = {
      ...input,
      role: input.role ?? 'user',
      email: input.email.toLowerCase(),
    }

    if (isSupabaseConfigured) {
      return registerWithSupabase(payload)
    }

    return registerInMock(payload)
  },

  async registerAuthority(input: RegisterInput) {
    return this.register({ ...input, role: 'authority' })
  },

  async login(input: LoginInput) {
    if (isSupabaseConfigured) {
      return loginWithSupabase(input)
    }

    return loginInMock(input)
  },

  async getCurrentUser(accessToken: string) {
    if (!isSupabaseConfigured) {
      return parseMockToken(accessToken)
    }

    const client = getAdminSupabaseClient()
    const { data, error } = await client.auth.getUser(accessToken)

    if (error || !data.user) {
      throw new HttpError(HTTP_STATUS.unauthorized, 'Invalid access token')
    }

    const { role, name } = await fetchRoleAndName(data.user.id)

    return {
      id: data.user.id,
      email: data.user.email ?? '',
      role,
      name,
    } satisfies AuthUser
  },
}
