import { defineStore } from 'pinia'
import type { UserProfile } from '../../types/user'

export interface UserState {
  token: string | null
  profile: UserProfile | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: null,
    profile: null,
  }),
  getters: {
    isAuthenticated: state => Boolean(state.token),
    userName: state => state.profile?.name ?? '未登录',
  },
  actions: {
    async login(username: string, _password: string) {
      // 模拟登录
      await new Promise(r => setTimeout(r, 300))
      this.token = 'mock-token-' + Date.now()
      this.profile = { id: 'u_' + Date.now(), name: username, role: 'admin' }
    },
    async logout() {
      await new Promise(r => setTimeout(r, 100))
      this.token = null
      this.profile = null
    },
  },
  persist: {
    paths: ['token', 'profile'],
  },
})
