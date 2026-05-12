import { API_BASE_URL, createHttpError } from '@/lib/http'

type FetchJsonOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
}

export async function fetchJson<T>(
  path: string,
  { auth, headers, body, ...init }: FetchJsonOptions = {}
) {
  const token = localStorage.getItem('token')

  const nextHeaders = new Headers(headers)
  if (!nextHeaders.get('Content-Type') && body !== undefined) {
    nextHeaders.set('Content-Type', 'application/json')
  }
  if (auth) {
    if (token) {
      nextHeaders.set('Authorization', `Bearer ${token}`)
    } else {
      throw createHttpError(401, 'Token không tồn tại')
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: nextHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    const text = await response.text()
    throw createHttpError(
      response.status,
      text || `Unexpected response (status ${response.status})`
    )
  }

  const data = (await response.json()) as T & { message?: string }

  if (!response.ok) {
    throw createHttpError(
      response.status,
      data?.message?.toString() || `Request failed (status ${response.status})`
    )
  }

  return data as T
}

