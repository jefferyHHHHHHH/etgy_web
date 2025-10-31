import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { public: true, title: '登录' },
  },
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '仪表盘', requiresAuth: true, perms: ['menu.view:*'] },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/live/applications',
    name: 'live-applications',
    component: () => import('../views/live/Applications.vue'),
    meta: { title: '直播申请', requiresAuth: true, perms: ['live.apply.viewAll'] },
  },
  {
    path: '/volunteers',
    name: 'volunteers',
    component: () => import('../views/volunteers/List.vue'),
    meta: { title: '志愿者', requiresAuth: true, perms: ['volunteer.view'] },
  },
  {
    path: '/settings/colleges',
    name: 'settings-colleges',
    component: () => import('../views/settings/Colleges.vue'),
    meta: { title: '学院管理', requiresAuth: true, perms: ['college.manage'] },
  },
  {
    path: '/audit',
    name: 'audit',
    component: () => import('../views/audit/List.vue'),
    meta: { title: '审计日志', requiresAuth: true, perms: ['audit.view'] },
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('../views/videos/List.vue'),
    meta: { title: '视频管理', requiresAuth: true, perms: ['video.viewAll'] },
  },
  {
    path: '/videos/new',
    name: 'video-create',
    component: () => import('../views/videos/Create.vue'),
    meta: { title: '新建视频', requiresAuth: true, perms: ['video.create'] },
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: () => import('../views/videos/Reviews.vue'),
    meta: { title: '审核队列', requiresAuth: true, perms: ['video.review'] },
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('../views/User.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'User', perms: ['menu.view:*'] },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: { template: '<div style="padding:16px;">页面不存在</div>' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  try {
    const { useUserStore } = await import('../stores/modules/user')
    const { pinia } = await import('../stores')
    const { notify } = await import('../utils/notify')
    const { usePermsStore } = await import('../stores/modules/perms')
    const user = useUserStore(pinia)
    if (to.meta?.public) return next()
    if (to.meta?.requiresAuth && !user.isAuthenticated) {
      notify.warning('请先登录')
      return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    const need = (to.meta?.perms as string[] | undefined) || []
    if (need.length > 0) {
      const perms = usePermsStore(pinia)
      const ok = need.some(p => perms.has(p))
      if (!ok) {
        notify.warning('无权限访问该页面')
        return next('/')
      }
    }
  } catch {}

  const title = (to.meta?.title as string) || String(to.name || '')
  if (title) document.title = `${import.meta.env.VITE_APP_TITLE} - ${title}`
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
