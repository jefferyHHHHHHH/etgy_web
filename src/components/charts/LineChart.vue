<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart as LineChartModule } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

// 注册必需的组件
use([
  CanvasRenderer,
  LineChartModule,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

interface Props {
  title?: string
  data?: {
    categories: string[]
    series: {
      name: string
      data: number[]
    }[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: '趋势图',
  data: () => ({
    categories: [],
    series: [],
  }),
})

const option = ref({})

const updateChart = () => {
  option.value = {
    title: {
      text: props.title,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.categories,
    },
    yAxis: {
      type: 'value',
    },
    series: props.data.series.map(item => ({
      name: item.name,
      type: 'line',
      smooth: true,
      data: item.data,
    })),
  }
}

onMounted(() => {
  updateChart()
})

watch(() => props.data, updateChart, { deep: true })
</script>

<template>
  <v-chart :option="option" style="height: 300px" />
</template>
