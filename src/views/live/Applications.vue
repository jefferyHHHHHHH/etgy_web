<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getLiveApplications, reviewLiveApplication } from '../../services/live'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageContainer from '../../components/common/PageContainer.vue'
import SearchForm from '../../components/common/SearchForm.vue'
import StatusTag from '../../components/common/StatusTag.vue'
import TableActions from '../../components/common/TableActions.vue'

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const q = ref({ status: '' })

async function fetch() {
  loading.value = true
  try {
    const res = await getLiveApplications({
      page: page.value,
      pageSize: pageSize.value,
      status: q.value.status || undefined,
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
  <PageContainer title="直播申请">
    <SearchForm v-model="q" :label-width="80" @search="() => { page = 1; fetch() }">
      <template #default="{ formData }">
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="formData.status" placeholder="全部" clearable>
              <el-option label="待审" value="pending" />
              <el-option label="通过" value="approved" />
              <el-option label="驳回" value="rejected" />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </SearchForm>

    <TableActions @refresh="fetch" />

    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="subject" label="主题" min-width="240" />
      <el-table-column prop="startTime" label="时间" width="220">
        <template #default="{ row }"
          >{{ new Date(row.startTime).toLocaleString() }} -
          {{ new Date(row.endTime).toLocaleTimeString() }}</template
        >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <StatusTag :status="row.status" />
        </template>
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
  </PageContainer>
</template>
