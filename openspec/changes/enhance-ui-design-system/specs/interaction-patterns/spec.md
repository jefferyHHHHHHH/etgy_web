# 交互模式规范增量

## ADDED Requirements

### Requirement: 加载状态

系统 SHALL 提供统一的加载状态反馈，包括骨架屏、加载进度条、Loading 动画等。

#### Scenario: 骨架屏加载

- **WHEN** 页面或列表首次加载
- **THEN** 应显示骨架屏（Skeleton）而非空白
- **AND** 骨架屏应模拟内容布局（如卡片、列表项）
- **AND** 骨架屏应有呼吸动画效果

#### Scenario: 页面切换进度条

- **WHEN** 用户切换路由
- **THEN** 页面顶部应显示加载进度条（NProgress）
- **AND** 进度条应在路由导航开始时出现
- **AND** 进度条应在路由导航完成后消失

#### Scenario: 按钮加载状态

- **WHEN** 用户点击提交按钮触发异步操作
- **THEN** 按钮应显示 Loading 图标
- **AND** 按钮应禁用，防止重复提交
- **AND** Loading 状态应在操作完成后自动解除

#### Scenario: 表格加载状态

- **WHEN** 表格数据加载中
- **THEN** 表格应显示 Loading 遮罩
- **AND** 使用 Element Plus 的 v-loading 指令

---

### Requirement: 操作反馈

系统 SHALL 对用户操作提供即时反馈，包括成功、失败、警告等提示。

#### Scenario: 成功提示

- **WHEN** 用户操作成功（如保存、发布）
- **THEN** 应显示成功提示（绿色、勾选图标）
- **AND** 提示应在 3 秒后自动消失
- **AND** 使用 Element Plus 的 ElMessage.success

#### Scenario: 失败提示

- **WHEN** 用户操作失败（如提交被拒绝）
- **THEN** 应显示错误提示（红色、叉号图标）
- **AND** 提示应包含错误原因
- **AND** 提示应在 5 秒后消失或用户手动关闭

#### Scenario: 警告提示

- **WHEN** 需要提醒用户注意
- **THEN** 应显示警告提示（橙色、感叹号图标）
- **AND** 使用 Element Plus 的 ElMessage.warning

#### Scenario: 确认对话框

- **WHEN** 用户执行危险操作（如删除）
- **THEN** 应弹出确认对话框
- **AND** 对话框应说明操作后果
- **AND** 提供"取消"和"确认"按钮
- **AND** 使用 Element Plus 的 ElMessageBox.confirm

---

### Requirement: 列表项悬停效果

系统 SHALL 为列表项、卡片等可交互元素提供悬停效果，提升交互反馈。

#### Scenario: 表格行悬停

- **WHEN** 鼠标悬停在表格行上
- **THEN** 该行背景色应变浅（浅灰色或浅蓝色）
- **AND** 使用 Element Plus 表格的默认悬停效果

#### Scenario: 卡片悬停

- **WHEN** 鼠标悬停在可点击的卡片上
- **THEN** 卡片应有阴影提升效果（shadow: hover）
- **AND** 卡片应有轻微的向上位移（transform: translateY(-2px)）
- **AND** 鼠标指针应变为 pointer

#### Scenario: 按钮悬停

- **WHEN** 鼠标悬停在按钮上
- **THEN** 按钮背景色应加深
- **AND** 使用 Element Plus 按钮的默认悬停效果

---

### Requirement: 快捷键支持

系统 SHALL 支持常用快捷键，提升操作效率。

#### Scenario: 全局搜索快捷键

- **WHEN** 用户按下 Ctrl+K（Windows）或 Cmd+K（Mac）
- **THEN** 应打开全局搜索框或搜索对话框
- **AND** 搜索框应自动聚焦

#### Scenario: 关闭弹窗快捷键

- **WHEN** 弹窗、抽屉或对话框打开时，用户按下 Esc
- **THEN** 应关闭当前弹窗
- **AND** 不影响表单输入

#### Scenario: 保存表单快捷键

- **WHEN** 表单聚焦时，用户按下 Ctrl+S（Windows）或 Cmd+S（Mac）
- **THEN** 应触发表单提交
- **AND** 阻止浏览器默认的保存页面行为

#### Scenario: 快捷键提示

- **WHEN** 用户首次使用系统
- **THEN** 应在合适的位置提示可用的快捷键
- **AND** 可选地在帮助菜单中列出所有快捷键

