<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listVolunteers, upsertVolunteer } from '../../services/volunteer'
import { ElMessage } from 'element-plus'
import PageContainer from '../../components/common/PageContainer.vue'
import SearchForm from '../../components/common/SearchForm.vue'
import TableActions from '../../components/common/TableActions.vue'

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const q = ref({ keyword: '' })

const dialog = ref(false)
const form = ref({ uid: '', name: '', phone: '', collegeId: 'c_001', status: 'active' })

async function fetch() {
  loading.value = true
  try {
    const res = await listVolunteers({ page: page.value, pageSize: pageSize.value })
    list.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}
onMounted(fetch)

function openEdit(row?: any) {
  form.value = row
    ? { ...row }
    : { uid: '', name: '', phone: '', collegeId: 'c_001', status: 'active' }
  dialog.value = true
}

async function onSave() {
  await upsertVolunteer(form.value)
  ElMessage.success('已保存')
  dialog.value = false
  fetch()
}
</script>

<template>
  <PageContainer title="志愿者管理">
    <SearchForm v-model="q" @search="() => { page = 1; fetch() }">
      <template #default="{ formData }">
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="formData.keyword" placeholder="姓名/电话" clearable @keyup.enter="$emit('search', formData)" />
          </el-form-item>
        </el-col>
      </template>
      <template #actions>
        <el-button type="primary" @click="() => openEdit()">新增</el-button>
      </template>
    </SearchForm>

    <TableActions @refresh="fetch" />

    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="头像" width="80">
        <template #default="{ row }">
          <el-avatar :size="32">{{ row.name?.charAt(0) || '志' }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" min-width="160" />
      <el-table-column prop="phone" label="电话" width="160" />
      <el-table-column prop="collegeId" label="学院" width="160" />
      <el-table-column prop="createdAt" label="创建时间" width="200">
        <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button link type="primary" @click="() => openEdit(row)">编辑</el-button>
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

    <el-dialog v-model="dialog" title="志愿者信息" width="420px">
      <el-form label-width="84px">
        <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="学院"><el-input v-model="form.collegeId" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>
