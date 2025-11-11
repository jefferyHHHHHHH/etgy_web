<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { createVideo } from '../../services/video'
import { useHotkeys } from '../../composables/useHotkeys'

const form = ref({
  title: '',
  desc: '',
  tags: [] as string[],
  coverUrl: '',
  mediaUrls: { origin: '' },
  duration: 0,
  gradeRange: '',
  collegeId: 'c_001',
})
const submitting = ref(false)

async function onMockUpload(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  // 模拟上传：仅生成云路径占位
  form.value.mediaUrls.origin = `cloud://mock/${Date.now()}_${f.name}`
  ElMessage.success('已模拟上传')
}

async function onSubmit() {
  if (!form.value.title) return ElMessage.warning('请填写标题')
  if (!form.value.mediaUrls.origin) return ElMessage.warning('请先上传视频')
  submitting.value = true
  try {
    await createVideo(form.value)
    ElMessage.success('创建草稿成功')
  } finally {
    submitting.value = false
  }
}

// 快捷键：Ctrl+S 保存
const disposeHotkey = useHotkeys('ctrl+s', () => onSubmit(), { preventDefault: true })
onBeforeUnmount(() => disposeHotkey())
</script>

<template>
  <el-card shadow="never">
    <el-form label-width="92px" @submit.prevent>
      <el-form-item label="标题">
        <el-input v-model="form.title" maxlength="80" show-word-limit />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.desc" type="textarea" :rows="3" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="视频文件">
        <input type="file" accept="video/*" @change="onMockUpload" />
        <span v-if="form.mediaUrls.origin" style="margin-left: 8px; color: #16a34a">{{
          form.mediaUrls.origin
        }}</span>
      </el-form-item>
      <el-form-item label="时长(秒)">
        <el-input-number v-model="form.duration" :min="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitting" @click="onSubmit">保存草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
