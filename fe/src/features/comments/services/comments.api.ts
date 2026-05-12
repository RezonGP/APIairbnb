import { fetchJson } from '@/lib/api'
import type {
  Comment,
  CommentsResponse,
  CreateCommentPayload,
} from '@/features/comments/types/comments'

export async function getCommentsByRoom(roomId: number) {
  return fetchJson<CommentsResponse>(
    `/api/binh-luan/lay-binh-luan-theo-phong/${roomId}`,
    { method: 'GET' }
  )
}

export async function getAllComments() {
  return fetchJson<CommentsResponse>('/api/binh-luan', { method: 'GET' })
}

export async function createComment(payload: CreateCommentPayload) {
  return fetchJson<{ message: string; data: Comment }>('/api/binh-luan', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function updateComment(commentId: number, payload: Partial<CreateCommentPayload>) {
  return fetchJson<{ message: string; data: Comment }>(`/api/binh-luan/${commentId}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export async function deleteComment(commentId: number) {
  return fetchJson<{ message: string; data: unknown }>(`/api/binh-luan/${commentId}`, {
    method: 'DELETE',
    auth: true,
  })
}
