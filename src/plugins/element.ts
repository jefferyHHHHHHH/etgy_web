import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'

export function setupElement(app: App) {
  app.use(ElementPlus)
  // 全量注册图标（按需可后续优化）
  Object.entries(Icons).forEach(([name, comp]) => {
    app.component(name, comp as any)
  })
}
