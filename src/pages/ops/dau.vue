<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useOpsStore } from '@/stores/useOpsStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'

const store = useOpsStore()

onMounted(() => {
  if (store.dau === null) {
    store.fetchDau()
  }
})

const summary = computed(() => store.dau?.summary ?? [])
const dauTrend = computed(() => store.dau?.dauTrend ?? [])
const weeklyActive = computed(() => store.dau?.weeklyActive ?? [])
const monthlyActive = computed(() => store.dau?.monthlyActive ?? [])
const moduleDauBreakdown = computed(() => store.dau?.moduleDauBreakdown ?? [])
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
        <h3>DAU 趋势（近30日）</h3>
        <TrendLineChart
          :data="dauTrend"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__charts">
      <div class="page__card">
        <h3>周活跃用户</h3>
        <TrendLineChart
          :data="weeklyActive"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>月活跃用户</h3>
        <TrendLineChart
          :data="monthlyActive"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__card">
      <h3>各功能模块 DAU 拆解</h3>
      <BarCompareChart
        :data="moduleDauBreakdown"
        :loading="store.loading"
        :error="store.error"
      />
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
    margin-bottom: 24px;

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
