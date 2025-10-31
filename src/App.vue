<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from './stores/modules/user'
const appTitle = import.meta.env.VITE_APP_TITLE
const router = useRouter()
const user = useUserStore() as any
const isAuthed = computed(() => user.isAuthenticated)
async function onLogout() {
  await user.logout()
  router.replace('/login')
}
</script>

<template>
  <header
    style="
      padding: 12px;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    "
  >
    <strong style="font-size: 18px">{{ appTitle }}</strong>
    <nav style="display: flex; gap: 12px">
      <RouterLink to="/dashboard">仪表盘</RouterLink>
      <RouterLink to="/videos">视频</RouterLink>
      <RouterLink to="/reviews">审核</RouterLink>
      <RouterLink to="/live/applications">直播申请</RouterLink>
      <RouterLink to="/volunteers">志愿者</RouterLink>
      <RouterLink to="/settings/colleges">学院管理</RouterLink>
      <RouterLink to="/about">关于</RouterLink>
      <RouterLink to="/user/42">用户</RouterLink>
    </nav>
    <div>
      <template v-if="isAuthed">
        <el-button size="small" type="primary" @click="onLogout">退出登录</el-button>
      </template>
      <template v-else>
        <RouterLink to="/login">登录</RouterLink>
      </template>
    </div>
  </header>
  <main style="padding: 16px">
    <RouterView v-slot="{ Component }">
      <transition name="view-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>
