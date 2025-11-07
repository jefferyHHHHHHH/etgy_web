<template>
  <div class="page-container" :class="{ 'page-container--no-padding': noPadding }">
    <!-- 页面头部 -->
    <header v-if="title || $slots.header" class="page-container__header">
      <slot name="header">
        <div class="page-container__title-wrapper">
          <h2 class="page-container__title">{{ title }}</h2>
          <p v-if="description" class="page-container__description">
            {{ description }}
          </p>
        </div>
        <div v-if="$slots.extra" class="page-container__extra">
          <slot name="extra" />
        </div>
      </slot>
    </header>

    <!-- 页面内容 -->
    <div class="page-container__content">
      <slot />
    </div>

    <!-- 页面底部（可选） -->
    <footer v-if="$slots.footer" class="page-container__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** 页面标题 */
  title?: string
  /** 页面描述 */
  description?: string
  /** 是否移除内边距 */
  noPadding?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.page-container {
  background-color: var(--color-bg-container);
  border-radius: $radius-lg;
  box-shadow: var(--shadow-sm);
  overflow: hidden;

  &__header {
    @include flex-between;
    gap: $spacing-4;
    padding: $spacing-5 $spacing-6;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg-container);

    // 响应式：小屏幕垂直布局
    @include respond-below('md') {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__title-wrapper {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    margin: 0;
    line-height: $line-height-tight;
  }

  &__description {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    margin: $spacing-1 0 0 0;
    line-height: $line-height-normal;
  }

  &__extra {
    flex-shrink: 0;

    // 响应式：小屏幕全宽
    @include respond-below('md') {
      width: 100%;
    }
  }

  &__content {
    padding: $spacing-6;
    min-height: 200px;
  }

  &__footer {
    padding: $spacing-4 $spacing-6;
    border-top: 1px solid var(--color-border);
    background-color: var(--color-bg-hover);
  }

  // 无内边距模式（用于需要完全自定义布局的场景）
  &--no-padding {
    .page-container__content {
      padding: 0;
    }
  }
}
</style>
