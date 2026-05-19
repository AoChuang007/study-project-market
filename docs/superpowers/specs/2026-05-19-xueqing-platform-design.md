# 学情大数据平台 — 设计规格文档

> 日期：2026-05-19 | 状态：已实现

## 项目概述

学情大数据平台，面向用户和运营两类角色，展示 AI 学习规划智能体、数字人聊天、目标管理、学习规划、答题闯关等学情数据。

## 技术栈

| 层面 | 选型 |
|------|------|
| 构建 | Vite 5 + Vue 3.5 (Composition API + `<script setup>`) |
| 语言 | TypeScript（严格模式） |
| 路由 | Vue Router 4 (Hash模式) |
| 状态管理 | Pinia |
| UI | Element Plus |
| 图表 | ECharts 5 + vue-echarts |
| CSS | SCSS + BEM，暗色/亮色双主题 |
| 数据 | JSON 静态文件 + API Service 抽象层 |

## 路由结构

```
/                       → 总览大屏（暗色）
/user                   → 用户大盘 - 学习概览
/user/ai-planning       → AI智能体使用分析
/user/digital-human     → 数字人互动分析
/user/goal-tracking     → 目标管理
/user/learning-plan     → 学习规划
/user/exam-challenge    → 答题闯关
/ops                    → 运营大盘 - 大盘分析
/ops/dau                → DAU与活跃分析
/ops/retention          → 用户留存分析
/ops/conversion         → AI功能转化漏斗
/ops/satisfaction       → 满意度反馈
```

## 目录结构

```
src/
├── api/                 # IApiService抽象层 + JsonApiService
├── components/          # 共享组件
│   ├── charts/          # MetricsCard, TrendLineChart, BarCompareChart, PieDistChart, FunnelChart, HeatmapChart
│   ├── layout/          # AppSidebar, AppHeader, DashboardLayout, ContentLayout
│   ├── filters/         # DateRangePicker, GradeSelect, SubjectSelect
│   └── common/          # DataTable, LoadingSkeleton, EmptyState
├── composables/         # useRequest, useChartResize, useFilter
├── data/                # 12个JSON静态数据文件
├── pages/               # 12个页面组件
├── router/              # Vue Router配置
├── stores/              # useDashboardStore, useUserStore, useOpsStore, useAppStore
├── styles/              # SCSS变量
├── types/               # TS类型定义
└── utils/               # format工具函数
```

## 页面设计

- **总览大屏**：暗色全屏，4指标卡 + 活跃趋势 + AI分布 + 排行 + 热度 + 实时活跃
- **用户大盘**（6页）：学习概览、AI智能体、数字人、目标管理、学习规划、答题闯关
- **运营大盘**（5页）：大盘分析、DAU、留存、转化漏斗、满意度

## 数据流

JSON文件 → JsonApiService → Pinia Store → Vue Component (computed)

三态覆盖：loading（骨架屏）、error（错误提示+重试）、empty（空状态插画）

## 边界处理

- 异步竞态：useRequest 的 requestId 机制
- 防抖：筛选器 300ms
- 错误边界：onErrorCaptured 全局兜底
- 空值：优先使用 `?.` 和 `??`
