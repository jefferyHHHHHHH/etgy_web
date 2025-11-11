# UI 组件规范增量

## ADDED Requirements

### Requirement: 页面容器组件（PageContainer）

系统 SHALL 提供统一的页面容器组件，用于包裹所有页面内容，提供一致的页面标题、操作区和内容区布局。

#### Scenario: 基础页面容器

- **WHEN** 用户访问任意管理页面
- **THEN** 页面应显示统一的标题栏和内容区
- **AND** 标题栏应包含页面标题和可选的操作按钮区域
- **AND** 内容区应有适当的内边距和背景

#### Scenario: 带操作按钮的页面容器

- **WHEN** 页面需要顶部操作按钮（如"新建"、"导出"）
- **THEN** PageContainer 应支持通过 slot 传入操作按钮
- **AND** 操作按钮应右对齐显示在标题栏

#### Scenario: 响应式页面容器

- **WHEN** 屏幕宽度 < 768px
- **THEN** 页面容器应自动调整内边距
- **AND** 标题和操作按钮应堆叠显示

---

### Requirement: 状态标签组件（StatusTag）

系统 SHALL 提供统一的状态标签组件，用于显示视频、直播申请等业务对象的状态，保持样式和颜色的一致性。

#### Scenario: 视频状态标签

- **WHEN** 显示视频状态
- **THEN** 系统应根据状态值显示对应的颜色和文本
- **AND** 状态映射应为：
  - draft → 灰色（info）、"草稿"
  - in_review → 橙色（warning）、"待审"
  - approved → 绿色（success）、"通过"
  - rejected → 红色（danger）、"驳回"
  - published → 绿色（success）、"已发布"
  - unpublished → 灰色（info）、"已下架"

#### Scenario: 直播申请状态标签

- **WHEN** 显示直播申请状态
- **THEN** 系统应根据状态值显示对应的颜色和文本
- **AND** 状态映射应为：
  - pending → 橙色（warning）、"待审核"
  - approved → 绿色（success）、"已通过"
  - rejected → 红色（danger）、"已驳回"

#### Scenario: 自定义状态标签

- **WHEN** 传入未预定义的状态值
- **THEN** 系统应显示原始状态文本
- **AND** 使用默认颜色（info）

---

### Requirement: 搜索表单组件（SearchForm）

系统 SHALL 提供统一的搜索表单组件，封装常见的搜索、筛选、重置等操作，减少重复代码。

#### Scenario: 基础搜索表单

- **WHEN** 页面需要搜索功能
- **THEN** SearchForm 应提供关键词输入框和搜索按钮
- **AND** 支持按 Enter 键触发搜索
- **AND** 支持清空按钮

#### Scenario: 多条件筛选

- **WHEN** 需要多个筛选条件（如状态、日期范围）
- **THEN** SearchForm 应支持通过配置动态生成表单项
- **AND** 支持下拉选择、日期选择等常见表单控件

#### Scenario: 搜索状态持久化

- **WHEN** 用户进行搜索后离开页面
- **THEN** 搜索条件应保存到 URL 查询参数
- **AND** 返回页面时应自动恢复搜索条件

---

### Requirement: 表格操作列组件（TableActions）

系统 SHALL 提供统一的表格操作列组件，封装常见的"详情"、"编辑"、"删除"等操作按钮，并集成权限控制。

#### Scenario: 基础操作列

- **WHEN** 表格需要操作列
- **THEN** TableActions 应提供常见操作按钮（详情、编辑、删除）
- **AND** 按钮应为文字链接样式，节省空间

#### Scenario: 权限控制

- **WHEN** 当前用户无某操作权限
- **THEN** 对应的操作按钮应隐藏
- **AND** 使用 v-permission 指令实现权限控制

#### Scenario: 条件显示

- **WHEN** 某操作仅在特定状态下可用（如"发布"仅对 approved 状态视频可用）
- **THEN** TableActions 应支持条件显示配置
- **AND** 不符合条件的按钮应隐藏或禁用

#### Scenario: 自定义操作

- **WHEN** 需要自定义操作按钮
- **THEN** TableActions 应支持通过 slot 传入自定义按钮
- **AND** 自定义按钮应与预设按钮样式一致

---

### Requirement: 空状态组件（EmptyState）

系统 SHALL 提供统一的空状态组件，用于列表无数据、搜索无结果等场景，提升用户体验。

#### Scenario: 列表无数据

- **WHEN** 列表首次加载且无数据
- **THEN** 应显示空状态图标和提示文本
- **AND** 提示文本应为"暂无数据"
- **AND** 可选地显示操作按钮（如"新建"）

#### Scenario: 搜索无结果

- **WHEN** 用户搜索后无匹配结果
- **THEN** 应显示空状态图标和提示文本
- **AND** 提示文本应为"未找到相关内容"
- **AND** 提供"清空搜索条件"的引导

#### Scenario: 自定义空状态

- **WHEN** 需要自定义空状态文案或图标
- **THEN** EmptyState 应支持通过 props 或 slot 自定义
- **AND** 保持视觉风格一致

---

### Requirement: Logo 占位组件

系统 SHALL 提供 Logo 占位组件，用于侧边栏和登录页的品牌展示区域，便于后续替换为正式 Logo。

#### Scenario: 侧边栏 Logo

- **WHEN** 侧边栏展开状态
- **THEN** 应显示 Logo 图片和应用名称
- **AND** Logo 应为正方形或横向矩形，尺寸约 32x32px

#### Scenario: 侧边栏折叠 Logo

- **WHEN** 侧边栏折叠状态
- **THEN** 应仅显示 Logo 图标（不显示名称）
- **AND** 图标应为方形，尺寸约 28x28px

#### Scenario: 登录页 Logo

- **WHEN** 用户访问登录页
- **THEN** 应在登录表单上方显示 Logo 和应用名称
- **AND** Logo 尺寸应更大（约 64x64px）

#### Scenario: Logo 占位图

- **WHEN** 正式 Logo 未设计完成
- **THEN** 应使用占位图（如应用名称首字母或简单几何图形）
- **AND** 占位图应为 SVG 格式，支持主题色
