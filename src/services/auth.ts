import { http } from '../utils/http'
import { USE_MOCK } from './_config'
import * as mock from './mock/auth'

export function loginApi(p: { username: string; password: string }) {
  return USE_MOCK ? mock.login(p) : http.post('/auth/login', p)
}

export function logoutApi() {
  return USE_MOCK ? mock.logout() : http.post('/auth/logout')
}

export function meApi() {
  return USE_MOCK ? mock.me() : http.get('/auth/me')
}