---

### Requirement: 虚拟滚动

系统 SHALL 支持虚拟滚动，优化大列表的渲染性能。

#### Scenario: 大列表虚拟滚动

- **WHEN** 列表数据量超过 100 条
- **THEN** 应使用虚拟滚动技术
- **AND** 仅渲染可见区域的列表项
- **AND** 滚动应流畅，无明显卡顿

#### Scenario: 虚拟化表格

- **WHEN** 表格数据量超过 100 条
- **THEN** 应使用 Element Plus 的 el-table-v2（虚拟化表格）
- **AND** 支持排序、筛选等功能

#### Scenario: 虚拟滚动与搜索

- **WHEN** 用户搜索或筛选虚拟滚动列表
- **THEN** 虚拟滚动应自动更新
- **AND** 滚动位置应重置到顶部

---

### Requirement: 无限滚动分页

系统 SHALL 支持无限滚动分页，作为传统分页的补充。

#### Scenario: 触底加载更多

- **WHEN** 用户滚动到列表底部
- **THEN** 应自动加载下一页数据
- **AND** 显示"加载中"提示
- **AND** 新数据应追加到列表末尾

#### Scenario: 加载完成提示

- **WHEN** 所有数据已加载完毕
- **THEN** 应显示"没有更多数据"提示
- **AND** 不再触发加载

#### Scenario: 加载失败重试

- **WHEN** 加载下一页失败
- **THEN** 应显示"加载失败"提示
- **AND** 提供"重试"按钮

#### Scenario: 无限滚动与传统分页切换

- **WHEN** 用户偏好传统分页
- **THEN** 应支持在列表页配置切换
- **AND** 默认使用传统分页（符合 MVP 约束）

---

### Requirement: 响应式交互

系统 SHALL 在不同设备上提供适配的交互方式。

#### Scenario: 移动端触摸优化

- **WHEN** 在移动端使用
- **THEN** 按钮和可点击区域应有足够的触摸热区（>= 44x44px）
- **AND** 避免悬停效果（移动端无悬停）

#### Scenario: 移动端表格交互

- **WHEN** 在移动端查看表格
- **THEN** 表格应支持横向滚动
- **AND** 可选地提供卡片式布局（更适合小屏）

#### Scenario: 移动端菜单交互

- **WHEN** 在移动端打开侧边栏菜单
- **THEN** 应使用抽屉式菜单（Drawer）
- **AND** 点击菜单项后应自动关闭抽屉

---

### Requirement: 动画与过渡

系统 SHALL 使用适度的动画和过渡效果，提升用户体验。

#### Scenario: 页面切换动画

- **WHEN** 用户切换路由
- **THEN** 新页面应有淡入 + 向上位移的动画
- **AND** 动画时长应为 250ms
- **AND** 使用 ease 缓动函数

#### Scenario: 列表项进入动画

- **WHEN** 列表首次渲染或新增列表项
- **THEN** 列表项应依次淡入
- **AND** 每项延迟 50ms（错峰动画）

#### Scenario: 展开/折叠动画

- **WHEN** 侧边栏折叠或展开
- **THEN** 应有平滑的宽度过渡动画
- **AND** 动画时长应为 300ms

#### Scenario: 动画性能优化

- **WHEN** 使用动画
- **THEN** 应优先使用 transform 和 opacity（GPU 加速）
- **AND** 避免动画 width、height、margin 等触发重排的属性
- **AND** 在低性能设备上应禁用复杂动画（prefers-reduced-motion）

---

### Requirement: 批量操作

系统 SHALL 支持列表项的批量操作，提升操作效率。

#### Scenario: 批量选择

- **WHEN** 列表支持批量操作
- **THEN** 表格第一列应显示复选框
- **AND** 表头应有全选/取消全选复选框

#### Scenario: 批量操作按钮

- **WHEN** 用户选中至少一项
- **THEN** 应显示批量操作工具栏
- **AND** 工具栏应包含批量操作按钮（如批量删除、批量审核）
- **AND** 工具栏应显示已选中的数量

#### Scenario: 批量操作确认

- **WHEN** 用户执行批量操作
- **THEN** 应弹出确认对话框
- **AND** 对话框应说明将影响的数据数量
- **AND** 提供"取消"和"确认"按钮

#### Scenario: 批量操作进度

- **WHEN** 批量操作执行中
- **THEN** 应显示进度条或进度百分比
- **AND** 支持取消操作（如果后端支持）
