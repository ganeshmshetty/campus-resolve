const VITE_API_URL = import.meta.env.VITE_API_URL || ''
// Ensure BASE_URL ends with /api if it's an absolute URL, or defaults to /api for relative calls
const BASE_URL = VITE_API_URL 
  ? (VITE_API_URL.endsWith('/api') ? VITE_API_URL : `${VITE_API_URL.replace(/\/$/, '')}/api`)
  : '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = `${BASE_URL}${cleanPath}`
  const token = localStorage.getItem('access_token')
  
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unable to read response body');
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      throw new Error(`API Error (${response.status} ${response.statusText}): ${errorText.slice(0, 100)}...`);
    }
    const errorMessage = errorData?.error?.message || errorData?.message || response.statusText || 'Unknown Error'
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return {} as T
  }

  try {
    return await response.json()
  } catch (err) {
    throw new Error('Invalid JSON response from server. The API might be unreachable.')
  }
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'DELETE' }),
}
