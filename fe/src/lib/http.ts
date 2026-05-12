export type HttpError = Error & { status: number }

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString() || 'http://localhost:3000'

export function createHttpError(status: number, message: string): HttpError {
  const error = new Error(message) as HttpError
  error.status = status
  return error
}
