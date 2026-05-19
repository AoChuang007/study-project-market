<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useOpsStore } from '@/stores/useOpsStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import DataTable from '@/components/common/DataTable.vue'

const store = useOpsStore()

onMounted(() => {
  if (store.retention === null) {
    store.fetchRetention()
  }
})

const summary = computed(() => store.retention?.summary ?? [])
const retentionCurve = computed(() => store.retention?.retentionCurve ?? [])
const channelComparison = computed(() => store.retention?.channelComparison ?? [])
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
        <h3>用户留存曲线</h3>
        <TrendLineChart
          :data="retentionCurve"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="page__card">
      <h3>分渠道留存对比</h3>
      <DataTable
        :data="channelComparison as unknown as Record<string, unknown>[]"
        :loading="store.loading"
        :error="store.error"
      >
        <el-table-column prop="channel" label="渠道" width="140" />
        <el-table-column prop="day1" label="次日留存" width="120">
          <template #default="{ row }">
            {{ ((row.day1 as number) * 100).toFixed(0) }}%
          </template>
        </el-table-column>
        <el-table-column prop="day7" label="7日留存" width="120">
          <template #default="{ row }">
            {{ ((row.day7 as number) * 100).toFixed(0) }}%
          </template>
        </el-table-column>
        <el-table-column prop="day30" label="30日留存" width="120">
          <template #default="{ row }">
            {{ ((row.day30 as number) * 100).toFixed(0) }}%
          </template>
        </el-table-column>
      </DataTable>
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
