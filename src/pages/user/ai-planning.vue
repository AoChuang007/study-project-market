<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import PieDistChart from '@/components/charts/PieDistChart.vue'
import HeatmapChart from '@/components/charts/HeatmapChart.vue'

const store = useUserStore()

onMounted(() => {
  if (store.aiPlanning === null) {
    store.fetchAIPlanning()
  }
})

const summary = computed(() => store.aiPlanning?.summary ?? [])
const monthlyTrend = computed(() => store.aiPlanning?.monthlyTrend ?? [])
const subjectDistribution = computed(() => store.aiPlanning?.subjectDistribution ?? [])
const scenarioDistribution = computed(() => store.aiPlanning?.scenarioDistribution ?? [])
const hourlyHeatmap = computed(() => store.aiPlanning?.hourlyHeatmap ?? [])
</script>

<template>
  <div class="page">
    <div class="page__metrics">
      <MetricsCard
        v-for="(card, i) in summary"
        :key="i"
        v-bind="card"
        :loading="store.loading"
        :error="store.error"
      />
    </div>

    <div class="page__charts">
      <div class="page__card page__card--full">
        <h3>月度使用趋势</h3>
        <TrendLineChart
          :data="monthlyTrend"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__charts page__charts--two">
      <div class="page__card">
        <h3>学科分布</h3>
        <PieDistChart
          :data="subjectDistribution"
          type="ring"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>使用场景分布</h3>
        <PieDistChart
          :data="scenarioDistribution"
          type="pie"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__charts">
      <div class="page__card page__card--full">
        <h3>使用时段热力图</h3>
        <HeatmapChart
          :data="hourlyHeatmap"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &__metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  &__charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;

    &--two { grid-template-columns: 1fr 1fr; }
  }

  &__card {
    background: $light-bg-secondary;
    border-radius: $border-radius-md;
    padding: 20px;
    border: 1px solid $light-border;

    &--full { grid-column: 1 / -1; }

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: $light-text-primary;
      margin: 0 0 16px;
    }
  }
}
</style>
