<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()
const pageTitle = computed(() => (route.meta?.title as string) ?? '')
const currentTime = computed(() => dayjs().format('YYYY-MM-DD HH:mm:ss'))
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="pageTitle">{{ pageTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="app-header__title">{{ pageTitle }}</h1>
    </div>
    <div class="app-header__right">
      <span class="app-header__time">{{ currentTime }}</span>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: $light-bg-secondary;
  border-bottom: 1px solid $light-border;
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $light-text-primary;
    margin: 0;
    padding-left: 16px;
    border-left: 1px solid $light-border;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__time {
    font-size: 13px;
    color: $light-text-secondary;
  }
}
</style>
