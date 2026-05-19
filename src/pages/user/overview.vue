<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'
import DateRangePicker from '@/components/filters/DateRangePicker.vue'
import GradeSelect from '@/components/filters/GradeSelect.vue'
import SubjectSelect from '@/components/filters/SubjectSelect.vue'
import { useFilter } from '@/composables/useFilter'
import { ref } from 'vue'

const store = useUserStore()

const filters = ref({ dateRange: '7d', grade: '', subject: '' })

useFilter(filters, () => {
  store.fetchOverview()
})

onMounted(() => {
  if (store.overview === null) {
    store.fetchOverview()
  }
})

const summary = computed(() => store.overview?.summary ?? [])
const weeklyTrend = computed(() => store.overview?.weeklyTrend ?? [])
const subjectDistribution = computed(() => store.overview?.subjectDistribution ?? [])
</script>

<template>
  <div class="page">
    <div class="page__filters">
      <DateRangePicker @change="(v: string) => filters.dateRange = v" />
      <GradeSelect @change="(v: string) => filters.grade = v" />
      <SubjectSelect @change="(v: string[]) => filters.subject = v.join(',')" />
    </div>

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
        <h3>本周学习趋势（小时 vs 上学期）</h3>
        <TrendLineChart
          :data="weeklyTrend"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>学科学习分布</h3>
        <BarCompareChart
          :data="subjectDistribution"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &__filters {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
  }

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
