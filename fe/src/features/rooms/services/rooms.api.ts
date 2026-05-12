import { fetchJson } from '@/lib/api'
import { API_BASE_URL, createHttpError } from '@/lib/http'
import type { Room, RoomsResponse } from '@/features/rooms/types/rooms'

export async function getRooms() {
  return fetchJson<RoomsResponse>('/api/phong-thue', { method: 'GET' })
}

export async function getRoomById(id: number) {
  return fetchJson<{ message: string; data: Room }>(`/api/phong-thue/${id}`, {
    method: 'GET',
  })
}

export async function getRoomsByLocation(locationId: number) {
  return fetchJson<RoomsResponse>(
    `/api/phong-thue/lay-phong-theo-vi-tri/${locationId}`,
    { method: 'GET' }
  )
}

export async function createRoom(payload: Partial<Room>) {
  return fetchJson<{ message: string; data: Room }>('/api/phong-thue', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function updateRoom(id: number, payload: Partial<Room>) {
  return fetchJson<{ message: string; data: Room }>(`/api/phong-thue/${id}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export async function deleteRoom(id: number) {
  return fetchJson<{ message: string; data: unknown }>(`/api/phong-thue/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function uploadRoomImage(roomId: number, file: File) {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('formFile', file)

  const response = await fetch(
    `${API_BASE_URL}/api/phong-thue/upload-hinh-phong?maPhong=${roomId}`,
    {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    }
  )

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
