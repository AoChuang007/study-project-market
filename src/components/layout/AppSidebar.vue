<script setup lang="ts">

import { useRouter, useRoute } from 'vue-router'
import {
  ROUTE_DASHBOARD,
  ROUTE_USER_OVERVIEW, ROUTE_USER_AI_PLANNING, ROUTE_USER_DIGITAL_HUMAN,
  ROUTE_USER_GOAL_TRACKING, ROUTE_USER_LEARNING_PLAN, ROUTE_USER_EXAM_CHALLENGE,
  ROUTE_OPS_DASHBOARD, ROUTE_OPS_DAU, ROUTE_OPS_RETENTION, ROUTE_OPS_CONVERSION,
  ROUTE_OPS_SATISFACTION,
} from '@/types'

interface IMenuItem {
  path: string
  label: string
}

const router = useRouter()
const route = useRoute()

const menuItems: IMenuItem[] = [
  { path: ROUTE_USER_OVERVIEW, label: '学习概览' },
  { path: ROUTE_USER_AI_PLANNING, label: 'AI智能体使用' },
  { path: ROUTE_USER_DIGITAL_HUMAN, label: '数字人互动' },
  { path: ROUTE_USER_GOAL_TRACKING, label: '目标管理' },
  { path: ROUTE_USER_LEARNING_PLAN, label: '学习规划' },
  { path: ROUTE_USER_EXAM_CHALLENGE, label: '答题闯关' },
  { path: ROUTE_OPS_DASHBOARD, label: '大盘分析' },
  { path: ROUTE_OPS_DAU, label: 'DAU与活跃' },
  { path: ROUTE_OPS_RETENTION, label: '用户留存' },
  { path: ROUTE_OPS_CONVERSION, label: 'AI转化漏斗' },
  { path: ROUTE_OPS_SATISFACTION, label: '满意度反馈' },
]

const isActive = (path: string) => route.path === path

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__header" @click="navigate(ROUTE_DASHBOARD)">
      <span class="app-sidebar__logo">智学轨迹</span>
    </div>

    <nav class="app-sidebar__nav">
      <div
        class="app-sidebar__item"
        :class="{ 'is-active': isActive(ROUTE_DASHBOARD) }"
        @click="navigate(ROUTE_DASHBOARD)"
      >
        <span class="app-sidebar__item-label">总览大屏</span>
      </div>

      <div
        v-for="item in menuItems"
        :key="item.path"
        class="app-sidebar__item"
        :class="{ 'is-active': isActive(item.path) }"
        @click="navigate(item.path)"
      >
        <span class="app-sidebar__item-label">{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.app-sidebar {
  width: $sidebar-width;
  height: 100vh;
  background: $dark-bg-secondary;
  border-right: 1px solid $dark-border;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;

  &__header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    border-bottom: 1px solid $dark-border;
  }

  &__logo {
    font-size: 18px;
    font-weight: 700;
    color: $dark-accent;
    letter-spacing: 2px;
  }

  &__nav {
    flex: 1;
    padding: 12px 0;
    overflow-y: auto;
  }

  &__item {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    color: $dark-text-secondary;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      background: rgba($dark-accent, 0.08);
      color: $dark-text-primary;
    }

    &.is-active {
      background: rgba($dark-accent, 0.12);
      color: $dark-accent;
      border-right: 3px solid $dark-accent;
    }
  }

  &__item-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
