<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import MetricsCard from '@/components/charts/MetricsCard.vue'
import PieDistChart from '@/components/charts/PieDistChart.vue'

const store = useUserStore()

onMounted(() => {
  if (store.goalTracking === null) {
    store.fetchGoalTracking()
  }
})

const summary = computed(() => store.goalTracking?.summary ?? [])
const goalList = computed(() => store.goalTracking?.goalList ?? [])
const completionDistribution = computed(() => store.goalTracking?.completionDistribution ?? [])
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
        <h3>目标达成状态</h3>
        <PieDistChart
          :data="completionDistribution"
          type="ring"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
      <div class="page__card">
        <h3>目标进度列表</h3>
        <div v-if="store.loading" class="page__skeleton">
          <el-skeleton animated :rows="7" />
        </div>
        <div v-else-if="store.error" class="page__error">{{ store.error }}</div>
        <div v-else class="page__goal-list">
          <div v-for="goal in goalList" :key="goal.id" class="page__goal-item">
            <div class="page__goal-header">
              <span class="page__goal-name">{{ goal.name }}</span>
              <span class="page__goal-value">{{ goal.current }}/{{ goal.target }}</span>
            </div>
            <el-progress
              :percentage="Math.round(goal.progress * 100)"
              :stroke-width="8"
              :color="goal.progress >= 0.8 ? '#67c23a' : goal.progress >= 0.5 ? '#e6a23c' : '#409eff'"
            />
          </div>
        </div>
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

  &__skeleton, &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: $light-text-secondary;
  }

  &__goal-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__goal-item {
    padding: 12px;
    background: $light-bg-primary;
    border-radius: $border-radius-sm;
  }

  &__goal-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
  }

  &__goal-name {
    color: $light-text-primary;
  }

  &__goal-value {
    color: $light-text-secondary;
    font-family: 'DIN Alternate', sans-serif;
  }
}
</style>
