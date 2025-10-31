import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('../views/User.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'User' },
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
  try {
    const { useUserStore } = await import('../stores/modules/user')
    const { pinia } = await import('../stores')
    const { notify } = await import('../utils/notify')
    const user = useUserStore(pinia)
    if (to.meta?.requiresAuth && !user.isAuthenticated) {
      notify.warning('请先登录')
      return next('/')
    }
  } catch {}

  const title = (to.meta?.title as string) || String(to.name || '')
  if (title) document.title = `${import.meta.env.VITE_APP_TITLE} - ${title}`
  next()
})

export default router
