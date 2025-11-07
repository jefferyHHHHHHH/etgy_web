# 项目上下文

## 目的

本项目是**儿童公益教育平台 Web 管理端（MVP 版本）**，用于视频内容管理与审核、直播申请审核，以及基础的 RBAC 权限管理。

**项目体系背景**：

- 整体平台基于云原生架构与 WebRTC 实时通信技术，采用 Flutter + 厂商 WebRTC SDK（如腾讯云 TRTC）实现跨平台实时互动
- 包含：安卓 App、微信小程序、Web 管理端三部分
- Web 管理端面向两类核心用户：
  - **志愿者**：提供视频内容创作与管理功能，可上传教学视频、提交直播申请
  - **学院管理员**：对所属学院志愿者上传的视频与直播申请进行审核、管理与内容监控

**核心目标**：

- 以最小可行集快速落地后台管理 Web
- 实现视频上传 → 审核 → 发布/下架的完整链路
- 支持直播申请的列表/详情/审核（Web 不推流/不开播）
- 基于角色的权限控制（RBAC）生效
- 审计关键操作，确保合规

## 技术栈

**前端**：

- Vue 3 (Composition API)
- TypeScript
- Vite (构建工具)
- Element Plus (UI 框架)
- Pinia (状态管理)
- Vue Router (路由)
- Axios (HTTP 客户端)

**后端**：

- 微信云开发（云函数 / 云数据库 / 云存储）
- 前端通过 HTTP 云函数调用
- JWT 鉴权

**开发工具**：

- Node.js ≥ 18
- ESLint + Prettier (代码规范)
- Stylelint (样式规范)
- Husky + lint-staged (提交前校验)
- Commitlint (提交信息规范)

## 项目约定

### 代码风格

- **TypeScript**：严格模式，所有组件与服务层必须类型化
- **组件命名**：PascalCase（如 `VideoList.vue`）
- **文件命名**：
  - 组件：PascalCase
  - 工具函数：camelCase
  - 路由文件：kebab-case
- **代码格式化**：
  - 使用 Prettier 统一格式（2 空格缩进，单引号，无分号）
  - 提交前自动格式化（lint-staged）
- **ESLint 规则**：
  - 基于 Vue 3 + TypeScript 推荐配置
  - 禁止 `any` 类型（除非必要并注释说明）
  - 未使用的变量必须移除
- **样式规范**：
  - 使用 Stylelint 检查
  - 优先使用 scoped CSS
  - BEM 命名法用于全局样式

### 架构模式

**分层架构**：

```
src/
├── router/            # 路由定义与守卫
├── stores/            # Pinia 状态管理（user、permissions 等）
├── services/          # 服务层（真实接口 + Mock 实现）
│   └── mock/          # Mock 数据（开发期使用）
├── views/             # 页面组件
├── components/        # 可复用组件
├── directives/        # 自定义指令（如 v-permission）
├── plugins/           # 第三方插件挂载
└── utils/             # 工具函数（http 拦截器、notify 等）
```

**关键设计决策**：

- **服务层抽象**：所有 API 调用封装在 `services/` 中，支持 Mock/真实接口切换（通过 `VITE_USE_MOCK` 环境变量）
- **权限控制**：
  - 路由级：`meta.perms` 标注所需权限，导航守卫校验
  - 组件级：`v-permission` 指令控制按钮/元素显隐
- **状态管理**：
  - 用户信息与权限集存储在 Pinia（全局）
  - 业务列表直接服务端分页（不缓存）
- **上传流程**：先取凭证 → 直传云存储 → 写入草稿（三段式）

### 测试策略

**本期（MVP）测试范围**：

- 主要依赖人工测试与自测
- 自测路径：登录 → 仪表盘 → 视频（列表/新建/审核/发布）→ 直播申请审核 → 志愿者/学院 → 审计
- 关键检查点：
  - 无控制台 error/warn
  - 路由守卫与权限显隐正确
  - 视频链路通畅（上传 → 审核 → 发布 → 下架）
  - 直播申请审核状态变更生效

**质量门槛**：

- `npm run lint` 无错误
- `npm run stylelint` 无错误
- `npm run build` 成功
- 性能：1k 条分页 P95 < 500ms；首屏 P95 < 2.5s

**未来扩展**（非本期）：

- 单元测试（Vitest）
- E2E 测试（Playwright）

### Git 工作流程

**分支策略**：

- **主分支**：`main`
- **功能分支**：`feat/<模块>-<简述>`（如 `feat/video-create`）
- **修复分支**：`fix/<问题>-<简述>`（如 `fix/login-redirect`）
- **其他**：`chore/`、`refactor/`、`perf/`、`docs/` 等按需

