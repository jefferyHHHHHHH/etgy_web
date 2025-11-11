<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { listVideos, reviewVideo } from '../../services/video'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageContainer from '../../components/common/PageContainer.vue'

const loading = ref(false)
const data = ref<any[]>([])
const selected = ref<any | null>(null)

async function fetch() {
  loading.value = true
  try {
    const res = await listVideos({ status: 'in_review', page: 1, pageSize: 50 })
    data.value = res.items
    if (!selected.value && data.value.length > 0) {
      selected.value = data.value[0]
    }
  } finally {
    loading.value = false
  }
}

async function onApprove(row: any) {
  await reviewVideo({ videoId: row.id, result: 'approved' })
  ElMessage.success('已通过')
  fetch()
}

async function onReject(row: any) {
  const reason = await ElMessageBox.prompt('请输入驳回理由', '驳回视频', {
    inputPlaceholder: '可选',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(r => r.value)
    .catch(() => null)
  if (reason === null) return
  await reviewVideo({ videoId: row.id, result: 'rejected', reason })
  ElMessage.success('已驳回')
  fetch()
}

onMounted(fetch)

const hasData = computed(() => (data.value?.length || 0) > 0)
const selection = ref<any[]>([])

function onSelectionChange(rows: any[]) {
  selection.value = rows
}

async function onBatchApprove() {
  if (selection.value.length === 0) return ElMessage.info('请先选择列表项')
  await Promise.all(selection.value.map(r => reviewVideo({ videoId: r.id, result: 'approved' })))
  ElMessage.success('已批量通过')
  fetch()
}

async function onBatchReject() {
  if (selection.value.length === 0) return ElMessage.info('请先选择列表项')
  const reason = await ElMessageBox.prompt('请输入批量驳回理由', '批量驳回', {
    inputPlaceholder: '可选',
  })
    .then(r => r.value)
    .catch(() => null)
  if (reason === null) return
  await Promise.all(
    selection.value.map(r => reviewVideo({ videoId: r.id, result: 'rejected', reason }))
  )
  ElMessage.success('已批量驳回')
  fetch()
}
</script>

<template>
  <PageContainer title="审核工作台" description="左侧列表，右侧详情与操作">
    <div class="reviews-layout">
      <!-- 左侧列表 -->
      <div class="reviews-layout__left">
        <el-card shadow="never">
          <template #header>
            <div class="flex-between">
              <span>待审列表</span>
              <div style="display: flex; gap: 8px">
                <el-button :loading="loading" @click="fetch">刷新</el-button>
                <el-button type="success" plain @click="onBatchApprove">批量通过</el-button>
                <el-button type="danger" plain @click="onBatchReject">批量驳回</el-button>
              </div>
            </div>
          </template>
          <el-empty v-if="!loading && data.length === 0" description="暂无待审视频" />
          <el-table
            v-else
            v-loading="loading"
            :data="data"
            stripe
            highlight-current-row
            :current-row="selected"
            @selection-change="onSelectionChange"
            @current-change="row => (selected = row)"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="title" label="标题" min-width="240" />
            <el-table-column prop="createdAt" label="提交时间" width="200">
              <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 右侧详情 -->
      <div class="reviews-layout__right">
        <el-card shadow="never">
          <template #header>视频详情</template>
          <el-empty v-if="!hasData" description="请选择左侧列表中的视频" />
          <div v-else class="detail">
            <h3 class="detail__title">{{ selected?.title }}</h3>
            <div class="detail__meta">
              <span>提交时间：{{ new Date(selected?.createdAt).toLocaleString() }}</span>
              <span>时长：{{ selected?.duration }}s</span>
            </div>
            <div class="detail__actions">
              <el-button type="success" @click="onApprove(selected!)">通过</el-button>
              <el-button type="danger" plain @click="onReject(selected!)">驳回</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reviews-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: $spacing-4;

  &__left,
  &__right {
    min-height: 480px;
  }
}

.detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    color: var(--color-text-primary);
  }
  &__meta {
    display: flex;
    gap: $spacing-6;
    color: var(--color-text-secondary);
  }
  &__actions {
    display: flex;
    gap: $spacing-2;
  }
}
</style>
