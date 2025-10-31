<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listAudits } from '../../services/audit'

const loading = ref(false)
const items = ref<any[]>([])

async function fetch() {
  loading.value = true
  try {
    const res = await listAudits({ page: 1, pageSize: 50 })
    items.value = res.items
  } finally {
    loading.value = false
  }
}
onMounted(fetch)
</script>

<template>
  <el-card shadow="never">
    <template #header>审计日志</template>
    <el-table v-loading="loading" :data="items" stripe>
      <el-table-column prop="action" label="动作" width="200" />
      <el-table-column prop="target" label="对象" min-width="240">
        <template #default="{ row }">{{ row.target.type }}: {{ row.target.id }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="时间" width="200">
        <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
