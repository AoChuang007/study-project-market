<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import HeatmapChart from '@/components/charts/HeatmapChart.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import DataTable from '@/components/common/DataTable.vue'

const store = useUserStore()

onMounted(() => {
  if (store.learningPlan === null) {
    store.fetchLearningPlan()
  }
})

const summary = computed(() => store.learningPlan?.summary ?? [])
const calendarHeatmap = computed(() => store.learningPlan?.calendarHeatmap ?? [])
const dailyTasks = computed(() => store.learningPlan?.dailyTasks ?? [])

/** 将每日任务数据转为趋势图格式，计划数 vs 完成数 */
const dailyTaskTrend = computed(() =>
  dailyTasks.value.map((t) => ({
    date: t.date,
    value: t.planned,
    value2: t.completed,
  }))
)
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
        <h3>月度学习日历热力图</h3>
        <HeatmapChart
          :data="calendarHeatmap"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__charts">
      <div class="page__card">
        <h3>每日任务完成明细</h3>
        <DataTable
          :data="dailyTasks as unknown as Record<string, unknown>[]"
          :loading="store.loading"
          :error="store.error"
        >
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="planned" label="计划数" width="100" />
          <el-table-column prop="completed" label="完成数" width="100" />
          <el-table-column prop="onTime" label="按时完成" width="100" />
        </DataTable>
      </div>
      <div class="page__card">
        <h3>计划 vs 完成趋势</h3>
        <TrendLineChart
          :data="dailyTaskTrend"
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
