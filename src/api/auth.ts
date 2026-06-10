import { apiClient } from './client'

type LoginPayload = {
  username: string
  password: string
}

type LoginResponse = {
  access_token: string
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload)
  return response.data
}
