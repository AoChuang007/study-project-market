<script setup lang="ts" generic="T extends Record<string, unknown>">
defineProps<{
  data: T[]
  loading: boolean
  error: string | null
}>()

defineSlots<{
  default: () => unknown
}>()
</script>

<template>
  <div class="data-table">
    <div v-if="loading" class="data-table__loading">
      <el-skeleton animated :rows="5" />
    </div>
    <div v-else-if="error" class="data-table__error">
      <span>{{ error }}</span>
    </div>
    <div v-else-if="data.length === 0" class="data-table__empty">
      <el-empty description="暂无数据" />
    </div>
    <el-table v-else :data="data" stripe border style="width: 100%" size="small">
      <slot />
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.data-table {
  width: 100%;

  &__loading { padding: 16px; }
  &__error, &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: $light-text-secondary;
  }
}
</style>
