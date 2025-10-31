import { defineStore } from 'pinia'

export interface PermsState {
  list: string[]
}

export const usePermsStore = defineStore('perms', {
  state: (): PermsState => ({ list: [] }),
  getters: {
    has: state => (p: string) => state.list.includes(p) || state.list.includes('menu.view:*'),
    set: state => new Set(state.list),
  },
  actions: {
    setPerms(perms: string[]) {
      this.list = Array.from(new Set(perms))
    },
    clear() {
      this.list = []
    },
  },
  persist: { paths: ['list'] },
})
