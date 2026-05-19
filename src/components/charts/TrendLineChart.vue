<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ITrendItem } from '@/types'

use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  data: ITrendItem[]
  loading: boolean
  error: string | null
}>()

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: {
    data: props.data[0]?.value2 !== undefined ? ['系列1', '系列2'] : ['系列1'],
    bottom: 0,
    textStyle: { color: '#8896b4' },
  },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category' as const,
    data: props.data.map((d) => d.date),
    axisLine: { lineStyle: { color: '#8896b4' } },
    axisLabel: { color: '#8896b4', fontSize: 11 },
  },
  yAxis: {
    type: 'value' as const,
    splitLine: { lineStyle: { color: 'rgba(136,150,180,0.15)' } },
    axisLabel: { color: '#8896b4', fontSize: 11 },
  },
  series: [
    {
      name: '系列1',
      type: 'line',
      data: props.data.map((d) => d.value),
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { color: '#409eff', width: 2 },
      itemStyle: { color: '#409eff' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(64,158,255,0.2)' },
          { offset: 1, color: 'rgba(64,158,255,0)' },
        ] },
      },
    },
    ...(props.data[0]?.value2 !== undefined ? [{
      name: '系列2',
      type: 'line' as const,
      data: props.data.map((d) => d.value2 ?? 0),
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { color: '#67c23a', width: 2 },
      itemStyle: { color: '#67c23a' },
    }] : []),
  ],
}))
</script>

<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="chart-wrapper__loading">
      <el-skeleton animated :rows="4" />
    </div>
    <div v-else-if="error" class="chart-wrapper__error">
      <span>{{ error }}</span>
      <el-button size="small" type="primary" text>重试</el-button>
    </div>
    <div v-else-if="data.length === 0" class="chart-wrapper__empty">
      <span>暂无数据</span>
    </div>
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
