<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listVideos, reviewVideo } from '../../services/video'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const data = ref<any[]>([])

async function fetch() {
  loading.value = true
  try {
    const res = await listVideos({ status: 'in_review', page: 1, pageSize: 50 })
    data.value = res.items
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
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <span>审核队列</span>
        <el-button :loading="loading" @click="fetch">刷新</el-button>
      </div>
    </template>
    <el-empty v-if="!loading && data.length === 0" description="暂无待审视频" />
    <el-table v-else v-loading="loading" :data="data" stripe>
      <el-table-column prop="title" label="标题" min-width="240" />
      <el-table-column prop="createdAt" label="提交时间" width="200">
        <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="onApprove(row)">通过</el-button>
          <el-button type="danger" size="small" plain @click="onReject(row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
