# 答题闯关 & 学习规划 — 图表布局优化

## 背景

两个用户端页面需要图表层面的改进：

1. **答题闯关** — "通关率排行"目前展示个别用户的通关矩阵表格，缺乏总览视角，需要改为按通关率分段的分布环形图
2. **学习规划** — "每日任务完成明细"目前仅有一个全宽数据表格，缺少右侧的趋势图表做视觉补充

## 改动方案

### 改动一：答题闯关 — 通关率排行 → 通关率分布

**页面**：`src/pages/user/exam-challenge.vue`

**变更**：
- 标题由"通关率排行"改为"通关率分布"
- `DataTable` + `el-table-column`（共 12 列）全部移除，替换为 `PieDistChart`
- 新增 computed `clearRateDistribution`：对 `store.examChallenge.clearRanking` 按 `clearRate` 分段计数，生成 `IDistributionItem[]`

**分段规则**（对 `ILevelClearItem.clearRate`）：

| 分段 | 条件 | label |
|---|---|---|
| 100% 通关 | `clearRate === 1.0` | `'100%通关'` |
| 50% ~ 99% | `clearRate >= 0.5 && clearRate < 1.0` | `'50%~99%通关'` |
| 低于 50% | `clearRate < 0.5` | `'低于50%通关'` |

**图表**：`PieDistChart type="ring"`，data 传入 `clearRateDistribution`，loading/error 复用 `store.loading` / `store.error`

**不涉及**：`exam-challenge.json`、类型定义、store

### 改动二：学习规划 — 每日任务完成明细 + 趋势图

**页面**：`src/pages/user/learning-plan.vue`

**布局变更**：将"每日任务完成明细"从单栏全宽改为双栏并排：
- **左栏**（1fr）：保留 `DataTable` 和现有列
- **右栏**（1fr）：新增 `TrendLineChart`，标题"计划 vs 完成趋势"

**新增 computed** `dailyTaskTrend`：将 `store.learningPlan.dailyTasks` 转为 `ITrendItem[]`：
```ts
{ date: item.date, value: item.planned, value2: item.completed }
```
`value` = 计划数（实线），`value2` = 完成数（虚线）

**新增 import**：`TrendLineChart` from `@/components/charts/TrendLineChart.vue`

**样式**：双栏区域使用现有的 `&__charts` 规则（`grid-template-columns: 1fr 1fr; gap: 16px`）

**不涉及**：`learning-plan.json`、类型定义、store

## 数据流

两个改动均为纯前端计算，不影响 store / API：
```
store.xxxData（已加载）
  → 页面 computed（转换格式 / 聚合）
  → 图表组件（PieDistChart / TrendLineChart）
```

## 涉及文件

| 文件 | 操作 | 说明 |
|---|---|---|
| `src/pages/user/exam-challenge.vue` | 修改 | 通关率排行 → 分布环形图，新增 computed |
| `src/pages/user/learning-plan.vue` | 修改 | 每日任务明细双栏布局，新增 computed + TrendLineChart |
