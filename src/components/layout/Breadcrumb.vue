<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
        <span v-if="index === breadcrumbList.length - 1" class="breadcrumb__current">
          {{ item.meta.title || item.name }}
        </span>
        <router-link v-else :to="item.path" class="breadcrumb__link">
          {{ item.meta.title || item.name }}
        </router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteLocationMatched } from 'vue-router'

const route = useRoute()

// 生成面包屑列表
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => {
    // 过滤掉没有 title 的路由
    return item.meta && item.meta.title
  }) as RouteLocationMatched[]

  // 添加首页
  const first = matched[0]
  if (!first || first.path !== '/dashboard') {
    matched.unshift({
      path: '/dashboard',
      name: 'Dashboard',
      meta: { title: '首页' },
    } as RouteLocationMatched)
  }

  return matched
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.breadcrumb {
  font-size: $font-size-sm;

  &__link {
    color: var(--color-text-secondary);
    transition: color $transition-fast $ease-out;
    font-weight: $font-weight-normal;

    &:hover {
      color: var(--color-primary);
    }
  }

  &__current {
    color: var(--color-text-primary);
    font-weight: $font-weight-medium;
  }

  // 面包屑过渡动画
  :deep(.breadcrumb-move),
  :deep(.breadcrumb-enter-active),
  :deep(.breadcrumb-leave-active) {
    transition: all $transition-fast $ease-out;
  }

  :deep(.breadcrumb-enter-from) {
    opacity: 0;
    transform: translateX(-10px);
  }

  :deep(.breadcrumb-leave-to) {
    opacity: 0;
    transform: translateX(10px);
  }

  :deep(.breadcrumb-leave-active) {
    position: absolute;
  }
}
</style>
