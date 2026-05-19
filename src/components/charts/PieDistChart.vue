<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { IDistributionItem } from '@/types'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  data: IDistributionItem[]
  type: 'pie' | 'ring'
  loading: boolean
  error: string | null
}>()

const option = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, textStyle: { color: '#8896b4', fontSize: 11 } },
  series: [{
    type: 'pie',
    radius: props.type === 'ring' ? ['40%', '70%'] : ['0%', '65%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: { label: { show: true, fontWeight: 'bold' } },
    data: props.data.map((d) => ({ name: d.name, value: d.count })),
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
