<script setup lang="ts">
defineProps<{
  rows?: number
}>()
</script>

<template>
  <div class="loading-skeleton">
    <el-skeleton animated :rows="rows ?? 4" />
  </div>
</template>

<style lang="scss" scoped>
.loading-skeleton {
  padding: 16px;
}
</style>
