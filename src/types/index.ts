import type { IFilterParams } from './api'

export interface ITrendItem {
  date: string
  value: number
  value2?: number
}

export interface IDistributionItem {
  name: string
  count: number
  ratio: number
  extra?: number
}

export interface IHeatmapItem {
  hour: number | string
  day: string
  value: number
}

export interface ISummaryCard {
  label: string
  value: number
  unit: string
  trend: number
  trendLabel: string
}

export interface IProgressItem {
  id: string
  name: string
  progress: number
  target: number
  current: number
}

export interface IRankingItem {
  rank: number
  name: string
  value: number
  change: number
}

export interface IDashboardOverview {
  summary: ISummaryCard[]
  activeTrend: ITrendItem[]
  aiDistribution: IDistributionItem[]
  digitalHumanRanking: IRankingItem[]
  subjectHeat: IDistributionItem[]
  realtimeActivity: ITrendItem[]
}

export interface IUserOverview {
  summary: ISummaryCard[]
  weeklyTrend: ITrendItem[]
  subjectDistribution: IDistributionItem[]
}

export interface IAIPlanningData {
  summary: ISummaryCard[]
  monthlyTrend: ITrendItem[]
  subjectDistribution: IDistributionItem[]
  scenarioDistribution: IDistributionItem[]
  hourlyHeatmap: IHeatmapItem[]
}

export interface IDigitalHumanData {
  summary: ISummaryCard[]
  sessionTrend: ITrendItem[]
  topicDistribution: IDistributionItem[]
  emotionRadar: IDistributionItem[]
}

export interface IGoalTrackingData {
  summary: ISummaryCard[]
  goalList: IProgressItem[]
  completionDistribution: IDistributionItem[]
}

export interface ILearningPlanData {
  summary: ISummaryCard[]
  calendarHeatmap: IHeatmapItem[]
  dailyTasks: Array<{ date: string; planned: number; completed: number; onTime: number }>
}

export interface IExamChallengeData {
  summary: ISummaryCard[]
  knowledgeCorrectRate: IDistributionItem[]
  dailyTrend: ITrendItem[]
  errorRanking: IRankingItem[]
}

export interface IOpsDashboard {
  summary: ISummaryCard[]
  dauMauTrend: ITrendItem[]
  userTypeRatio: IDistributionItem[]
  hourlyActive: IDistributionItem[]
}

export interface IDauData {
  summary: ISummaryCard[]
  dauTrend: ITrendItem[]
  weeklyActive: ITrendItem[]
  monthlyActive: ITrendItem[]
  moduleDauBreakdown: IDistributionItem[]
}

export interface IRetentionData {
  summary: ISummaryCard[]
  retentionCurve: ITrendItem[]
  channelComparison: Array<{ channel: string; day1: number; day7: number; day30: number }>
}

export interface IConversionData {
  summary: ISummaryCard[]
  funnelStages: IDistributionItem[]
  bySubjectConversion: IDistributionItem[]
}

export interface ISatisfactionData {
  summary: ISummaryCard[]
  npsTrend: ITrendItem[]
  satisfactionDistribution: IDistributionItem[]
  featureRating: IDistributionItem[]
  wordCloud: IDistributionItem[]
}

export type TPageData =
  | IDashboardOverview
  | IUserOverview
  | IAIPlanningData
  | IDigitalHumanData
  | IGoalTrackingData
  | ILearningPlanData
  | IExamChallengeData
  | IOpsDashboard
  | IDauData
  | IRetentionData
  | IConversionData
  | ISatisfactionData

export type TRole = 'user' | 'ops'

export interface IAppState {
  currentRole: TRole
  sidebarCollapsed: boolean
}

export const ROUTE_DASHBOARD = '/'
export const ROUTE_USER_OVERVIEW = '/user'
export const ROUTE_USER_AI_PLANNING = '/user/ai-planning'
export const ROUTE_USER_DIGITAL_HUMAN = '/user/digital-human'
export const ROUTE_USER_GOAL_TRACKING = '/user/goal-tracking'
export const ROUTE_USER_LEARNING_PLAN = '/user/learning-plan'
export const ROUTE_USER_EXAM_CHALLENGE = '/user/exam-challenge'
export const ROUTE_OPS_DASHBOARD = '/ops'
export const ROUTE_OPS_DAU = '/ops/dau'
export const ROUTE_OPS_RETENTION = '/ops/retention'
export const ROUTE_OPS_CONVERSION = '/ops/conversion'
export const ROUTE_OPS_SATISFACTION = '/ops/satisfaction'

export type TQueryParams = Partial<IFilterParams>
