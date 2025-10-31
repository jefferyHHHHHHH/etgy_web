<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listColleges, upsertCollege } from '../../services/college'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const list = ref<any[]>([])
const dialog = ref(false)
const form = ref({ id: '', name: '', status: 'active' })

async function fetch() {
  loading.value = true
  try {
    list.value = await listColleges()
  } finally {
    loading.value = false
  }
}
onMounted(fetch)

function openEdit(row?: any) {
  form.value = row ? { ...row } : { id: '', name: '', status: 'active' }
  dialog.value = true
}

async function onSave() {
  await upsertCollege(form.value)
  ElMessage.success('已保存')
  dialog.value = false
  fetch()
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <span>学院管理</span>
        <el-button type="primary" @click="() => openEdit()">新增学院</el-button>
      </div>
    </template>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="name" label="学院名称" min-width="220" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button link type="primary" @click="() => openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialog" title="学院信息" width="420px">
    <el-form label-width="84px">
      <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="状态"><el-input v-model="form.status" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog = false">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </template>
  </el-dialog>
</template>
