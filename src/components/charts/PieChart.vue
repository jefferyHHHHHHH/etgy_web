<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  PieChart as PieChartModule
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'

// 注册必需的组件
use([
  CanvasRenderer,
  PieChartModule,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

interface Props {
  title?: string
  data?: {
    name: string
    value: number
  }[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '饼图',
  data: () => []
})

const option = ref({})

const updateChart = () => {
  option.value = {
    title: {
      text: props.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: '50%',
        data: props.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
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