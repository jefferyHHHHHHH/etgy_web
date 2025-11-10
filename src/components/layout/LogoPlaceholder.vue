<template>
  <div class="logo-placeholder" :class="{ 'logo-placeholder--collapsed': collapsed }">
    <!-- Logo 图标 -->
    <div class="logo-placeholder__icon">
      <img src="@/assets/logo.jpg" alt="益路同行" class="logo-placeholder__image" />
    </div>

    <!-- Logo 文字（折叠时隐藏） -->
    <transition name="logo-text">
      <div v-if="!collapsed" class="logo-placeholder__text">
        <h1 class="logo-placeholder__title">益路同行</h1>
        <p class="logo-placeholder__subtitle">管理后台</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  collapsed?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.logo-placeholder {
  @include flex-start;
  gap: $spacing-3;
  width: 100%;
  transition: all $transition-base $ease-out;

  &__icon {
    @include flex-center;
    width: 40px;
    height: 40px;
    border-radius: $radius-lg;
    background: white;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: var(--color-text-primary);
    line-height: $line-height-tight;
    margin: 0;
    @include text-ellipsis(1);
  }

  &__subtitle {
    font-size: $font-size-xs;
    color: var(--color-text-tertiary);
    line-height: $line-height-tight;
    margin: 2px 0 0 0;
    @include text-ellipsis(1);
  }

  // 折叠状态
  &--collapsed {
    justify-content: center;

    .logo-placeholder__icon {
      margin: 0;
    }
  }
}

// Logo 文字过渡动画
.logo-text-enter-active,
.logo-text-leave-active {
  transition: all $transition-base $ease-out;
}

.logo-text-enter-from,
.logo-text-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
