<template>
  <ElCard class="flex h-96 flex-col" body-class="flex-1 flex flex-col">
    <div ref="chartElementRef" class="flex-1"></div>
  </ElCard>
</template>

<script setup lang="ts">
import type { EChartsOption } from '@/helpers/AppCharts'
import { useAppStore } from '@/stores'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'
import echarts from '@/helpers/AppCharts'
import { githubService } from '@/services/GithubService'
import type { XAXisOption } from 'echarts/types/dist/shared.js'

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
  legend: {
    left: 'center'
  },
  title: {
    left: 'left',
    text: 'Commits'
  },
  grid: {
    top: '17%',
    left: '2%',
    bottom: '18%',
    right: 20
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  // toolbox: {
  //   show: true,
  //   feature: {
  //     saveAsImage: {}
  //   }
  // },
  yAxis: [
    {
      name: '总量',
      type: 'value',
      position: 'left'
    }
    // {
    //   name: '日期',
    //   type: 'value',
    //   position: 'right',
    //   axisLabel: {
    //     formatter: '{value} 以来'
    //   }
    // }
  ],
  series: [
    {
      name: '总量',
      type: 'bar',
      encode: {
        tooltip: ['count', 'date']
      }
    }
    // {
    //   name: '日期',
    //   type: 'line',
    //   smooth: true,
    //   yAxisIndex: 1,
    //   encode: {
    //     y: 'date'
    //   }
    // }
  ]
}

githubService.getVuejsCommitsStat().then((data) => {
  chartObj.hideLoading()

  setChartData(data)
})

onMounted(() => {
  if (!chartObj || chartObj.isDisposed()) {
    chartObj = echarts.init(chartElementRef.value!, theme)
    chartObj.showLoading()
  }
})

onUnmounted(() => {
  chartObj?.dispose()
})

function setChartData(data: Record<string, any>[]) {
  chartOption.dataset = {
    dimensions: ['name', 'count', 'date'],
    source: data
  }

  const xAxis: XAXisOption = {
    type: 'category',
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: (value) => {
        return value % 2 !== 0
      },
      formatter: function (value, index) {
        return `{key${index}| }\n{value| ${value}}`
      },
      margin: 10,
      rich: {
        value: {
          lineHeight: 20
        }
      }
    }
  }

  data.forEach((item, index) => {
    xAxis.axisLabel!.rich!['key' + index] = {
      height: 30,
      align: 'center',
      backgroundColor: {
        image: item.avatarUrl
      }
    }
  })

  chartOption.xAxis = xAxis

  chartObj.setOption(chartOption)
}
</script>
