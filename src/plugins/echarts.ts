import type { App } from 'vue'
import ECharts from 'vue-echarts'

export function setupECharts(app: App) {
  // 全局注册 VChart 组件
  app.component('VChart', ECharts)
}
