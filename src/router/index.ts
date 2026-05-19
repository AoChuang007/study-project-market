import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Dashboard = () => import('@/pages/dashboard/index.vue')

const UserOverview = () => import('@/pages/user/overview.vue')
const UserAIPlanning = () => import('@/pages/user/ai-planning.vue')
const UserDigitalHuman = () => import('@/pages/user/digital-human.vue')
const UserGoalTracking = () => import('@/pages/user/goal-tracking.vue')
const UserLearningPlan = () => import('@/pages/user/learning-plan.vue')
const UserExamChallenge = () => import('@/pages/user/exam-challenge.vue')

const OpsDashboard = () => import('@/pages/ops/dashboard.vue')
const OpsDau = () => import('@/pages/ops/dau.vue')
const OpsRetention = () => import('@/pages/ops/retention.vue')
const OpsConversion = () => import('@/pages/ops/conversion.vue')
const OpsSatisfaction = () => import('@/pages/ops/satisfaction.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Dashboard,
    meta: { title: '总览大屏', layout: 'dashboard' },
  },
  {
    path: '/user',
    component: UserOverview,
    meta: { title: '学习概览', layout: 'content' },
  },
  {
    path: '/user/ai-planning',
    component: UserAIPlanning,
    meta: { title: 'AI智能体使用', layout: 'content' },
  },
  {
    path: '/user/digital-human',
    component: UserDigitalHuman,
    meta: { title: '数字人互动', layout: 'content' },
  },
  {
    path: '/user/goal-tracking',
    component: UserGoalTracking,
    meta: { title: '目标管理', layout: 'content' },
  },
  {
    path: '/user/learning-plan',
    component: UserLearningPlan,
    meta: { title: '学习规划', layout: 'content' },
  },
  {
    path: '/user/exam-challenge',
    component: UserExamChallenge,
    meta: { title: '答题闯关', layout: 'content' },
  },
  {
    path: '/ops',
    component: OpsDashboard,
    meta: { title: '大盘分析', layout: 'content' },
  },
  {
    path: '/ops/dau',
    component: OpsDau,
    meta: { title: 'DAU与活跃', layout: 'content' },
  },
  {
    path: '/ops/retention',
    component: OpsRetention,
    meta: { title: '用户留存', layout: 'content' },
  },
  {
    path: '/ops/conversion',
    component: OpsConversion,
    meta: { title: 'AI转化漏斗', layout: 'content' },
  },
  {
    path: '/ops/satisfaction',
    component: OpsSatisfaction,
    meta: { title: '满意度反馈', layout: 'content' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
