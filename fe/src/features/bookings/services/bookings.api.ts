import { fetchJson } from '@/lib/api'
import type {
  Booking,
  BookingsResponse,
  CreateBookingPayload,
} from '@/features/bookings/types/bookings'

export async function getMyBookings() {
  return fetchJson<BookingsResponse>('/api/dat-phong/me', { method: 'GET', auth: true })
}

export async function getAllBookingsAdmin() {
  return fetchJson<BookingsResponse>('/api/dat-phong/admin', { method: 'GET', auth: true })
}

export async function createBooking(payload: CreateBookingPayload) {
  return fetchJson<{ message: string; data: Booking }>('/api/dat-phong', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function updateBooking(id: number, payload: Partial<CreateBookingPayload>) {
  return fetchJson<{ message: string; data: Booking }>(`/api/dat-phong/${id}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export async function deleteBooking(id: number) {
  return fetchJson<{ message: string; data: unknown }>(`/api/dat-phong/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

