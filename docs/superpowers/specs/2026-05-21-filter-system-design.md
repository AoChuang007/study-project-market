# 全局筛选器系统 — 设计文档

> 日期: 2026-05-21 | 状态: 待实施

## 1. 概述

项目当前有三个筛选器组件（DateRangePicker、GradeSelect、SubjectSelect），但筛选参数从未传递到数据层，
筛选器变化不会引起任何数据过滤。本次设计打通筛选器 → 状态 → 数据 → 图表 的完整链路。

### 核心目标

- 全局统一筛选栏，所有页面共享筛选项，跨页面切换保持状态
- Mock 阶段前端二次过滤数据，筛选器即刻生效
- 按页面类型显示不同筛选器：用户端全部三个，运营端仅时间

## 2. 架构

```
ContentLayout
  ├── AppSidebar
  ├── AppHeader
  ├── AppFilterBar          ← 新增
  │     ├── DateRangePicker (v-model="filterStore.filters.dateRange")
  │     ├── GradeSelect      (v-model="filterStore.filters.grade")       — 仅 /user/* 显示
  │     └── SubjectSelect    (v-model="filterStore.filters.subject")      — 仅 /user/* 显示
  └── <router-view>
       └── 各页面 (只读 store，不再各自渲染筛选器)
```

数据流：

```
AppFilterBar 用户操作
    ↓ v-model 双向绑定
useFilterStore.filters 状态更新
    ↓ watchEffect / computed
useUserStore / useOpsStore fetch 方法被触发
    ↓ apiParams 传入
JsonApiService (mock 阶段参数被忽略，返回全量数据)
    ↓
store 中 rawData 存储原始数据
    ↓ computed
对外暴露过滤后的数据 (overview / examChallenge / ...)
    ↓
页面 computed 读取 → 图表渲染
```

## 3. 新增文件

### 3.1 `src/stores/useFilterStore.ts`

```ts
interface IFilterState {
  dateRange: string   // 'today' | '7d' | '30d' | '90d'，默认 '7d'
  grade: string        // '' | 'freshman' | 'sophomore' | 'junior' | 'senior' | 'master1' | 'master2' | 'master3'
  subject: string      // '' | 逗号分隔学科名，如 '数学,英语'
}
```

**API**:

| 成员 | 类型 | 说明 |
|---|---|---|
| `filters` | `Ref<IFilterState>` | 筛选状态 |
| `apiParams` | `ComputedRef<IFilterParams>` | 转换为 API 所需格式，含日期范围解析 |
| `setFilter(key, value)` | 方法 | 更新单个筛选字段 |
| `resetFilters()` | 方法 | 恢复默认值 `{ dateRange: '7d', grade: '', subject: '' }` |
| `visibleFilters` | `ComputedRef<string[]>` | 根据当前 `route.path` 返回应显示的筛选器列表 |

**visibleFilters 规则**:
- `/user/*` → `['dateRange', 'grade', 'subject']`
- `/ops/*` → `['dateRange']`
- `/dashboard` 或其他 → `['dateRange']`

**dateRange 到日期区间解析**:
- `'today'` → 今天
- `'7d'` → 近 7 天
- `'30d'` → 近 30 天
- `'90d'` → 近 90 天

### 3.2 `src/components/layout/AppFilterBar.vue`

统一的筛选栏组件：

- 从 `useFilterStore` 读取 `filters` 和 `visibleFilters`
- 根据 `visibleFilters` 决定显示哪些筛选器
- 所有筛选器通过 `v-model` 直接绑定 `filterStore.filters.xxx`
- 样式：与 AppHeader 风格一致，水平排列，light 主题下白色背景

```vue
<template>
  <div class="app-filter-bar" v-if="visibleFilters.length > 0">
    <DateRangePicker v-if="visibleFilters.includes('dateRange')" v-model="filterStore.filters.dateRange" />
    <GradeSelect v-if="visibleFilters.includes('grade')" v-model="filterStore.filters.grade" />
    <SubjectSelect v-if="visibleFilters.includes('subject')" v-model="filterStore.filters.subject" />
  </div>
</template>
```

## 4. 改造文件

### 4.1 筛选器组件 v-model 改造

#### DateRangePicker (`src/components/filters/DateRangePicker.vue`)

- 新增 `modelValue: string` prop，默认 `'7d'`
- 新增 `emit('update:modelValue', value)`
- 内部绑定改为 `:model-value="modelValue"` + `@change` emit 新值

#### GradeSelect (`src/components/filters/GradeSelect.vue`)

