<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <!-- Logo 区域 -->
    <div class="sidebar__logo">
      <LogoPlaceholder :collapsed="collapsed" />
    </div>

    <!-- 导航菜单 -->
    <el-scrollbar class="sidebar__scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :collapse-transition="true"
        :unique-opened="true"
        mode="vertical"
        class="sidebar__menu"
        @select="handleMenuSelect"
      >
        <!-- 首页/仪表盘 -->
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>

        <!-- 视频管理 -->
        <el-sub-menu index="videos">
          <template #title>
            <el-icon><VideoCamera /></el-icon>
            <span>视频管理</span>
          </template>
          <el-menu-item index="/videos">视频列表</el-menu-item>
          <el-menu-item index="/videos/new">上传视频</el-menu-item>
          <el-menu-item index="/reviews">审核队列</el-menu-item>
        </el-sub-menu>

        <!-- 直播管理 -->
        <el-sub-menu index="live">
          <template #title>
            <el-icon><VideoCamera /></el-icon>
            <span>直播管理</span>
          </template>
          <el-menu-item index="/live/applications">直播申请</el-menu-item>
        </el-sub-menu>

        <!-- 志愿者管理 -->
        <el-menu-item index="/volunteers">
          <el-icon><User /></el-icon>
          <template #title>志愿者管理</template>
        </el-menu-item>

        <!-- 系统设置 -->
        <el-sub-menu index="settings">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/settings/colleges">学院管理</el-menu-item>
          <el-menu-item index="/audit">审计日志</el-menu-item>
        </el-sub-menu>

        <!-- 其他 -->
        <el-menu-item index="/about">
          <el-icon><Document /></el-icon>
          <template #title>关于</template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮 -->
    <div class="sidebar__toggle" @click="handleToggle">
      <el-icon>
        <DArrowLeft v-if="!collapsed" />
        <DArrowRight v-else />
      </el-icon>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataBoard,
  VideoCamera,
  DocumentChecked,
  User,
  Tools,
  DArrowLeft,
  DArrowRight,
  Document,
} from '@element-plus/icons-vue'
import LogoPlaceholder from './LogoPlaceholder.vue'

interface Props {
  collapsed: boolean
}

interface Emits {
  (e: 'toggle'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const route = useRoute()
const router = useRouter()

// 当前激活的菜单项
const activeMenu = computed(() => {
  const path = route.path
  // 匹配当前路由到菜单项
  if (path === '/') return '/dashboard'
  if (path.startsWith('/dashboard')) return '/dashboard'
  if (path.startsWith('/videos')) return path
  if (path.startsWith('/reviews')) return '/reviews'
  if (path.startsWith('/live')) return path
  if (path.startsWith('/volunteers')) return '/volunteers'
  if (path.startsWith('/settings')) return path
  if (path.startsWith('/audit')) return '/audit'
  if (path.startsWith('/about')) return '/about'
  return path
})

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  router.push(index)
}

// 切换折叠状态
const handleToggle = () => {
  emit('toggle')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: $sidebar-width-expanded;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  // 展开收起动画
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  // 使用 GPU 加速
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: width;
  z-index: $z-index-fixed;
  overflow: hidden;

  &__logo {
    height: $topbar-height;
    display: flex;
    align-items: center;
    padding: 0 $spacing-4;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  &__scrollbar {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
  }

  &__menu {
    border-right: none;
    background-color: transparent;

    .el-menu-item,
    .el-sub-menu__title {
      height: 48px;
      line-height: 48px;
      // 优化：只过渡背景色，减少计算量
      transition: background-color 100ms cubic-bezier(0.4, 0, 0.2, 1);
      // 使用 will-change 优化，但限制在 hover 时才激活
      transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-font-smoothing: antialiased;

      &:hover {
        background-color: var(--color-bg-hover);
        will-change: background-color;
      }

      // 鼠标离开时清除 will-change
      &:not(:hover) {
        will-change: auto;
      }

      &.is-active {
        background-color: var(--color-primary);
        color: white;

        .el-icon {
          color: white;
        }
      }
    }

    .el-sub-menu {
      .el-menu-item {
        &.is-active {
          background-color: var(--color-primary-light);
        }
      }
    }
  }

  &__toggle {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--color-border);
    cursor: pointer;
    // 优化：快速响应的过渡
    transition: background-color 100ms cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    // GPU 加速
    transform: translateZ(0);
    backface-visibility: hidden;

    &:hover {
      background-color: var(--color-bg-hover);
      will-change: background-color;
    }

    &:not(:hover) {
      will-change: auto;
    }

    .el-icon {
      font-size: 18px;
      color: var(--color-text-secondary);
    }
  }

  // 折叠状态
  &--collapsed {
    width: $sidebar-width-collapsed;

    .sidebar__logo {
      justify-content: center;
    }
  }

  // 响应式：小屏幕（抽屉模式）
  @include respond-below('md') {
    transform: translateX(-100%);
    box-shadow: var(--shadow-xl);

    &:not(.sidebar--collapsed) {
      transform: translateX(0);
    }
  }
}
</style>
