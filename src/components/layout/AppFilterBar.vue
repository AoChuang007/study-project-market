<script setup lang="ts">
import { useFilterStore } from '@/stores/useFilterStore'
import DateRangePicker from '@/components/filters/DateRangePicker.vue'
import GradeSelect from '@/components/filters/GradeSelect.vue'
import SubjectSelect from '@/components/filters/SubjectSelect.vue'

const filterStore = useFilterStore()
</script>

<template>
  <div class="app-filter-bar">
    <DateRangePicker
      v-if="filterStore.visibleFilters.includes('dateRange')"
      v-model="filterStore.filters.dateRange"
    />
    <GradeSelect
      v-if="filterStore.visibleFilters.includes('grade')"
      v-model="filterStore.filters.grade"
    />
    <SubjectSelect
      v-if="filterStore.visibleFilters.includes('subject')"
      v-model="filterStore.filters.subject"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: $light-bg-secondary;
  border-bottom: 1px solid $light-border;
  flex-shrink: 0;
}
</style>
