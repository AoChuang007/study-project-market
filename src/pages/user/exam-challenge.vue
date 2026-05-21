<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import DataTable from '@/components/common/DataTable.vue'

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
        <h3>通关率排行</h3>
        <DataTable
          :data="clearRanking as unknown as Record<string, unknown>[]"
          :loading="store.loading"
          :error="store.error"
        >
          <el-table-column prop="rank" label="排名" width="80" />
          <el-table-column prop="userName" label="用户名" width="120" />
          <el-table-column label="第1关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[0] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[0] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="第2关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[1] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[1] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="第3关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[2] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[2] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="第4关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[3] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[3] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="第5关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[4] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[4] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="第6关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[5] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[5] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="第7关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[6] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[6] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="第8关" width="60">
            <template #default="{ row }">
              <span :style="{ color: (row.levelMatrix as boolean[])[7] ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
                {{ (row.levelMatrix as boolean[])[7] ? '✓' : '✗' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="cleared" label="通过数" width="100" />
          <el-table-column label="通关率" width="100">
            <template #default="{ row }">
              {{ Math.round((row.clearRate as number) * 100) }}%
            </template>
          </el-table-column>
          <el-table-column prop="change" label="较昨日" width="80" />
        </DataTable>
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
