import { defineStore } from 'pinia'

export interface AppState {
  sidebarCollapsed: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarCollapsed: false,
  }),
  getters: {
    isSidebarCollapsed: state => state.sidebarCollapsed,
  },
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },
  },
  persist: {
    paths: ['sidebarCollapsed'],
  },
})
