<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  unit: string
  trend: number
  trendLabel: string
  loading: boolean
  error: string | null
}>()

const isPositive = computed(() => props.trend >= 0)
const formattedValue = computed(() => {
  if (props.unit === '') return (props.value * 100).toFixed(0) + '%'
  if (props.value >= 10000) return (props.value / 10000).toFixed(1) + '万'
  return props.unit ? `${props.value}${props.unit}` : String(props.value)
})
</script>

<template>
  <div class="metrics-card">
    <div v-if="loading" class="metrics-card__loading">
      <el-skeleton animated :rows="2" />
    </div>
    <div v-else-if="error" class="metrics-card__error">
      <span>加载失败</span>
    </div>
    <template v-else>
      <div class="metrics-card__label">{{ label }}</div>
      <div class="metrics-card__value">{{ formattedValue }}</div>
      <div class="metrics-card__trend" :class="{ 'is-up': isPositive, 'is-down': !isPositive }">
        <span class="metrics-card__arrow">{{ isPositive ? '↑' : '↓' }}</span>
        <span>{{ Math.abs(trend * 100).toFixed(1) }}%</span>
        <span class="metrics-card__trend-label">{{ trendLabel }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.metrics-card {
  background: $light-bg-secondary;
  border-radius: $border-radius-md;
  padding: 20px 24px;
  border: 1px solid $light-border;

  &__label {
    font-size: 13px;
    color: $light-text-secondary;
    margin-bottom: 8px;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: $light-text-primary;
    margin-bottom: 8px;
		font-family: 'DIN Alternate', 'Arial', sans-serif;
  }

  &__trend {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;

    &.is-up { color: $color-success; }
    &.is-down { color: $color-danger; }
  }

  &__arrow {
    font-size: 14px;
  }

  &__trend-label {
    color: $light-text-secondary;
    margin-left: 4px;
  }

  &__loading,
  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    color: $light-text-secondary;
  }
}
</style>
