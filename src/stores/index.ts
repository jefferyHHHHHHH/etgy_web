import type { App } from 'vue'
import { createPinia } from 'pinia'
import persistedState from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persistedState)

export function setupStore(app: App) {
  app.use(pinia)
}

export { pinia }
export * from './modules/app'
export * from './modules/user'
export * from './modules/settings'
