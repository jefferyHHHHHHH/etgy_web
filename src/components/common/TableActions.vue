<template>
  <div class="table-actions">
    <!-- 主要操作按钮 -->
    <div class="table-actions__primary">
      <slot name="primary" />
    </div>

    <!-- 次要操作按钮 -->
    <div
      v-if="$slots.secondary || showRefresh || showDensity || showColumns"
      class="table-actions__secondary"
    >
      <slot name="secondary" />

      <!-- 刷新按钮 -->
      <el-tooltip v-if="showRefresh" content="刷新" placement="top">
        <el-button text circle :icon="RefreshRight" @click="handleRefresh" />
      </el-tooltip>

      <!-- 密度切换 -->
      <el-dropdown v-if="showDensity" trigger="click" @command="handleDensityChange">
        <el-tooltip content="密度" placement="top">
          <el-button text circle :icon="Operation" />
        </el-tooltip>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="large" :disabled="density === 'large'">
              宽松
            </el-dropdown-item>
            <el-dropdown-item command="default" :disabled="density === 'default'">
              默认
            </el-dropdown-item>
            <el-dropdown-item command="small" :disabled="density === 'small'">
              紧凑
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 列设置 -->
      <el-popover v-if="showColumns" placement="bottom-end" :width="200" trigger="click">
        <template #reference>
          <el-tooltip content="列设置" placement="top">
            <el-button text circle :icon="Setting" />
          </el-tooltip>
        </template>
        <div class="table-actions__columns">
          <el-checkbox-group v-model="visibleColumns" @change="handleColumnsChange">
            <div v-for="col in columns" :key="col.prop" class="table-actions__column-item">
              <el-checkbox :label="col.prop" :disabled="col.required">
                {{ col.label }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RefreshRight, Operation, Setting } from '@element-plus/icons-vue'

export interface TableColumn {
  prop: string
  label: string
  required?: boolean
}

type DensityType = 'large' | 'default' | 'small'

interface Props {
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示密度切换 */
  showDensity?: boolean
  /** 是否显示列设置 */
  showColumns?: boolean
  /** 表格列配置（用于列设置） */
  columns?: TableColumn[]
  /** 默认显示的列 */
  defaultVisibleColumns?: string[]
  /** 默认密度 */
  defaultDensity?: DensityType
}

interface Emits {
  (e: 'refresh'): void
  (e: 'density-change', density: DensityType): void
  (e: 'columns-change', visibleColumns: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  showRefresh: true,
  showDensity: false,
  showColumns: false,
  columns: () => [],
  defaultVisibleColumns: () => [],
  defaultDensity: 'default',
})

const emit = defineEmits<Emits>()

// 密度
const density = ref<DensityType>(props.defaultDensity)

// 可见列
const visibleColumns = ref<string[]>([])

// 初始化可见列
watch(
  () => props.columns,
  newColumns => {
    if (props.defaultVisibleColumns.length > 0) {
      visibleColumns.value = props.defaultVisibleColumns
    } else {
      visibleColumns.value = newColumns.map(col => col.prop)
    }
  },
  { immediate: true }
)

// 刷新
const handleRefresh = () => {
  emit('refresh')
}

// 密度切换
const handleDensityChange = (value: DensityType) => {
  density.value = value
  emit('density-change', value)
}

// 列设置变化
const handleColumnsChange = (value: string[]) => {
  emit('columns-change', value)
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.table-actions {
  @include flex-between;
  gap: $spacing-3;
  margin-bottom: $spacing-4;
  padding: $spacing-3 0;

  &__primary {
    @include flex-start;
    gap: $spacing-2;
    flex: 1;
    min-width: 0;

    // 响应式：小屏幕按钮全宽
    @include respond-below('md') {
      flex-direction: column;
      width: 100%;

      :deep(.el-button) {
        width: 100%;
      }
    }
  }

  &__secondary {
    @include flex-end;
    gap: $spacing-1;
    flex-shrink: 0;
  }

  &__columns {
    max-height: 300px;
    overflow-y: auto;
  }

  &__column-item {
    padding: $spacing-2 0;
    border-bottom: 1px solid var(--color-border-light);

    &:last-child {
      border-bottom: none;
    }

    :deep(.el-checkbox) {
      width: 100%;

      .el-checkbox__label {
        flex: 1;
      }
    }
  }

  // 响应式：小屏幕垂直布局
  @include respond-below('md') {
    flex-direction: column;
    align-items: stretch;

    &__secondary {
      justify-content: flex-start;
    }
  }
}
</style>
