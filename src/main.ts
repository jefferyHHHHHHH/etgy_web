import { createApp } from 'vue'
// 设计系统样式 - 按顺序加载
import './styles/theme.css' // CSS 变量（亮色/暗色主题）
import './styles/global.scss' // 全局样式
import './styles/element-override.scss' // Element Plus 主题定制
import './styles/performance-optimizations.scss' // 性能优化样式
import App from './App.vue'
import router from './router'
import { setupStore } from './stores'
import { useSettingsStore } from './stores/modules/settings'
import { setupI18n } from './plugins/i18n'
import { setupElement } from './plugins/element'
import { setupECharts } from './plugins/echarts'

const app = createApp(App)
setupECharts(app)
setupStore(app)
setupElement(app)
// 初始化主题属性（将当前 theme 写入 data-theme）
try {
  const settings = useSettingsStore()
  document.documentElement.setAttribute('data-theme', settings.theme)
  document.documentElement.setAttribute('lang', settings.locale)
  const i18n = setupI18n(settings.locale)
  app.use(i18n)
} catch {}
// 恢复会话与权限
try {
  const { useUserStore } = await import('./stores/modules/user')
  const user = useUserStore()
  await user.restore()
} catch {}
app.use(router).mount('#app')
