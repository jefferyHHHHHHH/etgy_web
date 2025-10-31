<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getLiveApplications, reviewLiveApplication } from '../../services/live'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const status = ref('')

async function fetch() {
  loading.value = true
  try {
    const res = await getLiveApplications({
      page: page.value,
      pageSize: pageSize.value,
      status: status.value || undefined,
    })
    list.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

onMounted(fetch)
watch([page, pageSize], fetch)

async function onApprove(row: any) {
  await reviewLiveApplication({ id: row.id, result: 'approved' })
  ElMessage.success('已通过')
  fetch()
}
async function onReject(row: any) {
  const reason = await ElMessageBox.prompt('请输入驳回理由', '驳回申请', {
    inputPlaceholder: '可选',
  })
    .then(r => r.value)
    .catch(() => null)
  if (reason === null) return
  await reviewLiveApplication({ id: row.id, result: 'rejected', reason })
  ElMessage.success('已驳回')
  fetch()
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div>直播申请</div>
        <div>
          <el-select
            v-model="status"
            placeholder="状态筛选"
            clearable
            style="width: 160px"
            @change="
              () => {
                page = 1
                fetch()
              }
            "
          >
            <el-option label="待审" value="pending" />
            <el-option label="通过" value="approved" />
            <el-option label="驳回" value="rejected" />
          </el-select>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="subject" label="主题" min-width="240" />
      <el-table-column prop="startTime" label="时间" width="220">
        <template #default="{ row }"
          >{{ new Date(row.startTime).toLocaleString() }} -
          {{ new Date(row.endTime).toLocaleTimeString() }}</template
        >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }"
          ><el-tag type="info">{{ row.status }}</el-tag></template
        >
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="success"
            @click="onApprove(row)"
            >通过</el-button
          >
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="danger"
            plain
            @click="onReject(row)"
            >驳回</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 12px">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </el-card>
</template>
