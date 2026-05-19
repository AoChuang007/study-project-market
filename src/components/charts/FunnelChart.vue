<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { FunnelChart as EChartsFunnel } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { IDistributionItem } from '@/types'

use([EChartsFunnel, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  data: IDistributionItem[]
  loading: boolean
  error: string | null
}>()

const option = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [{
    type: 'funnel',
    left: '15%',
    right: '15%',
    top: 20,
    bottom: 40,
    width: '70%',
    sort: 'descending' as const,
    gap: 2,
    label: { show: true, position: 'inside' as const, fontSize: 13, color: '#fff' },
    labelLine: { show: false },
    itemStyle: { borderRadius: 2 },
    data: props.data.map((d, i) => ({
      name: d.name,
      value: d.count,
      itemStyle: { color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'][i] ?? '#409eff' },
    })),
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
