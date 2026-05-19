<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { HeatmapChart as EChartsHeatmap } from 'echarts/charts'
import { TooltipComponent, VisualMapComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { IHeatmapItem } from '@/types'

use([EChartsHeatmap, TooltipComponent, VisualMapComponent, GridComponent, CanvasRenderer])

const props = defineProps<{
  data: IHeatmapItem[]
  loading: boolean
  error: string | null
}>()

const xLabels = computed(() => [...new Set(props.data.map((d) => String(d.hour)))])
const yLabels = computed(() => [...new Set(props.data.map((d) => d.day))])

const option = computed(() => ({
  tooltip: { position: 'top' as const },
  grid: { left: '10%', right: '5%', bottom: '15%', top: '5%' },
  xAxis: {
    type: 'category' as const,
    data: xLabels.value,
    splitArea: { show: true },
    axisLabel: { color: '#8896b4', fontSize: 10 },
  },
  yAxis: {
    type: 'category' as const,
    data: yLabels.value,
    splitArea: { show: true },
    axisLabel: { color: '#8896b4', fontSize: 10 },
  },
  visualMap: {
    min: 0,
    max: Math.max(...props.data.map((d) => d.value)),
    calculable: true,
    orient: 'horizontal' as const,
    left: 'center',
    bottom: 0,
    inRange: { color: ['#e0f3ff', '#409eff', '#003d8f'] },
  },
  series: [{
    type: 'heatmap',
    data: props.data.map((d) => [String(d.hour), d.day, d.value]),
    label: { show: false },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
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
  height: 320px;
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
