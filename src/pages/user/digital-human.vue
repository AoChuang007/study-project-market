<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import PieDistChart from '@/components/charts/PieDistChart.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'

const store = useUserStore()

onMounted(() => {
  if (store.digitalHuman === null) {
    store.fetchDigitalHuman()
  }
})

const summary = computed(() => store.digitalHuman?.summary ?? [])
const sessionTrend = computed(() => store.digitalHuman?.sessionTrend ?? [])
const topicDistribution = computed(() => store.digitalHuman?.topicDistribution ?? [])
const emotionRadar = computed(() => store.digitalHuman?.emotionRadar ?? [])
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
        <h3>会话趋势（近14日）</h3>
        <TrendLineChart
          :data="sessionTrend"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__charts">
      <div class="page__card">
        <h3>话题分布</h3>
        <PieDistChart
          :data="topicDistribution"
          type="ring"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>情感分析</h3>
        <BarCompareChart
          :data="emotionRadar"
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
