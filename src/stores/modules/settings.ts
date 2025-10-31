import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

export type Locale = 'zh-CN' | 'en'

export interface SettingsState {
  theme: Theme
  apiBase: string
  locale: Locale
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'light',
    apiBase: import.meta.env.VITE_API_BASE || '',
    locale: navigator.language === 'zh-CN' ? 'zh-CN' : 'en',
  }),
  getters: {
    isDark: state => state.theme === 'dark',
  },
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
    },
    setApiBase(base: string) {
      this.apiBase = base
    },
    setLocale(locale: Locale) {
      this.locale = locale
      document.documentElement.setAttribute('lang', locale)
    },
  },
  persist: {
    paths: ['theme', 'locale'],
  },
})
