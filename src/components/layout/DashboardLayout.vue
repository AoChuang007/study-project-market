<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppFilterBar from './AppFilterBar.vue'
</script>

<template>
  <div class="dashboard-layout">
    <AppSidebar class="dashboard-layout__sidebar" />
    <div class="dashboard-layout__right">
      <AppFilterBar />
      <main class="dashboard-layout__main">
        <slot />
      </main>
    </div>
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

  &__right {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__main {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }
}
</style>
