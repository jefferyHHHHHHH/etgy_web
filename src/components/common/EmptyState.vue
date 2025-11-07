<template>
  <div class="empty-state" :class="`empty-state--${size}`">
    <!-- 图标/插图 -->
    <div class="empty-state__icon">
      <slot name="icon">
        <el-icon :size="iconSize">
          <component :is="defaultIcon" />
        </el-icon>
      </slot>
    </div>

    <!-- 描述文本 -->
    <div class="empty-state__content">
      <p class="empty-state__description">
        <slot>{{ description }}</slot>
      </p>

      <!-- 操作按钮 -->
      <div v-if="$slots.actions || actionText" class="empty-state__actions">
        <slot name="actions">
          <el-button v-if="actionText" type="primary" @click="handleAction">
            {{ actionText }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Document, FolderOpened, Search, Connection, WarningFilled } from '@element-plus/icons-vue'

type EmptyType = 'noData' | 'noResult' | 'error' | 'network' | 'custom'
type SizeType = 'large' | 'default' | 'small'

interface Props {
  /** 空状态类型 */
  type?: EmptyType
  /** 描述文本 */
  description?: string
  /** 操作按钮文本 */
  actionText?: string
  /** 自定义图标组件 */
  icon?: Component
  /** 尺寸 */
  size?: SizeType
}

interface Emits {
  (e: 'action'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'noData',
  description: '',
  size: 'default',
})

const emit = defineEmits<Emits>()

// 默认图标映射
const iconMap: Record<EmptyType, Component> = {
  noData: Document,
  noResult: Search,
  error: WarningFilled,
  network: Connection,
  custom: FolderOpened,
}

// 默认描述映射
const descriptionMap: Record<EmptyType, string> = {
  noData: '暂无数据',
  noResult: '未找到相关内容',
  error: '加载失败，请稍后重试',
  network: '网络连接失败',
  custom: '',
}

// 图标尺寸映射
const iconSizeMap: Record<SizeType, number> = {
  large: 120,
  default: 80,
  small: 60,
}

// 当前图标
const defaultIcon = computed(() => {
  return props.icon || iconMap[props.type]
})

// 当前描述
const description = computed(() => {
  return props.description || descriptionMap[props.type]
})

// 图标尺寸
const iconSize = computed(() => {
  return iconSizeMap[props.size]
})

// 操作按钮点击
const handleAction = () => {
  emit('action')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.empty-state {
  @include flex-center;
  flex-direction: column;
  padding: $spacing-12 $spacing-6;
  text-align: center;

  &__icon {
    margin-bottom: $spacing-4;
    color: var(--color-text-tertiary);
    opacity: 0.6;

    :deep(.el-icon) {
      display: block;
    }
  }

  &__content {
    max-width: 400px;
  }

  &__description {
    font-size: $font-size-base;
    color: var(--color-text-secondary);
    margin: 0 0 $spacing-4 0;
    line-height: $line-height-relaxed;
  }

  &__actions {
    @include flex-center;
    gap: $spacing-2;

    // 响应式：小屏幕按钮全宽
    @include respond-below('md') {
      flex-direction: column;
      width: 100%;

      :deep(.el-button) {
        width: 100%;
      }
    }
  }

  // 尺寸变体
  &--large {
    padding: $spacing-16 $spacing-6;

    .empty-state__description {
      font-size: $font-size-lg;
    }
  }

  &--small {
    padding: $spacing-8 $spacing-4;

    .empty-state__description {
      font-size: $font-size-sm;
    }
  }
}
</style>
