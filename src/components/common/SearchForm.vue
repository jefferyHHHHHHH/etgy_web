<template>
  <div class="search-form" :class="{ 'search-form--collapsed': collapsed && collapsible }">
    <el-form
      ref="formRef"
      :model="formData"
      :label-width="labelWidth"
      :label-position="labelPosition"
      class="search-form__form"
    >
      <el-row :gutter="16">
        <!-- 表单项插槽 -->
        <slot :form-data="formData" :collapsed="collapsed" />
      </el-row>

      <!-- 操作按钮 -->
      <el-row>
        <el-col :span="24" class="search-form__actions">
          <el-button type="primary" :icon="Search" @click="handleSearch"> 搜索 </el-button>
          <el-button :icon="RefreshLeft" @click="handleReset"> 重置 </el-button>
          <el-button
            v-if="collapsible"
            text
            :icon="collapsed ? ArrowDown : ArrowUp"
            @click="toggleCollapse"
          >
            {{ collapsed ? '展开' : '收起' }}
          </el-button>
          <slot name="actions" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { Search, RefreshLeft, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

interface Props {
  /** 表单数据（v-model） */
  modelValue: Record<string, any>
  /** 表单标签宽度 */
  labelWidth?: string | number
  /** 表单标签位置 */
  labelPosition?: 'left' | 'right' | 'top'
  /** 是否可折叠 */
  collapsible?: boolean
  /** 默认是否折叠 */
  defaultCollapsed?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'search', value: Record<string, any>): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  labelWidth: '80px',
  labelPosition: 'right',
  collapsible: false,
  defaultCollapsed: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const collapsed = ref(props.defaultCollapsed)

// 表单数据（双向绑定）
const formData = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// 搜索
const handleSearch = () => {
  emit('search', formData.value)
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
  // 重置后自动搜索
  emit('search', formData.value)
}

// 切换折叠
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.search-form {
  padding: $spacing-4 $spacing-5;
  background-color: var(--color-bg-container);
  border-radius: $radius-lg;
  margin-bottom: $spacing-4;
  box-shadow: var(--shadow-sm);

  &__form {
    :deep(.el-form-item) {
      margin-bottom: $spacing-4;
    }

    :deep(.el-row:last-child) {
      margin-bottom: 0;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-2;

    // 响应式：小屏幕按钮全宽
    @include respond-below('md') {
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }
  }

  // 折叠状态
  &--collapsed {
    .search-form__form {
      :deep(.el-row:first-child) {
        .el-col:nth-child(n + 4) {
          display: none;
        }
      }
    }

    // 响应式：小屏幕只显示前 2 个
    @include respond-below('md') {
      .search-form__form {
        :deep(.el-row:first-child) {
          .el-col:nth-child(n + 3) {
            display: none;
          }
        }
      }
    }
  }
}
</style>
