# layout-system Specification

## Purpose
TBD - created by archiving change enhance-ui-design-system. Update Purpose after archive.
## Requirements
### Requirement: 应用根布局（AppLayout）

系统 SHALL 提供根布局组件，实现侧边栏 + 顶部栏 + 主内容区的经典后台管理布局。

#### Scenario: 基础布局结构

- **WHEN** 用户已登录并访问任意受保护路由
- **THEN** 页面应显示侧边栏、顶部栏和主内容区
- **AND** 侧边栏应固定在左侧，宽度为 240px（展开）或 64px（折叠）
- **AND** 顶部栏应固定在顶部，高度为 60px
- **AND** 主内容区应占据剩余空间，支持滚动

#### Scenario: 登录页不使用根布局

- **WHEN** 用户访问登录页（/login）
- **THEN** 不应显示侧边栏和顶部栏
- **AND** 登录页应使用单独的全屏布局

#### Scenario: 响应式布局切换

- **WHEN** 屏幕宽度 < 768px
- **THEN** 侧边栏应默认隐藏
- **AND** 顶部栏应显示菜单按钮（汉堡图标）
- **AND** 点击菜单按钮应以抽屉形式显示侧边栏

---

### Requirement: 侧边栏组件（Sidebar）

系统 SHALL 提供侧边栏组件，显示导航菜单，支持折叠和权限过滤。

#### Scenario: 菜单渲染

- **WHEN** 侧边栏显示
- **THEN** 应根据路由配置生成菜单项
- **AND** 菜单项应包含图标、文本和路由链接
- **AND** 当前激活的菜单项应高亮显示

#### Scenario: 权限过滤

- **WHEN** 用户无某菜单项的访问权限
- **THEN** 该菜单项应不显示
- **AND** 基于路由 meta.perms 字段判断权限

#### Scenario: 侧边栏折叠

- **WHEN** 用户点击折叠按钮
- **THEN** 侧边栏宽度应收缩到 64px
- **AND** 菜单文本应隐藏，仅显示图标
- **AND** 鼠标悬停时应显示文本提示（Tooltip）

#### Scenario: 折叠状态持久化

- **WHEN** 用户折叠或展开侧边栏
- **THEN** 状态应保存到 localStorage
- **AND** 下次访问时应恢复上次的折叠状态

#### Scenario: 多级菜单（可选）

- **WHEN** 菜单有子菜单
- **THEN** 应支持折叠/展开子菜单
- **AND** 展开状态应有视觉标识（如箭头图标）

---

### Requirement: 顶部栏组件（Topbar）

系统 SHALL 提供顶部栏组件，显示面包屑、用户信息和操作按钮。

#### Scenario: 面包屑导航

- **WHEN** 顶部栏显示
- **THEN** 左侧应显示面包屑导航
- **AND** 面包屑应基于当前路由路径生成
- **AND** 支持点击跳转到上级路由

#### Scenario: 用户信息显示

- **WHEN** 用户已登录
- **THEN** 右侧应显示用户头像（或默认头像）和用户名
- **AND** 点击用户信息应显示下拉菜单
- **AND** 下拉菜单应包含"退出登录"选项

#### Scenario: 主题切换按钮

- **WHEN** 顶部栏显示
- **THEN** 应显示主题切换按钮（亮色/暗色）
- **AND** 点击应切换主题并保存偏好到 localStorage

#### Scenario: 折叠按钮（桌面端）

- **WHEN** 屏幕宽度 >= 768px
- **THEN** 顶部栏左侧应显示侧边栏折叠按钮
- **AND** 点击应切换侧边栏折叠状态

#### Scenario: 菜单按钮（移动端）

- **WHEN** 屏幕宽度 < 768px
- **THEN** 顶部栏左侧应显示菜单按钮（汉堡图标）
- **AND** 点击应打开侧边栏抽屉

---

### Requirement: 面包屑组件（Breadcrumb）

系统 SHALL 提供面包屑组件，显示当前页面在导航层级中的位置。

#### Scenario: 自动生成面包屑

- **WHEN** 用户访问任意页面
- **THEN** 面包屑应根据路由层级自动生成
- **AND** 使用路由 meta.title 作为面包屑文本

#### Scenario: 面包屑点击跳转

- **WHEN** 用户点击面包屑项（非最后一项）
- **THEN** 应跳转到对应的路由
- **AND** 最后一项应为当前页面，不可点击

#### Scenario: 面包屑样式

- **WHEN** 面包屑显示
- **THEN** 应使用斜杠（/）或箭头（>）作为分隔符
- **AND** 当前页面文本应加粗或高亮

#### Scenario: 首页面包屑

- **WHEN** 用户在首页或仪表盘
- **THEN** 面包屑应仅显示"首页"或"仪表盘"
- **AND** 无上级路由

---

### Requirement: 主内容区滚动

系统 SHALL 确保主内容区可独立滚动，侧边栏和顶部栏保持固定。

#### Scenario: 内容区滚动

- **WHEN** 页面内容超过视口高度
- **THEN** 主内容区应显示滚动条
- **AND** 侧边栏和顶部栏应保持固定不滚动

#### Scenario: 回到顶部按钮

- **WHEN** 用户向下滚动超过 300px
- **THEN** 应显示"回到顶部"浮动按钮
- **AND** 点击应平滑滚动到页面顶部

---

### Requirement: 响应式布局断点

系统 SHALL 在不同屏幕尺寸下提供适配的布局。

#### Scenario: 桌面端布局（>= 1024px）

- **WHEN** 屏幕宽度 >= 1024px
- **THEN** 侧边栏应默认展开
- **AND** 主内容区最大宽度应为 1280px，居中显示

#### Scenario: 平板端布局（768px - 1024px）

- **WHEN** 屏幕宽度在 768px - 1024px 之间
- **THEN** 侧边栏应默认折叠
- **AND** 主内容区应占满宽度

#### Scenario: 移动端布局（< 768px）

- **WHEN** 屏幕宽度 < 768px
- **THEN** 侧边栏应改为抽屉式，默认隐藏
- **AND** 顶部栏应显示菜单按钮
- **AND** 表格应横向滚动或改为卡片式布局

