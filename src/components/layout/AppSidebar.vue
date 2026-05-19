<script setup lang="ts">

import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import {
  ROUTE_DASHBOARD,
  ROUTE_USER_OVERVIEW, ROUTE_USER_AI_PLANNING, ROUTE_USER_DIGITAL_HUMAN,
  ROUTE_USER_GOAL_TRACKING, ROUTE_USER_LEARNING_PLAN, ROUTE_USER_EXAM_CHALLENGE,
  ROUTE_OPS_DASHBOARD, ROUTE_OPS_DAU, ROUTE_OPS_RETENTION, ROUTE_OPS_CONVERSION,
  ROUTE_OPS_SATISFACTION,
} from '@/types'
import type { TRole } from '@/types'

interface IMenuItem {
  path: string
  label: string
}

interface IMenuGroup {
  label: string
  role: TRole
  children: IMenuItem[]
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const menuGroups: IMenuGroup[] = [
  {
    label: '用户大盘',
    role: 'user',
    children: [
      { path: ROUTE_USER_OVERVIEW, label: '学习概览' },
      { path: ROUTE_USER_AI_PLANNING, label: 'AI智能体使用' },
      { path: ROUTE_USER_DIGITAL_HUMAN, label: '数字人互动' },
      { path: ROUTE_USER_GOAL_TRACKING, label: '目标管理' },
      { path: ROUTE_USER_LEARNING_PLAN, label: '学习规划' },
      { path: ROUTE_USER_EXAM_CHALLENGE, label: '答题闯关' },
    ],
  },
  {
    label: '运营大盘',
    role: 'ops',
    children: [
      { path: ROUTE_OPS_DASHBOARD, label: '大盘分析' },
      { path: ROUTE_OPS_DAU, label: 'DAU与活跃' },
      { path: ROUTE_OPS_RETENTION, label: '用户留存' },
      { path: ROUTE_OPS_CONVERSION, label: 'AI转化漏斗' },
      { path: ROUTE_OPS_SATISFACTION, label: '满意度反馈' },
    ],
  },
]

const isActive = (path: string) => route.path === path

const navigate = (path: string) => {
  if (path.startsWith('/user')) {
    appStore.setRole('user')
  } else if (path.startsWith('/ops')) {
    appStore.setRole('ops')
  }
  router.push(path)
}

const roleOptions: Array<{ label: string; value: TRole }> = [
  { label: '用户视图', value: 'user' },
  { label: '运营视图', value: 'ops' },
]

const onRoleChange = (value: TRole) => {
  appStore.setRole(value)
  const firstPath = value === 'user' ? ROUTE_USER_OVERVIEW : ROUTE_OPS_DASHBOARD
  router.push(firstPath)
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

      <template v-for="group in menuGroups" :key="group.label">
        <div class="app-sidebar__group-label">{{ group.label }}</div>
        <div
          v-for="child in group.children"
          :key="child.path"
          class="app-sidebar__item app-sidebar__item--child"
          :class="{ 'is-active': isActive(child.path) }"
          @click="navigate(child.path)"
        >
          <span class="app-sidebar__item-label">{{ child.label }}</span>
        </div>
      </template>
    </nav>

    <div class="app-sidebar__footer">
      <el-select
        :model-value="appStore.currentRole"
        class="app-sidebar__role-select"
        size="small"
        @change="onRoleChange"
      >
        <el-option
          v-for="opt in roleOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </div>
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

  &__group-label {
    padding: 16px 20px 8px;
    font-size: 11px;
    color: $dark-text-secondary;
    text-transform: uppercase;
    letter-spacing: 1px;
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

    &--child {
      padding-left: 36px;
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

  &__footer {
    padding: 16px 20px;
    border-top: 1px solid $dark-border;
  }

  &__role-select {
    width: 100%;
  }
}
</style>
