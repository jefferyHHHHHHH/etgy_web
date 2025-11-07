<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 侧边栏 -->
    <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />

    <!-- 主内容区 -->
    <div class="app-layout__main">
      <!-- 顶部栏 -->
      <Topbar />

      <!-- 页面内容区 -->
      <main class="app-layout__content">
        <router-view v-slot="{ Component, route }">
          <transition name="view-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 从 localStorage 恢复侧边栏状态
onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  if (saved !== null) {
    sidebarCollapsed.value = saved === 'true'
  }
})

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value))
}

// 响应式：小屏幕自动折叠侧边栏
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)')

  const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
      // 小屏幕自动折叠
      sidebarCollapsed.value = true
    }
  }

  // 初始检查
  handleMediaChange(mediaQuery)

  // 监听变化
  mediaQuery.addEventListener('change', handleMediaChange)
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg-page);
  transition: all $transition-base $ease-out;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: $sidebar-width-expanded;
    transition: margin-left $transition-base $ease-out;
    min-width: 0; // 防止 flex 子元素溢出
  }

  &__content {
    flex: 1;
    padding: $spacing-6;
    overflow-y: auto;
    @include scrollbar(8px, transparent, var(--color-gray-300));

    // 限制最大宽度（可选）
    max-width: $content-max-width;
    margin: 0 auto;
    width: 100%;
  }

  // 折叠状态
  &.sidebar-collapsed {
    .app-layout__main {
      margin-left: $sidebar-width-collapsed;
    }
  }

  // 响应式：小屏幕
  @include respond-below('md') {
    .app-layout__main {
      margin-left: 0;
    }
  }
}

// 暗色主题滚动条
[data-theme='dark'] {
  .app-layout__content {
    @include scrollbar(8px, transparent, var(--color-gray-600));
  }
}

// 页面过渡动画（从 global.scss 移到这里以确保作用域）
.view-fade-enter-active,
.view-fade-leave-active {
  transition:
    opacity $transition-base $ease-out,
    transform $transition-base $ease-out;
}

.view-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.view-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
