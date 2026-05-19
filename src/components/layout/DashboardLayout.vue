<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <div class="dashboard-layout">
    <AppSidebar class="dashboard-layout__sidebar" />
    <main class="dashboard-layout__main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  background: $dark-bg-primary;
  overflow: hidden;

  &__sidebar {
    position: relative;
    z-index: 10;
  }

  &__main {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }
}
</style>
