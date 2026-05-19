<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { IDistributionItem } from '@/types'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  data: IDistributionItem[]
  loading: boolean
  error: string | null
}>()

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
  xAxis: {
    type: 'category' as const,
    data: props.data.map((d) => d.name),
    axisLabel: { color: '#8896b4', fontSize: 11, rotate: props.data.length > 6 ? 30 : 0 },
  },
  yAxis: {
    type: 'value' as const,
    splitLine: { lineStyle: { color: 'rgba(136,150,180,0.15)' } },
    axisLabel: { color: '#8896b4', fontSize: 11 },
  },
  series: [{
    type: 'bar',
    data: props.data.map((d) => d.count),
    barWidth: '50%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#409eff' },
          { offset: 1, color: '#79bbff' },
        ],
      },
    },
  }],
}))
</script>

<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="chart-wrapper__loading"><el-skeleton animated :rows="4" /></div>
    <div v-else-if="error" class="chart-wrapper__error"><span>{{ error }}</span></div>
    <div v-else-if="data.length === 0" class="chart-wrapper__empty"><span>暂无数据</span></div>
    <v-chart v-else class="chart-wrapper__chart" :option="option" autoresize />
  </div>
</template>

<style lang="scss" scoped>
.chart-wrapper {
  width: 100%;
  height: 300px;
  position: relative;

  &__chart { width: 100%; height: 100%; }
  &__loading, &__error, &__empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $light-text-secondary;
    gap: 8px;
  }
}
</style>
