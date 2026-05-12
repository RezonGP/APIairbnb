import { fetchJson } from '@/lib/api'
import type {
  ProfileResponse,
  SigninFormData,
  SigninResponse,
  SignupFormData,
  SignupResponse,
} from '@/features/auth/types/auth'


export async function signup(payload: SignupFormData) {
  return fetchJson<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  })
}
export async function signin(payload: SigninFormData) {
  return fetchJson<SigninResponse>('/api/auth/signin', {
    method: 'POST',
    body: payload,
  })

}

export async function getProfile() {
  return fetchJson<ProfileResponse>('/api/auth/profile', {
    method: 'GET',
    auth: true,
  })
} 
