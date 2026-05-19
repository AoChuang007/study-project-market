<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useOpsStore } from '@/stores/useOpsStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import FunnelChart from '@/components/charts/FunnelChart.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'

const store = useOpsStore()

onMounted(() => {
  if (store.conversion === null) {
    store.fetchConversion()
  }
})

const summary = computed(() => store.conversion?.summary ?? [])
const funnelStages = computed(() => store.conversion?.funnelStages ?? [])
const bySubjectConversion = computed(() => store.conversion?.bySubjectConversion ?? [])
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
      <div class="page__card">
        <h3>AI 功能转化漏斗</h3>
        <FunnelChart
          :data="funnelStages"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>分学科转化率</h3>
        <BarCompareChart
          :data="bySubjectConversion"
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
  }

  &__card {
    background: $light-bg-secondary;
    border-radius: $border-radius-md;
    padding: 20px;
    border: 1px solid $light-border;

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: $light-text-primary;
      margin: 0 0 16px;
    }
  }
}
</style>
