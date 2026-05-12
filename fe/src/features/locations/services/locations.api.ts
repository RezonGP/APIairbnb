import { API_BASE_URL, createHttpError } from '@/lib/http'
import { fetchJson } from '@/lib/api'
import type { Location, LocationsResponse } from '@/features/locations/types/locations'

export async function getLocations() {
  return fetchJson<LocationsResponse>('/api/vi-tri', { method: 'GET' })
}

export async function getLocationById(id: number) {
  return fetchJson<{ message: string; data: Location }>(`/api/vi-tri/${id}`, {
    method: 'GET',
  })
}

export async function createLocation(payload: Partial<Location>) {
  return fetchJson<{ message: string; data: Location }>('/api/vi-tri', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function updateLocation(id: number, payload: Partial<Location>) {
  return fetchJson<{ message: string; data: Location }>(`/api/vi-tri/${id}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export async function deleteLocation(id: number) {
  return fetchJson<{ message: string; data: unknown }>(`/api/vi-tri/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function uploadLocationImage(
  locationId: number,
  file: File
) {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('formFile', file)
  formData.append('id', String(locationId))

  const response = await fetch(`${API_BASE_URL}/api/vi-tri/upload-hinh-anh`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    const text = await response.text()
    throw createHttpError(response.status, text || 'Upload failed')
  }
  const data = (await response.json()) as { message?: string; data?: unknown }
  if (!response.ok) {
    throw createHttpError(response.status, data.message || 'Upload failed')
  }
  return data
}

