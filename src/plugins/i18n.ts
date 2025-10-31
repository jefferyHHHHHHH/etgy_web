import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'
import en from '../locales/en.json'

export function setupI18n(initialLocale: string = 'zh-CN') {
  const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: 'en',
    messages: { 'zh-CN': zhCN, en },
    globalInjection: true,
  })
  return i18n
}
