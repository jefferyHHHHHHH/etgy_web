<template>
  <el-tag :type="tagType" :effect="effect" :size="size" :round="round" class="status-tag">
    <el-icon v-if="icon" class="status-tag__icon">
      <component :is="icon" />
    </el-icon>
    <span>{{ label }}</span>
  </el-tag>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  SuccessFilled,
  WarningFilled,
  CircleCloseFilled,
  InfoFilled,
  Clock,
} from '@element-plus/icons-vue'

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'default'

interface Props {
  /** 状态值 */
  status: string | number
  /** 状态标签映射 */
  statusMap?: Record<string | number, { label: string; type: StatusType; icon?: Component }>
  /** Element Plus Tag 类型 */
  type?: StatusType
  /** 标签文本 */
  label?: string
  /** 图标组件 */
  icon?: Component
  /** 效果：dark, light, plain */
  effect?: 'dark' | 'light' | 'plain'
  /** 尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 圆角 */
  round?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  effect: 'light',
  size: 'default',
  round: true,
})

// 默认状态映射（常见业务场景）
const defaultStatusMap: Record<
  string | number,
  { label: string; type: StatusType; icon?: Component }
> = {
  // 审核状态
  pending: { label: '待审核', type: 'warning', icon: Clock },
  approved: { label: '已通过', type: 'success', icon: SuccessFilled },
  rejected: { label: '已拒绝', type: 'danger', icon: CircleCloseFilled },

  // 发布状态
  draft: { label: '草稿', type: 'info', icon: InfoFilled },
  published: { label: '已发布', type: 'success', icon: SuccessFilled },
  offline: { label: '已下线', type: 'default', icon: CircleCloseFilled },

  // 通用状态
  active: { label: '启用', type: 'success' },
  inactive: { label: '禁用', type: 'danger' },

  // 数字状态 (0-2)
  0: { label: '待处理', type: 'warning' },
  1: { label: '进行中', type: 'primary' },
  2: { label: '已完成', type: 'success' },
}

// 合并用户自定义映射和默认映射
const finalStatusMap = computed(() => {
  return { ...defaultStatusMap, ...props.statusMap }
})

// 获取当前状态配置
const statusConfig = computed(() => {
  return (
    finalStatusMap.value[props.status] || {
      label: String(props.status),
      type: 'default' as StatusType,
    }
  )
})

// 标签类型
const tagType = computed(() => {
  return props.type || statusConfig.value.type
})

// 标签文本
const label = computed(() => {
  return props.label || statusConfig.value.label
})

// 图标
const icon = computed(() => {
  return props.icon || statusConfig.value.icon
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: $font-weight-medium;

  &__icon {
    font-size: 14px;
  }
}
</style>
