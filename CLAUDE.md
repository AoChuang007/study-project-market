# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

学情数据分析平台（智学轨迹），Vue 3 + TypeScript + Vite 构建的 SPA 应用，面向大学场景。分为三大模块：总览大屏、用户端（学习概览/AI智能体/数字人/目标管理/学习规划/答题闯关）、运营端（大盘/DAU/留存/转化漏斗/满意度）。

## 常用命令

```bash
pnpm dev              # 开发服务器启动
pnpm build            # 类型检查 + 生产构建 (vue-tsc -b && vite build)
pnpm preview          # 预览生产构建
```

## 技术栈

- **Vue 3.5** + TypeScript + Vite 5（Composition API + `<script setup>`）
- **Pinia 3** 状态管理
- **Vue Router 4**（Hash 模式 `createWebHashHistory`）
- **Element Plus 2.14** UI 组件库
- **ECharts 6** + **vue-echarts 8** 图表
- **dayjs** 日期处理、**lodash-es** 工具函数
- **sass-embedded** SCSS 预处理（通过 `modern-compiler` API）

## 路径别名

`@/` → `src/`（vite.config.ts 和 tsconfig.app.json 均已配置）

## 架构

### 布局系统

`App.vue` 根据 `route.meta.layout` 切换两种布局：
- **DashboardLayout**（`layout: 'dashboard'`）：暗色主题，侧边栏 + 筛选栏 + 主内容区，用于 `/` 总览大屏
- **ContentLayout**（`layout: 'content'`）：亮色主题，侧边栏 + 顶栏（含面包屑/标题/当前时间）+ 筛选栏 + 主内容区，用于其他全部页面

### 路由（12条，均为懒加载）

```
/                          → 总览大屏 (dark layout)
/user                      → 学习概览
/user/ai-planning          → AI智能体使用
/user/digital-human        → 数字人互动
/user/goal-tracking        → 目标管理
/user/learning-plan        → 学习规划
/user/exam-challenge       → 答题闯关
/ops                       → 大盘分析
/ops/dau                   → DAU与活跃
/ops/retention             → 用户留存
/ops/conversion            → AI转化漏斗
/ops/satisfaction          → 满意度反馈
```

路由常量定义在 `src/types/index.ts`（如 `ROUTE_USER_OVERVIEW`），侧边栏 `AppSidebar.vue` 直接引用。

### Store 层

| Store | 文件 | 职责 |
|---|---|---|
| `useAppStore` | `src/stores/useAppStore.ts` | 全局应用状态：`currentRole`（`'user'`/`'ops'`）、`sidebarCollapsed` |
| `useFilterStore` | `src/stores/useFilterStore.ts` | 全局筛选器状态，按路由路径区分可见筛选器，提供 `apiParams` 给数据层 |
| `useUserStore` | `src/stores/useUserStore.ts` | 用户端 6 个数据域，通过 `createNullableRef<T>()` 创建可空 ref，带统一的 `withLoading` 包装器和筛选器变化自动重取 watch |
| `useOpsStore` | `src/stores/useOpsStore.ts` | 运营端 5 个数据域，结构与 useUserStore 一致 |
| `useDashboardStore` | `src/stores/useDashboardStore.ts` | 总览大屏数据，复用 `useRequest` composable |

**useUserStore / useOpsStore 模式**：
- 每个数据域为 `Ref<T | null>`，`null` 表示未加载
- `withLoading(fn)` 统一管理 `loading`/`error` 状态
- 页面 `onMounted` 时检查是否为 `null`，是则调用对应 `fetchXxx()`
- store 内部 watch `filterStore.apiParams` 变化，自动重取已加载模块的数据

### 全局筛选器系统

单向数据流：`AppFilterBar` → `useFilterStore.filters` → `apiParams` → `useUserStore`/`useOpsStore` watch → API 调用

- `AppFilterBar`：全局筛选栏，在 ContentLayout/DashboardLayout 的顶栏与主内容之间渲染
- `visibleFilters`：`/user/*` 显示 `['dateRange', 'grade', 'subject']`，其他路由仅 `['dateRange']`
- 三个筛选器组件（`src/components/filters/`）均支持 `v-model`，通过 `modelValue` prop + `update:modelValue` emit 实现
- `useFilterStore.apiParams`（computed）将内部状态转为 `IFilterParams` 格式：`{ dateRange: [string, string], grade: string, subject: string }`

### 数据层（Mock 阶段）

`src/api/service-json.ts` 中的 `JsonApiService` 实现 `IApiService` 接口，所有方法通过动态 `import()` 加载 `src/data/` 下的 JSON 文件，模拟 300ms 网络延迟。方法签名接受 `IFilterParams`，但当前返回静态数据。

### 图表组件

`src/components/charts/` 包含 6 个基于 vue-echarts 的图表组件：MetricsCard、TrendLineChart、BarCompareChart、PieDistChart、FunnelChart、HeatmapChart。均接收 `data`、`loading`、`error` props，内部使用 `useChartResize` composable 处理自适应。

### SCSS 变量

定义在 `src/styles/variables.scss`，通过 vite 的 `additionalData` 全局注入（`@use "@/styles/variables.scss" as *;`），所有 scoped SCSS 可直接使用变量名如 `$dark-bg-primary`、`$light-border`、`$sidebar-width` 等，无需手动 import。

### 类型系统

- `src/api/types/service.ts`：API 层的 `IFilterParams` 和 `IApiService` 接口
- `src/types/index.ts`：业务数据类型（`IUserOverview`、`IDauData` 等），以及通用类型（`ISummaryCard`、`ITrendItem`、`IDistributionItem` 等）、路由常量、`TRole` 等