**提交信息规范**（Conventional Commits）：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**常用 type**：

- `feat`：新功能
- `fix`：缺陷修复
- `docs`：仅文档改动
- `style`：格式（不影响逻辑）
- `refactor`：重构
- `perf`：性能优化
- `test`：测试相关
- `build`：构建系统/依赖变更
- `chore`：杂项

**示例**：

```bash
git commit -m "feat(video): 新增视频创建页与直传占位"
git commit -m "fix(permission): 修复 v-permission 指令的 ESLint 报错"
```

**PR 流程**：

1. 从 `main` 创建功能分支
2. 开发并自测通过
3. 推送并创建 Pull Request
4. PR 自检清单：
   - [ ] 功能与交互符合需求
   - [ ] 权限与路由守卫正确
   - [ ] 代码通过 ESLint/Stylelint/Prettier
   - [ ] 仅必要改动，无无关格式化
5. 代码评审后使用 `Squash and merge` 合并到 `main`

## 领域上下文

**业务角色**：

- **平台管理员**：全局管理、审核、发布、角色与权限、学院与志愿者管理、审计
- **学院管理员**：本学院的内容与直播申请审核、志愿者管理
- **审核员**：视频与直播申请审核（平台或按学院授权）
- **志愿者**：视频上传与自有内容管理

**核心业务流程**：

1. **视频管理**：
   - 上传：取直传凭证 → 直传微信云存储 → 创建草稿 → 填写元数据
   - 提交审核：草稿/被驳回可提交 → 状态 `in_review`
   - 人工审核：审核员/管理员对单条或批量"通过/驳回"
   - 发布：仅对 `approved` 状态视频可发布 → `published`；可下架 → `unpublished`
   - 删除：志愿者仅能删除本人"草稿/被驳回"的视频

2. **直播申请**：
   - 申请来自 App/小程序（Flutter TRTC/直播 SDK）
   - Web 仅"列表/详情/审核"，不推流/不开播
   - 审核：通过/驳回及意见；用于运营与秩序管理

3. **权限控制（RBAC）**：
   - 原子权限：`video.create`、`video.review`、`live.apply.review`、`role.manage` 等
   - 角色-权限映射在后端配置，前端基于 JWT 中的权限列表动态渲染菜单与按钮

**状态机（视频）**：

```
draft → in_review → approved → published → unpublished
              ↓
          rejected → draft（可修改后再次提交）
```

## 重要约束

**功能范围（MVP）**：

- **本期实现**：
  - 登录/权限路由/菜单，RBAC 生效
  - 仪表盘骨架（计数卡片）
  - 云函数鉴权闭环（JWT）
  - 视频上传至微信云存储、人工审核、发布/下架
  - 直播申请的"列表/详情/审核"
  - 志愿者/学院的基础管理

- **明确不做**：
  - 定时发布、按学院可见范围
  - 回收站
  - 自动审核（机审）
  - 数据报表、国际化、通知、导出
  - 志愿者三方核验、AI 会话与未成年人数据留存
  - Web 端直播控制台/OBS 推流

**安全与合规**：

- JWT 有效期（建议 2h），必要时刷新或重新登录
- HTTPS、参数校验、最小化存储
- 限流：登录失败 N 次触发验证码；上传频率限制
- 审计：登录、审核、发布、下架、角色变更均落审计
- 不存储未成年人敏感数据

**性能要求**：

- 1k 条分页 P95 < 500ms
- 首屏 P95 < 2.5s
- 无 P1 级别错误

## 外部依赖

**微信云开发**：

- **云函数**：HTTP 云函数作为 API 网关，入口格式 `/api/v1/{resource}/{action}`
- **云数据库**：存储用户、视频、直播申请、学院、志愿者、审计日志等数据
- **云存储**：视频文件与封面图的存储服务（直传）

**关键接口约定**：

- **鉴权**：`Authorization: Bearer <jwt>`
- **响应格式**：`{ code: 0, data: ..., msg: "" }`
- **分页参数**：`page`、`pageSize`；排序：`sortBy`、`order`
- **错误码**：
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error
  - 502: Bad Gateway
  - 503: Service Unavailable

**开发期依赖**：

- **Mock 服务**：开发期使用 `VITE_USE_MOCK=true` 启用本地 Mock 数据（位于 `src/services/mock/`）
- **真实接口切换**：设置 `VITE_USE_MOCK=false` 并配置 `VITE_API_BASE` 即可切换到真实云函数

**第三方库**：

- Element Plus：UI 组件库
- Axios：HTTP 客户端
- Day.js：日期处理（Element Plus 依赖）