- 新增 `modelValue: string` prop，默认 `''`
- 新增 `emit('update:modelValue', value)`
- **选项改为大学年级**：全部年级(`''`)、大一(`freshman`)、大二(`sophomore`)、大三(`junior`)、大四(`senior`)、研一(`master1`)、研二(`master2`)、研三(`master3`)

#### SubjectSelect (`src/components/filters/SubjectSelect.vue`)

- 新增 `modelValue: string` prop，默认 `''`
- 新增 `emit('update:modelValue', value)`
- 内部：`modelValue` split 为多选数组绑定，change 时 join 后 emit

### 4.2 Store 层改造

#### `useUserStore` — 6 个 fetch 方法全部改造

```ts
// 改造模式（以 fetchOverview 为例）
const filterStore = useFilterStore()
const overview = createNullableRef<IUserOverview>()

const fetchOverview = async () => {
  const result = await withLoading(() =>
    apiService.getUserOverview(filterStore.apiParams as IFilterParams)
  )
  if (result !== null) overview.value = result
}

// 对外暴露：每次 filter 变化自动重取
watch(() => filterStore.apiParams, () => {
  if (overview.value !== null) fetchOverview()  // 已加载过的模块才重取
}, { deep: true })

// 首次加载仍由页面 onMounted 触发
```

或者采用更简洁的方式——store 内部用 `watchEffect` 追踪 apiParams 变化：

```ts
// 免去每个 fetch 手动 watch，一次注册
watch(() => filterStore.apiParams, () => {
  // 重取所有已初始化的模块
  if (overview.value !== null) fetchOverview()
  if (examChallenge.value !== null) fetchExamChallenge()
  // ...
}, { deep: true })
```

#### `useOpsStore` — 同理改造 5 个 fetch 方法

#### `useDashboardStore` — fetchOverview 同理改造

### 4.3 数据过滤层

在每个 store 中，原始 API 数据用 computed 包装后对外暴露：

**过滤规则**：

| 数据类型 | 过滤方式 |
|---|---|
| `ISummaryCard[]` | 不过滤 |
| `ITrendItem[]` | 按 `dateRange` 截断 |
| `IDistributionItem[]` | 不过滤 |
| `IRankingItem[]` | 不过滤 |
| `ILevelClearItem[]` | 不过滤 |
| `ISubjectGoalItem[]` | 按 `subject` 过滤 |

**ITrendItem 时间截断实现**：

趋势数据按日期格式过滤，去掉 `dateRange` 范围之外的条目。数据中的日期字段（如 `date: '09-08'`）需与当前时间计算偏移后判断。

### 4.4 布局组件改造

#### `ContentLayout.vue`

在 AppHeader 和 slot 之间插入 `<AppFilterBar />`。

#### `DashboardLayout.vue`

同样插入 `<AppFilterBar />`（仅时间筛选）。

### 4.5 页面清理

| 页面 | 操作 |
|---|---|
| `overview.vue` | 删除本地 `filters ref`、`useFilter`、筛选器 import |
| `ai-planning.vue` | 删除 `DateRangePicker`、`GradeSelect` import 及空事件处理器 |
| `dau.vue` | 删除 `range ref`、`DateRangePicker` import |
| 其余页面 | 无需改动，数据自动过滤 |

## 5. 不变更项

- `useFilter` composable 保留（可供非全局筛选场景复用）
- `useAppStore` 不动（`currentRole`、`setRole` 等保留）
- `JsonApiService` 不动（保持 `_params` 忽略模式，等待真实 API）
- `IFilterParams` 接口不动
- `IRankingItem`、`IProgressItem` 等通用接口不动

## 6. 实施顺序

1. 改造三个筛选器组件（添加 v-model 支持，调整年级选项）
2. 新建 `useFilterStore`
3. 新建 `AppFilterBar`
4. 改造 `useUserStore`、`useOpsStore`、`useDashboardStore`（传参数 + 数据过滤）
5. 改造 `ContentLayout`、`DashboardLayout`（插入 AppFilterBar）
6. 清理各页面残留的筛选器代码
7. `npm run build` 验证构建

## 7. 验证清单

- [ ] 构建通过，无类型错误
- [ ] ContentLayout 页面顶部显示筛选栏
- [ ] /user/* 页面显示全部 3 个筛选器（日期 + 年级 + 学科）
- [ ] /ops/* 页面仅显示日期筛选器
- [ ] 切换筛选器值后，页面数据即时变化
- [ ] 切换到不同页面，筛选状态保持不变
- [ ] 年级下拉框显示大一~研三选项
