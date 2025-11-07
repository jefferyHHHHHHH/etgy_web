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
        :collapse-transition="false"
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
          <el-menu-item index="/videos/create">上传视频</el-menu-item>
        </el-sub-menu>

        <!-- 审核工作台 -->
        <el-menu-item index="/review">
          <el-icon><DocumentChecked /></el-icon>
          <template #title>审核工作台</template>
        </el-menu-item>

        <!-- 用户管理 -->
        <el-sub-menu index="users">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/users">用户列表</el-menu-item>
          <el-menu-item index="/users/roles">角色权限</el-menu-item>
        </el-sub-menu>

        <!-- 系统设置 -->
        <el-sub-menu index="settings">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/settings/profile">个人资料</el-menu-item>
          <el-menu-item index="/settings/system">系统配置</el-menu-item>
        </el-sub-menu>
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
  Setting,
  DArrowLeft,
  DArrowRight,
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
  if (path.startsWith('/videos')) return path
  if (path.startsWith('/users')) return path
  if (path.startsWith('/settings')) return path
  if (path.startsWith('/dashboard')) return '/dashboard'
  if (path.startsWith('/review')) return '/review'
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
  transition: width $transition-base $ease-out;
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
      transition: all $transition-fast $ease-out;

      &:hover {
        background-color: var(--color-bg-hover);
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
    transition: all $transition-fast $ease-out;
    flex-shrink: 0;

    &:hover {
      background-color: var(--color-bg-hover);
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
