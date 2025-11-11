# 主题系统规范增量

## ADDED Requirements

### Requirement: 设计系统变量

系统 SHALL 建立完整的设计系统变量，包含颜色、字体、间距、圆角、阴影等规范。

#### Scenario: 颜色系统

- **WHEN** 定义颜色变量
- **THEN** 应包含以下颜色类型：
  - 主色（Primary）：#1a56db（深蓝色，专业严肃）
  - 成功色（Success）：#16a34a
  - 警告色（Warning）：#ea580c
  - 危险色（Danger）：#dc2626
  - 信息色（Info）：#0891b2
  - 中性色（Neutral）：灰度系列（gray-50 到 gray-900）
- **AND** 每种颜色应有浅色、默认、深色三个层级

#### Scenario: 字体系统

- **WHEN** 定义字体变量
- **THEN** 应包含以下字体规范：
  - 字体族：system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
  - 字号：xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px), 3xl(30px), 4xl(36px)
  - 行高：tight(1.25), normal(1.5), relaxed(1.75)
  - 字重：light(300), normal(400), medium(500), semibold(600), bold(700)

#### Scenario: 间距系统

- **WHEN** 定义间距变量
- **THEN** 应使用 4px 基数的间距系统：
  - 0, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
- **AND** 变量命名为 spacing-0 到 spacing-24

#### Scenario: 圆角系统

- **WHEN** 定义圆角变量
- **THEN** 应包含：
  - none(0), sm(2px), base(4px), md(6px), lg(8px), xl(12px), 2xl(16px), 3xl(24px), full(9999px)

#### Scenario: 阴影系统

- **WHEN** 定义阴影变量
- **THEN** 应包含：
  - sm: 0 1px 2px rgba(0,0,0,0.05)
  - base: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
  - md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)
  - lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
  - xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)

---

### Requirement: 亮色主题（Light Theme）

系统 SHALL 提供亮色主题，作为默认主题。

#### Scenario: 亮色主题颜色

- **WHEN** 使用亮色主题
- **THEN** 背景色应为：
  - 页面背景：#f9fafb（gray-50）
  - 组件背景：#ffffff
  - 边框颜色：#e5e7eb（gray-200）
  - 文本颜色：#111827（gray-900）
  - 二级文本：#6b7280（gray-500）

#### Scenario: 亮色主题对比度

- **WHEN** 使用亮色主题
- **THEN** 文本与背景的对比度应 >= 4.5:1（WCAG AA 标准）
- **AND** 链接和按钮的对比度应 >= 3:1

---

### Requirement: 暗色主题（Dark Theme）

系统 SHALL 提供暗色主题，用户可手动切换。

#### Scenario: 暗色主题颜色

- **WHEN** 使用暗色主题
- **THEN** 背景色应为：
  - 页面背景：#0f172a（slate-900）
  - 组件背景：#1e293b（slate-800）
  - 边框颜色：#334155（slate-700）
  - 文本颜色：#f1f5f9（slate-100）
  - 二级文本：#94a3b8（slate-400）

#### Scenario: 暗色主题对比度

- **WHEN** 使用暗色主题
- **THEN** 文本与背景的对比度应 >= 4.5:1
- **AND** 主色应适当调亮以保证可读性

#### Scenario: 暗色主题图片处理

- **WHEN** 使用暗色主题
- **THEN** 图片亮度应适当降低（filter: brightness(0.9)）
- **AND** 避免纯白背景图片造成刺眼

---

### Requirement: 主题切换

系统 SHALL 支持用户手动切换亮色/暗色主题。

#### Scenario: 主题切换按钮

- **WHEN** 用户点击顶部栏的主题切换按钮
- **THEN** 应切换到另一个主题
- **AND** 按钮图标应反映当前主题（太阳图标 = 亮色，月亮图标 = 暗色）

#### Scenario: 主题切换动画

- **WHEN** 主题切换发生
- **THEN** 应有平滑的过渡动画（transition: all 0.3s ease）
- **AND** 避免闪烁

#### Scenario: 主题偏好持久化

- **WHEN** 用户切换主题
- **THEN** 偏好应保存到 localStorage（key: theme-preference）
- **AND** 下次访问时应自动加载用户偏好

#### Scenario: 主题跟随系统（可选）

- **WHEN** 用户未设置主题偏好
- **THEN** 应检测系统主题偏好（prefers-color-scheme）
- **AND** 自动使用系统主题

---

### Requirement: Element Plus 主题定制

系统 SHALL 定制 Element Plus 组件库的主题变量，使其与设计系统保持一致。

#### Scenario: 主色定制

- **WHEN** 定制 Element Plus 主题
- **THEN** 应覆盖以下 CSS 变量：
  - --el-color-primary: #1a56db
  - --el-color-success: #16a34a
  - --el-color-warning: #ea580c
  - --el-color-danger: #dc2626
  - --el-color-info: #0891b2

#### Scenario: 圆角定制

- **WHEN** 定制 Element Plus 主题
- **THEN** 应使用统一的圆角变量：
  - --el-border-radius-base: 6px
  - --el-border-radius-small: 4px
  - --el-border-radius-round: 20px
  - --el-border-radius-circle: 100%

#### Scenario: 暗色模式适配

- **WHEN** 使用暗色主题
- **THEN** Element Plus 组件应自动适配暗色模式
- **AND** 使用 Element Plus 的暗色主题变量

---

### Requirement: 全局样式规范

系统 SHALL 建立全局样式规范，确保样式一致性。

#### Scenario: 重置样式

- **WHEN** 页面加载
- **THEN** 应应用 CSS Reset 或 Normalize.css
- **AND** 移除浏览器默认样式（margin, padding 等）

#### Scenario: 盒模型

- **WHEN** 定义全局样式
- **THEN** 应使用 box-sizing: border-box
- **AND** 应用到所有元素（_, _::before, \*::after）

#### Scenario: 平滑滚动

- **WHEN** 页面滚动
- **THEN** 应启用平滑滚动（scroll-behavior: smooth）

#### Scenario: 字体抗锯齿

- **WHEN** 渲染文本
- **THEN** 应启用字体抗锯齿：
  - -webkit-font-smoothing: antialiased
  - -moz-osx-font-smoothing: grayscale

---

### Requirement: 响应式设计变量

系统 SHALL 定义响应式设计的断点变量。

#### Scenario: 断点定义

- **WHEN** 编写响应式样式
- **THEN** 应使用统一的断点变量：
  - xs: 0px（手机）
  - sm: 640px（平板竖屏）
  - md: 768px（平板横屏）
  - lg: 1024px（笔记本）
  - xl: 1280px（桌面）
  - 2xl: 1536px（大屏）

#### Scenario: 移动优先策略

- **WHEN** 编写响应式样式
- **THEN** 应采用移动优先策略（Mobile First）
- **AND** 使用 min-width 媒体查询（而非 max-width）
