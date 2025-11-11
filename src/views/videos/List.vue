<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { listVideos, publishVideo, unpublishVideo } from '../../services/video'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const data = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const q = ref({ keyword: '', status: '' })

const statuses = [
  { label: '草稿', value: 'draft' },
  { label: '待审', value: 'in_review' },
  { label: '通过', value: 'approved' },
  { label: '驳回', value: 'rejected' },
  { label: '已发布', value: 'published' },
  { label: '已下架', value: 'unpublished' },
]

async function fetch() {
  loading.value = true
  try {
    const res = await listVideos({
      page: page.value,
      pageSize: pageSize.value,
      status: q.value.status || undefined,
      keyword: q.value.keyword || undefined,
    })
    data.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  fetch()
}

onMounted(fetch)
watch([page, pageSize], fetch)

function statusTagType(s: string) {
  switch (s) {
    case 'draft':
      return 'info'
    case 'in_review':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'published':
      return 'success'
    case 'unpublished':
      return 'info'
  }
  return 'info'
}

async function onPublish(row: any) {
  await publishVideo({ videoId: row.id })
  ElMessage.success('已发布')
  fetch()
}

async function onUnpublish(row: any) {
  await unpublishVideo({ videoId: row.id })
  ElMessage.success('已下架')
  fetch()
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="q.keyword"
            placeholder="标题关键词"
            clearable
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="q.status" clearable placeholder="全部">
            <el-option v-for="s in statuses" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 12px">
      <template #header>
        <div style="display: flex; align-items: center; justify-content: space-between">
          <span>视频列表</span>
          <RouterLink to="/videos/new"><el-button type="primary">新建视频</el-button></RouterLink>
        </div>
      </template>
      <el-table v-loading="loading" :data="data" stripe>
        <el-table-column prop="title" label="标题" min-width="220" />
        <el-table-column prop="duration" label="时长(s)" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" effect="plain">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button link type="primary">详情</el-button>
            <el-button link>编辑</el-button>
            <el-button v-if="row.status === 'approved'" link type="success" @click="onPublish(row)"
              >发布</el-button
            >
            <el-button
              v-if="row.status === 'published'"
              link
              type="warning"
              @click="onUnpublish(row)"
              >下架</el-button
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
  </div>
</template>
