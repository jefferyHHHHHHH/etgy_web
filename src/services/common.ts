import { http } from '../utils/http'

export function apiPing() {
  return http.get<{ pong: boolean }>('/ping', undefined, { showError: false, retry: 1 })
}
