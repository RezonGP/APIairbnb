import { fetchJson } from '@/lib/api'
import { API_BASE_URL, createHttpError } from '@/lib/http'
import type { User, UsersResponse } from '@/features/users/types/users'

export async function getUsers() {
  return fetchJson<UsersResponse>('/api/users', { method: 'GET', auth: true })
}

export async function getUserById(id: number) {
  return fetchJson<{ message: string; data: User }>(`/api/users/${id}`, {
    method: 'GET',
    auth: true,
  })
}

export async function createUser(payload: {
  name: string
  email: string
  password: string
  phone: string
  birthday?: string | null
  gender?: boolean | null
  role?: string
}) {
  return fetchJson<{ message: string; data: User }>('/api/users', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function updateUser(
  id: number,
  payload: Partial<{
    name: string
    email: string
    phone: string
    birthday: string | null
    gender: boolean | null
    role: string
  }>
) {
  return fetchJson<{ message: string; data: User }>(`/api/users/${id}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export async function deleteUser(id: number) {
  return fetchJson<{ message: string; data: unknown }>(`/api/users/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function searchUsersByName(keyword: string) {
  return fetchJson<UsersResponse>(`/api/users/search/${encodeURIComponent(keyword)}`, {
    method: 'GET',
    auth: true,
  })
}

export async function uploadUserAvatar(file: File) {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('formFile', file)

  const response = await fetch(`${API_BASE_URL}/api/users/upload-avatar`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    const text = await response.text()
    throw createHttpError(response.status, text || 'Upload failed')
  }
  const data = (await response.json()) as { message?: string; data?: User }
  if (!response.ok) {
    throw createHttpError(response.status, data.message || 'Upload failed')
  }
  return data
}
