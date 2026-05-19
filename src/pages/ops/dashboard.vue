<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useOpsStore } from '@/stores/useOpsStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import PieDistChart from '@/components/charts/PieDistChart.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'

const store = useOpsStore()

onMounted(() => {
  if (store.dashboard === null) {
    store.fetchDashboard()
  }
})

const summary = computed(() => store.dashboard?.summary ?? [])
const dauMauTrend = computed(() => store.dashboard?.dauMauTrend ?? [])
const userTypeRatio = computed(() => store.dashboard?.userTypeRatio ?? [])
const hourlyActive = computed(() => store.dashboard?.hourlyActive ?? [])
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
      <div class="page__card page__card--wide">
        <h3>DAU / MAU 趋势</h3>
        <TrendLineChart
          :data="dauMauTrend"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__charts">
      <div class="page__card">
        <h3>用户类型占比</h3>
        <PieDistChart
          :data="userTypeRatio"
          type="ring"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>用户活跃时段分布</h3>
        <BarCompareChart
          :data="hourlyActive"
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
  }

  &__card {
    background: $light-bg-secondary;
    border-radius: $border-radius-md;
    padding: 20px;
    border: 1px solid $light-border;

    &--wide { grid-column: 1 / -1; }

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: $light-text-primary;
      margin: 0 0 16px;
    }
  }
}
</style>
