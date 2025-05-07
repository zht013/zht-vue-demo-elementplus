<template>
  <ElCard class="flex h-48 flex-1 basis-60 flex-col" body-class="flex-1 flex flex-col">
    <div class="flex items-center text-lg font-medium">
      {{ name }}
      <ElIcon class="ml-auto !text-2xl" :style="{ color: color }">
        <component :is="icon" />
      </ElIcon>
    </div>
    <div class="flex flex-1 items-stretch">
      <p class="flex shrink-0 basis-16 flex-col justify-center text-xl font-bold">
        <span>Total</span>
        {{ totalCount }}
      </p>
      <div ref="chartElementRef" class="flex-1"></div>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import type { EChartsOption } from '@/helpers/AppCharts'
import type { FunctionalComponent } from 'vue'
import echarts from '@/helpers/AppCharts'
import { useAppStore } from '@/stores'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

const props = defineProps<{
  name: string
  totalCount: number
  icon: string | FunctionalComponent
  color: string
  data: Record<string, any>[] | undefined
}>()

const { theme } = useAppStore()
const chartElementRef = ref<HTMLDivElement>()
let chartObj: echarts.ECharts
const debounceResize = useDebounceFn(() => {
  chartObj?.resize()
}, 500)

useResizeObserver(chartElementRef, () => {
  debounceResize()
})

const chartOption: EChartsOption = {
  grid: {
    top: '5%',
    left: 0,
    bottom: 0,
    right: 0
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    show: false,
    type: 'category'
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      name: '总数',
      type: 'line',
      symbol: 'none',
      smooth: true,
      color: props.color,
      tooltip: {}
    }
  ]
}

watch(
  () => props.data,
  async () => {
    chartObj?.hideLoading()

    await nextTick()

    setChartData()
  }
)

onMounted(() => {
  if (!chartObj || chartObj.isDisposed()) {
    chartObj = echarts.init(chartElementRef.value!, theme)
  }

  if (!props.data) {
    chartObj.showLoading()
  } else {
    setChartData()
  }
})

onUnmounted(() => {
  chartObj?.dispose()
})

function setChartData() {
  chartOption.dataset = {
    dimensions: ['date', 'count'],
    source: props.data
  }

  chartObj.setOption(chartOption)
}
</script>
