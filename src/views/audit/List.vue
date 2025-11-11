<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listAudits } from '../../services/audit'
import PageContainer from '../../components/common/PageContainer.vue'
import SearchForm from '../../components/common/SearchForm.vue'

const loading = ref(false)
const items = ref<any[]>([])
const q = ref<{ range: [Date | null, Date | null] | null }>({ range: null })

async function fetch() {
  loading.value = true
  try {
    const [start, end] = q.value.range || []
    const res = await listAudits({
      page: 1,
      pageSize: 50,
      startTime: start ? start.toISOString() : undefined,
      endTime: end ? end.toISOString() : undefined,
    } as any)
    items.value = res.items
  } finally {
    loading.value = false
  }
}
onMounted(fetch)
</script>

<template>
  <PageContainer title="审计日志">
    <SearchForm v-model="q" @search="fetch">
      <template #default="{ formData }">
        <el-col :span="12">
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="formData.range"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="x"
              unlink-panels
            />
          </el-form-item>
        </el-col>
      </template>
    </SearchForm>
    <el-table v-loading="loading" :data="items" stripe>
      <el-table-column prop="action" label="动作" width="200" />
      <el-table-column prop="target" label="对象" min-width="240">
        <template #default="{ row }">{{ row.target.type }}: {{ row.target.id }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="时间" width="200">
        <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
      </el-table-column>
    </el-table>
  </PageContainer>
</template>
