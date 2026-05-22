<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import PieDistChart from '@/components/charts/PieDistChart.vue'

const store = useUserStore()

onMounted(() => {
  if (store.examChallenge === null) {
    store.fetchExamChallenge()
  }
})

const summary = computed(() => store.examChallenge?.summary ?? [])
const knowledgeCorrectRate = computed(() => store.examChallenge?.knowledgeCorrectRate ?? [])
const dailyTrend = computed(() => store.examChallenge?.dailyTrend ?? [])
const clearRanking = computed(() => store.examChallenge?.clearRanking ?? [])

/** 按通关率分段统计分布 */
const clearRateDistribution = computed(() => {
  const total = clearRanking.value.length
  if (total === 0) return []
  const full = clearRanking.value.filter((r) => r.clearRate === 1).length
  const half = clearRanking.value.filter((r) => r.clearRate >= 0.5 && r.clearRate < 1).length
  const low = clearRanking.value.filter((r) => r.clearRate < 0.5).length
  return [
    { name: '100%通关', count: full, ratio: full / total },
    { name: '50%~99%通关', count: half, ratio: half / total },
    { name: '低于50%通关', count: low, ratio: low / total },
  ]
})
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
        <h3>答题趋势（近7日）</h3>
        <TrendLineChart
          :data="dailyTrend"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__charts">
      <div class="page__card">
        <h3>知识点正确率</h3>
        <BarCompareChart
          :data="knowledgeCorrectRate"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>通关率分布</h3>
        <PieDistChart
          :data="clearRateDistribution"
          type="ring"
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
