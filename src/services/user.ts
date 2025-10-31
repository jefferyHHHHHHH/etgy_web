import { http } from '../utils/http'
import type { UserProfile } from '../types/user'

export function apiGetProfile() {
  // 例：云函数暴露的 /user/profile
  return http.get<UserProfile>('/user/profile')
}

export function apiLogin(data: { username: string; password: string }) {
  // 例：云函数暴露的 /auth/login
  return http.post<{ token: string; profile: UserProfile }>('/auth/login', data)
}
