# 内容结构重构设计

## 概述

三项内容与结构变更：
1. 答题闯关"错题排行"改为"通关率混合矩阵"
2. 目标管理"目标进度列表"改为按学科大类聚合
3. 侧边栏去掉用户/运营大盘分组，菜单平铺

## 需求一：答题闯关 — 通关率混合矩阵

### 数据模型

新增 `ILevelClearItem` 接口替代原有 `IRankingItem`：

```ts
interface ILevelClearItem {
  rank: number       // 排名
  userName: string   // 用户名
  cleared: number    // 通过关数 (0~8)
  clearRate: number  // 通关率 = cleared / 8
  levelMatrix: boolean[]  // 8关通过矩阵 [true, false, ...]
  change: number      // 较昨日通过数变化
}
```

`IExamChallengeData` 中 `errorRanking: IRankingItem[]` 改为 `clearRanking: ILevelClearItem[]`。

### UI 呈现

使用 DataTable 展示，列定义：

| 列名 | 字段 | 宽度 | 说明 |
|------|------|------|------|
| 排名 | rank | 80 | 按通关率降序 |
| 用户名 | userName | 120 | |
| 第1关 ~ 第8关 | levelMatrix[0]~[7] | 各60 | ✓ 或 ✗，通过绿色，未通过红色 |
| 通过数 | cleared | 100 | `${cleared}/8` |
| 通关率 | clearRate | 100 | 百分比，带进度条 |
| 较昨日 | change | 80 | +N 或 -N |

### 数据文件

`src/data/user/exam-challenge.json` 中替换 `errorRanking` 为 `clearRanking`。

### 组件变更

`src/pages/user/exam-challenge.vue`：
- 删除 `errorRanking` computed
- 新增 `clearRanking` computed
- 标题 "错题排行" → "通关率排行"
- 列定义重新编写
- 移除 `el-table-column prop="name" label="知识点"` 和 `prop="value" label="错题数"`

## 需求二：目标管理 — 学科聚合

### 数据模型

变更 `IProgressItem` → 新的 `ISubjectGoalItem`：

```ts
interface ISubjectGoalItem {
  subject: string       // 学科名：数学、语文、英语等
  progress: number      // 综合完成率 0~1
  completedCount: number // 已完成子目标数
  totalCount: number     // 子目标总数
}
```

`IGoalTrackingData` 中 `goalList: IProgressItem[]` 改为 `subjectGoals: ISubjectGoalItem[]`。

### UI 呈现

右侧卡片标题从 "目标进度列表" 改为 "学科目标进度"。每行展示：

```
┌──────────────────────────────────────┐
│ 数学  ████████████░░  85%  17/20    │
│ 语文  ██████████░░░░  72%  13/18    │
│ 英语  ███████████░░░  78%  14/18    │
│ 物理  ████████░░░░░░  65%  11/17    │
│ 化学  █████████████░  90%  18/20    │
│ 历史  ██████████████  96%  19/20    │
└──────────────────────────────────────┘
```

每行包含：学科名 + `<el-progress>` + 完成率百分比 + `completedCount/totalCount`。

与现有的 `goal-tracking.vue` 模板结构相似，只需将 `goalList` 遍历改为 `subjectGoals`，字段映射调整。

### 数据文件

`src/data/user/goal-tracking.json` 中替换 `goalList` 为 `subjectGoals`。

### 组件变更

`src/pages/user/goal-tracking.vue`：
- `goalList` computed → `subjectGoals` computed
- 模板中 `v-for="goal in goalList"` → `v-for="item in subjectGoals"`
- 字段映射：`goal.name` → `item.subject`, `goal.current/goal.target` → `item.completedCount/item.totalCount`
- 保留 `<el-progress>` 进度条，颜色规则不变

## 需求三：侧边栏平铺

### 影响范围

1. **`src/components/layout/AppSidebar.vue`** — 核心变更
2. **`src/router/index.ts`** — 路由路径保持不变
3. **`src/types/index.ts`** — 可能移除不再需要的路由常量
4. **`src/stores/useAppStore.ts`** — 简化或保留 `currentRole`

### 侧边栏结构变更

**当前（分组层级）：**
```
总览大屏
— 用户大盘 —
  学习概览
  AI智能体使用
  ...
— 运营大盘 —
  大盘分析
  DAU与活跃
  ...
[角色切换下拉]
```

**目标（平铺）：**
```
总览大屏
学习概览
AI智能体使用
数字人互动
目标管理
学习规划
答题闯关
大盘分析
DAU与活跃
用户留存
AI转化漏斗
满意度反馈
```

### AppSidebar 变更细节

- 删除 `IMenuGroup` 接口和 `menuGroups` 数组
- 使用单一 `menuItems: IMenuItem[]` 数组
- 所有菜单项缩进一致（不需要 `--child` 修饰）
- 删除 `group-label` DOM 结构
- **保留**总览大屏在顶部作为独立项
- 删除底部角色切换下拉（`el-select` 和 `app-sidebar__footer`）
- 删除 `roleOptions`, `onRoleChange`, `useAppStore` 的 `setRole` 调用
- `navigate` 函数不再需要 `setRole` 逻辑

### 路由不变

所有路由路径保持原样（`/user/overview`, `/ops/dau` 等），仅侧边栏展示方式改变。这意味着 URL 结构不变，已有的书签和钻取跳转仍然可用。

### Store 处理

`useAppStore.ts` 中的 `currentRole` 和 `setRole`：
- 如果仪表盘总览大屏的钻取功能仍依赖 `currentRole` 来决定跳转目标，则保留
- 否则可移除
- 本次先保留，因为 Dashboard 的 `drillToUser()` / `drillToOps()` 仍使用路由路径跳转（不受影响）

### 排序顺序

推荐平铺顺序：先学生学习功能（6项），再运营分析功能（5项）：
1. 学习概览
2. AI智能体使用
3. 数字人互动
4. 目标管理
5. 学习规划
6. 答题闯关
7. 大盘分析
8. DAU与活跃
9. 用户留存
10. AI转化漏斗
11. 满意度反馈

## 类型定义汇总

```ts
// 新增
interface ILevelClearItem {
  rank: number
  userName: string
  cleared: number
  clearRate: number
  levelMatrix: boolean[]
  change: number
}

interface ISubjectGoalItem {
  subject: string
  progress: number
  completedCount: number
  totalCount: number
}
```

## 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/types/index.ts` | 修改 | 新增接口，修改 IExamChallengeData, IGoalTrackingData |
| `src/data/user/exam-challenge.json` | 修改 | errorRanking → clearRanking |
| `src/data/user/goal-tracking.json` | 修改 | goalList → subjectGoals |
| `src/pages/user/exam-challenge.vue` | 修改 | 错题排行 → 通关率矩阵 |
| `src/pages/user/goal-tracking.vue` | 修改 | 目标列表 → 学科聚合 |
| `src/components/layout/AppSidebar.vue` | 修改 | 分组 → 平铺 |
| `src/router/index.ts` | 不变 | 路径保留 |
| `src/stores/useUserStore.ts` | 可能不变 | 类型自动匹配 |
