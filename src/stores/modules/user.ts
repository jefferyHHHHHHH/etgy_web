import { defineStore } from 'pinia'
import type { UserProfile } from '../../types/user'
import { loginApi, logoutApi, meApi } from '../../services/auth'
import { usePermsStore } from './perms'

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
    async login(username: string, password: string) {
      const res = await loginApi({ username, password })
      this.token = res.token
      this.profile = {
        id: res.user.uid,
        name: username,
        role: (res.user.roleIds?.[0] || 'user') as any,
      }
      const perms = usePermsStore()
      perms.setPerms(res.permissions || [])
    },
    async logout() {
      try {
        await logoutApi()
      } catch {}
      this.token = null
      this.profile = null
      const perms = usePermsStore()
      perms.clear()
    },
    async restore() {
      if (!this.token) return
      try {
        const res = await meApi()
        this.profile = {
          id: res.user.uid,
          name: this.profile?.name || '用户',
          role: (res.user.roleIds?.[0] || 'user') as any,
        }
        const perms = usePermsStore()
        perms.setPerms(res.permissions || [])
      } catch {
        await this.logout()
      }
    },
  },
  persist: {
    paths: ['token', 'profile'],
  },
})
