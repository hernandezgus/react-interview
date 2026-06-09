const DEFAULT_API_URL = 'http://localhost:3000'

type RequestOptions = {
  body?: unknown
  headers?: HeadersInit
  method?: 'DELETE' | 'GET' | 'POST' | 'PUT'
}

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<TResponse>(
  path: string,
  token: string | null,
  options: RequestOptions = {},
) {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${resolveApiUrl()}${path}`, {
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    headers,
    method: options.method ?? 'GET',
  })

  const rawBody = await response.text()
  const data = rawBody ? (JSON.parse(rawBody) as unknown) : null

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data, response.status), response.status)
  }

  return data as TResponse
}

function extractErrorMessage(data: unknown, status: number) {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = data.message
    if (typeof message === 'string') {
      return message
    }
  }

  return `Request failed with status ${status}.`
}

function resolveApiUrl() {
  return (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '')
}

export const apiClient = {
  delete: (path: string, token: string | null) =>
    request<void>(path, token, { method: 'DELETE' }),
  get: <TResponse>(path: string, token: string | null) =>
    request<TResponse>(path, token),
  post: <TResponse, TBody>(path: string, body: TBody, token: string | null) =>
    request<TResponse>(path, token, { body, method: 'POST' }),
  put: <TResponse, TBody>(path: string, body: TBody, token: string | null) =>
    request<TResponse>(path, token, { body, method: 'PUT' }),
}
