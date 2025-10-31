# 管理端（Vue3 + TS + Vite）提交代码完整流程（中文）

本项目为“儿童公益项目”管理端（MVP），前端使用 Vue3 + TypeScript + Vite，UI 使用 Element Plus，服务层支持 Mock/真实接口可切换。

—— 本文面向日常开发与提交流程，包含分支、提交信息规范、校验与 PR 合并等关键步骤 ——

## 1. 环境准备

- Node.js：建议 ≥ 18
- 包管理器：npm / pnpm / yarn 任一（示例使用 npm）
- Git：建议开启 LF 规范与用户级别 name/email

初始化依赖：

```bash
npm i
npm run prepare # 安装 husky 钩子（若已安装可跳过）
```

## 2. 运行与构建

- 启动开发（默认启用 Mock，便于前端先行开发）

```bash
# Windows PowerShell
$env:VITE_USE_MOCK="true"; npm run dev

# macOS/Linux
VITE_USE_MOCK=true npm run dev
```

- 构建与本地预览：

```bash
npm run build
npm run preview
```

常用环境变量（创建 `./.env.local` 持久化）：

```ini
VITE_APP_TITLE=Vite Vue App
VITE_API_BASE=https://your-api.example.com/api/v1
VITE_API_TIMEOUT=15000
# 前端自测/演示用，默认 dev 下为 true，可显式覆盖
VITE_USE_MOCK=true
```

## 3. 目录结构（摘录）

```
src/
  router/            # 路由与守卫
  stores/            # Pinia 状态（user/perms 等）
  services/          # 服务层（真实接口 + mock/ 下的模拟实现）
  views/             # 页面（登录/仪表盘/视频/审核/直播/志愿者/学院/审计）
  components/        # 可复用组件与指令（v-permission）
  plugins/           # 第三方插件挂载（element、i18n 等）
  utils/             # http 拦截器/notify 等
```

## 4. 代码规范与校验

- 代码风格：ESLint + Prettier
- 样式规范：Stylelint
- 提交前自动修复：lint-staged（由 Husky pre-commit 触发）

手动校验：

```bash
npm run lint       # ESLint
npm run stylelint  # Stylelint
npm run format     # Prettier 格式化
```

## 5. 分支策略

- 主分支：`main`
- 功能分支：`feat/<模块>-<简述>`（如：`feat/video-create`）
- 修复分支：`fix/<问题>-<简述>`（如：`fix/login-redirect`）
- 其他：`chore/`、`refactor/`、`perf/`、`docs/` 等按需

创建分支：

```bash
git checkout -b feat/video-create
```

## 6. 开发与自测建议

1. 启动 dev，确认 `VITE_USE_MOCK=true`，优先把页面功能跑通；
2. 自测路径：登录 → 仪表盘 → 视频（列表/新建/审核/发布）→ 直播申请（审核）→ 志愿者/学院 → 审计；
3. 保证无控制台 error，路由守卫与权限显隐正确；
4. 运行 `lint`、`stylelint`、`build` 确保无错误；
5. 若新增服务，先在 `src/services/mock/*` 写好模拟返回，再切换真实接口。

## 7. 提交信息规范（Conventional Commits）

格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

常用 `type`：

- feat：新功能
- fix：缺陷修复
- docs：仅文档改动
- style：格式（不影响逻辑）
- refactor：重构（非修复/非新功能）
- perf：性能优化
- test：测试相关
- build：构建系统/依赖变更
- ci：CI 配置变更
- chore：杂项（不影响 src 或测试）
- revert：回滚

示例：

```
feat(video): 新增视频创建页与直传占位

说明了表单验证、Mock 数据结构与路由注册

Closes #123
```

> 项目已集成 Husky + lint-staged + commitlint：
>
> - `npm run prepare` 会安装 Git hooks；
> - 提交前自动执行 ESLint/Stylelint/Prettier；
> - 不符合规范将被拦截，按提示修复后再提交。

### 提交样例（PowerShell）

请确保使用“半角冒号 :”且“冒号后有一个空格”。以下命令可直接复制使用：

```powershell
# 新功能
git commit -m "feat: 初始化管理端基础页面"

# 新功能（带作用域）
git commit -m "feat(core): 接入 Mock 服务并完成路由守卫"

# 缺陷修复
git commit -m "fix(permission): 修复 v-permission 指令的 ESLint 报错"

# 文档/杂项
git commit -m "docs: 补充 README 提交流程"
git commit -m "chore: 更新依赖与脚本"

# 本地测试 commitlint（检验一条消息是否合规）
echo "feat: 初始化管理端基础页面" | npx commitlint
```

常见失败与修复：

- 错误：`subject-empty` / `type-empty`
  - 原因：使用了全角冒号（：）或冒号后无空格，导致 commitlint 解析不到头部。
  - 解决：改用半角冒号“:”，并在冒号后加一个空格，例如：`feat: 初始化管理端基础页面`。

## 8. 完整提交流程（从开发到合并）

1. 拉新分支并开发：

```bash
git checkout -b feat/video-create
# 开发... 自测通过
npm run lint && npm run stylelint && npm run build
```

2. 添加与提交：

```bash
git add .
git commit -m "feat(video): 新增视频创建页与直传占位"
```

3. 推送与创建 PR：

```bash
git push -u origin feat/video-create
# 在远端仓库创建 Pull Request，选择合并到 main
```

4. PR 自检清单：

- [ ] 页面功能与交互符合需求；
- [ ] 权限与路由守卫正确；
- [ ] 控制台无 error/warn；
- [ ] 代码通过 ESLint/Stylelint/Prettier；
- [ ] 仅必要改动，无无关格式化；

5. 代码评审与合并：

- 建议使用 `Squash and merge`，保持提交历史清晰；
- 合并后可根据情况删除功能分支。

## 9. Mock 与真实接口切换

- 开发期推荐：`VITE_USE_MOCK=true`（默认 dev 下已自动开启，可在 `.env.local` 显式设置）
- 对接后端：`VITE_USE_MOCK=false` 并配置 `VITE_API_BASE`，服务层将走真实 HTTP 云函数

## 10. 常见问题（FAQ）

1. 进入页面显示 Network Error？
   - 检查是否未启用 Mock：设置 `VITE_USE_MOCK=true` 或完善真实接口；
2. 提交时报错或钩子未执行？
   - 执行 `npm run prepare` 安装 husky；Windows 使用 Git Bash/PowerShell 均可；
3. 路由过渡警告（<router-view> inside <transition>）？
   - 本项目已改用 slot 写法：`<RouterView v-slot="{ Component }"><transition>...</transition></RouterView>`；
4. axios ESM 导出报错？
   - 已按 `import axios from 'axios'; import type {...} from 'axios'` 方式修复；确保本地依赖完整安装。

## 11. 版本与发布（可选）

```bash
git tag v0.1.0 -m "MVP 首版"
git push origin v0.1.0
```

---

如需补充“接口对接说明/字段与错误码清单”，见 `src/services/*` 与 `src/services/mock/*`，可在切换真实接口后逐步完善。
