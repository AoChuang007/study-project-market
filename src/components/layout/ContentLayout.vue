<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="content-layout">
    <AppSidebar class="content-layout__sidebar" />
    <div class="content-layout__right">
      <AppHeader />
      <main class="content-layout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-layout {
  display: flex;
  height: 100vh;
  background: $light-bg-primary;
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
