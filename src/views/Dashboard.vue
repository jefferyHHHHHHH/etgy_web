<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listVideos } from '../services/video'
import { getLiveApplications } from '../services/live'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'

const loading = ref(true)
const pendingVideos = ref(0)
const todayUploads = ref(0)
const pendingLives = ref(0)

// 图表数据
const weeklyTrendData = ref({
  categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    {
      name: '视频上传量',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '直播申请数',
      data: [20, 30, 15, 25, 35, 45, 40]
    }
  ]
})

const categoryData = ref({
  categories: ['教育', '科技', '艺术', '生活', '其他'],
  series: [
    {
      name: '视频数量',
      data: [320, 302, 301, 334, 390]
    }
  ]
})

const statusData = ref([
  { name: '已发布', value: 335 },
  { name: '审核中', value: 310 },
  { name: '草稿', value: 234 },
  { name: '已拒绝', value: 135 }
])

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
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px">
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

      <!-- 图表区域 -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px">
        <el-card>
          <LineChart :title="'本周趋势'" :data="weeklyTrendData" />
        </el-card>
        <el-card>
          <BarChart :title="'分类统计'" :data="categoryData" />
        </el-card>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px">
        <el-card>
          <PieChart :title="'状态分布'" :data="statusData" />
        </el-card>
        <el-card>
          <div style="padding: 20px">
            <h3 style="margin-bottom: 20px">数据概览</h3>
            <el-table :data="[
              { metric: '总视频数', value: '1,647', change: '+12.5%' },
              { metric: '活跃用户', value: '892', change: '+8.3%' },
              { metric: '平均观看时长', value: '4m 32s', change: '+2.1%' },
              { metric: '互动率', value: '68%', change: '+5.7%' }
            ]" stripe>
              <el-table-column prop="metric" label="指标" />
              <el-table-column prop="value" label="数值" />
              <el-table-column prop="change" label="变化">
                <template #default="scope">
                  <span :style="{ color: scope.row.change.startsWith('+') ? '#67C23A' : '#F56C6C' }">
                    {{ scope.row.change }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </el-skeleton>
  </div>
</template>
