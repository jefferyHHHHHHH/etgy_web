import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { setupStore } from './stores'
import { useSettingsStore } from './stores/modules/settings'
import { setupI18n } from './plugins/i18n'

const app = createApp(App)
setupStore(app)
// 初始化主题属性（将当前 theme 写入 data-theme）
try {
  const settings = useSettingsStore()
  document.documentElement.setAttribute('data-theme', settings.theme)
  document.documentElement.setAttribute('lang', settings.locale)
  const i18n = setupI18n(settings.locale)
  app.use(i18n)
} catch {}
app.use(router).mount('#app')
