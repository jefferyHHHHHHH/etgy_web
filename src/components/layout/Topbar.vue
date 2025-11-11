<template>
  <header class="topbar">
    <!-- 左侧：面包屑 -->
    <div class="topbar__left">
      <Breadcrumb />
    </div>

    <!-- 右侧：用户信息和操作 -->
    <div class="topbar__right">
      <!-- 主题切换 -->
      <el-tooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
        <el-button text circle class="topbar__action" @click="toggleTheme">
          <el-icon size="20">
            <Sunny v-if="isDark" />
            <Moon v-else />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 语言切换（可选） -->
      <el-dropdown trigger="click" @command="handleLanguageChange">
        <el-button text circle class="topbar__action">
          <el-icon size="20"><Operation /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :disabled="locale === 'zh-CN'">
              简体中文
            </el-dropdown-item>
            <el-dropdown-item command="en-US" :disabled="locale === 'en-US'">
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 全屏切换 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button text circle class="topbar__action" @click="toggleFullscreen">
          <el-icon size="20">
            <FullScreen />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 用户菜单 -->
      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="topbar__user">
          <el-avatar :size="32" :src="userAvatar">
            {{ userName.charAt(0) }}
          </el-avatar>
          <span class="topbar__username">{{ userName }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人资料
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Sunny,
  Moon,
  Operation,
  FullScreen,
  CaretBottom,
  User,
  Setting,
  SwitchButton,
} from '@element-plus/icons-vue'
import Breadcrumb from './Breadcrumb.vue'
import { useUserStore } from '@/stores/modules/user'
import { useSettingsStore } from '@/stores/modules/settings'
import { useHotkeys } from '@/composables/useHotkeys'

const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

// 用户信息
const userName = computed(() => userStore.name || '未登录')
const userAvatar = computed(() => userStore.avatar || '')

// 主题
const isDark = computed(() => settingsStore.theme === 'dark')
const locale = computed(() => settingsStore.locale)

// 切换主题
const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  settingsStore.setTheme(newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
  ElMessage.success(`已切换到${newTheme === 'dark' ? '暗色' : '亮色'}模式`)
}

// 切换语言
const handleLanguageChange = (lang: string) => {
  settingsStore.setLocale(lang as 'zh-CN' | 'en-US')
  ElMessage.success('语言已切换')
  // 重新加载页面以应用语言（或使用 i18n 动态切换）
  window.location.reload()
}

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 用户菜单操作
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/settings/profile')
      break
    case 'settings':
      router.push('/settings/system')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}

// 全局搜索占位（Ctrl+K）
const searchOpen = ref(false)
const disposeSearchHotkey = useHotkeys('ctrl+k', e => {
  e.preventDefault()
  searchOpen.value = true
}, { preventDefault: true })
const disposeEsc = useHotkeys('esc', () => {
  if (searchOpen.value) searchOpen.value = false
})
onBeforeUnmount(() => {
  disposeSearchHotkey()
  disposeEsc()
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.topbar {
  height: $topbar-height;
  background-color: var(--topbar-bg);
  border-bottom: 1px solid var(--color-border);
  @include flex-between;
  padding: 0 $spacing-6;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: $z-index-sticky;

  &__left {
    flex: 1;
    min-width: 0;
  }

  &__right {
    @include flex-end;
    gap: $spacing-2;
  }

  &__action {
    width: 40px;
    height: 40px;
    color: var(--color-text-secondary);

    &:hover {
      background-color: var(--color-bg-hover);
    }
  }

  &__user {
    @include flex-center;
    gap: $spacing-2;
    padding: $spacing-2 $spacing-3;
    border-radius: $radius-md;
    cursor: pointer;
    transition: background-color $transition-fast $ease-out;

    &:hover {
      background-color: var(--color-bg-hover);
    }
  }

  &__username {
    font-size: $font-size-sm;
    color: var(--color-text-primary);
    font-weight: $font-weight-medium;

    // 响应式：小屏幕隐藏用户名
    @include respond-below('md') {
      display: none;
    }
  }
}
</style>

<template>
  <header class="topbar">
    <!-- 左侧：面包屑 -->
    <div class="topbar__left">
      <Breadcrumb />
    </div>

    <!-- 右侧：用户信息和操作 -->
    <div class="topbar__right">
      <!-- 主题切换 -->
      <el-tooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
        <el-button text circle class="topbar__action" @click="toggleTheme">
          <el-icon size="20">
            <Sunny v-if="isDark" />
            <Moon v-else />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 语言切换（可选） -->
      <el-dropdown trigger="click" @command="handleLanguageChange">
        <el-button text circle class="topbar__action">
          <el-icon size="20"><Operation /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :disabled="locale === 'zh-CN'">
              简体中文
            </el-dropdown-item>
            <el-dropdown-item command="en-US" :disabled="locale === 'en-US'">
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 全屏切换 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button text circle class="topbar__action" @click="toggleFullscreen">
          <el-icon size="20">
            <FullScreen />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 用户菜单 -->
      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="topbar__user">
          <el-avatar :size="32" :src="userAvatar">
            {{ userName.charAt(0) }}
          </el-avatar>
          <span class="topbar__username">{{ userName }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人资料
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>

  <!-- 全局搜索（占位实现） -->
  <el-dialog v-model="searchOpen" title="全局搜索 (Ctrl+K)" width="520px">
    <el-input placeholder="输入关键词..." autofocus />
    <template #footer>
      <el-button @click="searchOpen = false">关闭 (Esc)</el-button>
      <el-button type="primary" @click="searchOpen = false">搜索</el-button>
    </template>
  </el-dialog>
</template>
