<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listVideos } from '../services/video'
import { getLiveApplications } from '../services/live'

const loading = ref(true)
const pendingVideos = ref(0)
const todayUploads = ref(0)
const pendingLives = ref(0)

onMounted(async () => {
  try {
    loading.value = true
    const v = await listVideos({ status: 'in_review', page: 1, pageSize: 1 })
    pendingVideos.value = v.total || 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const uploads = await listVideos({ page: 1, pageSize: 1 })
    // Mock 下以一半占比演示
    todayUploads.value = Math.floor((uploads.total || 0) / 2)
    const l = await getLiveApplications({ status: 'pending', page: 1, pageSize: 1 })
    pendingLives.value = l.total || 0
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <el-skeleton :loading="loading" animated :rows="3">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px">
        <el-card shadow="hover">
          <div style="font-size: 12px; color: #666">待审视频</div>
          <div style="font-size: 28px; font-weight: 600; margin-top: 6px">{{ pendingVideos }}</div>
        </el-card>
        <el-card shadow="hover">
          <div style="font-size: 12px; color: #666">今日上传</div>
          <div style="font-size: 28px; font-weight: 600; margin-top: 6px">{{ todayUploads }}</div>
        </el-card>
        <el-card shadow="hover">
          <div style="font-size: 12px; color: #666">待审直播申请</div>
          <div style="font-size: 28px; font-weight: 600; margin-top: 6px">{{ pendingLives }}</div>
        </el-card>
      </div>
    </el-skeleton>
  </div>
</template>
