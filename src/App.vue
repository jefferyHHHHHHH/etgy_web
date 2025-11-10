<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { AppLayout } from './components/layout'

const route = useRoute()

// 不需要布局的页面（登录页等）
const noLayoutPages = ['/login', '/404']
const needsLayout = computed(() => {
  return !noLayoutPages.includes(route.path)
})
</script>

<template>
  <!-- 需要布局的页面使用 AppLayout -->
  <AppLayout v-if="needsLayout">
    <RouterView />
  </AppLayout>

  <!-- 不需要布局的页面直接渲染 -->
  <RouterView v-else />
</template>
