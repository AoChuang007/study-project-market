import type { IApiService } from './types/service'
import type { IFilterParams } from './types/service'
import type {
  IDashboardOverview,
  IUserOverview,
  IAIPlanningData,
  IDigitalHumanData,
  IGoalTrackingData,
  ILearningPlanData,
  IExamChallengeData,
  IOpsDashboard,
  IDauData,
  IRetentionData,
  IConversionData,
  ISatisfactionData,
} from '../types'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export class JsonApiService implements IApiService {
  async getDashboardOverview(): Promise<IDashboardOverview> {
    await delay()
    const mod = await import('../data/dashboard-overview.json')
    return mod.default as IDashboardOverview
  }

  async getUserOverview(_params: IFilterParams): Promise<IUserOverview> {
    await delay()
    const mod = await import('../data/user/overview.json')
    return mod.default as IUserOverview
  }

  async getAIPlanningData(_params: IFilterParams): Promise<IAIPlanningData> {
    await delay()
    const mod = await import('../data/user/ai-planning.json')
    return mod.default as IAIPlanningData
  }

  async getDigitalHumanData(_params: IFilterParams): Promise<IDigitalHumanData> {
    await delay()
    const mod = await import('../data/user/digital-human.json')
    return mod.default as IDigitalHumanData
  }

  async getGoalTrackingData(_params: IFilterParams): Promise<IGoalTrackingData> {
    await delay()
    const mod = await import('../data/user/goal-tracking.json')
    return mod.default as IGoalTrackingData
  }

  async getLearningPlanData(_params: IFilterParams): Promise<ILearningPlanData> {
    await delay()
    const mod = await import('../data/user/learning-plan.json')
    return mod.default as ILearningPlanData
  }

  async getExamChallengeData(_params: IFilterParams): Promise<IExamChallengeData> {
    await delay()
    const mod = await import('../data/user/exam-challenge.json')
    return mod.default as IExamChallengeData
  }

  async getOpsDashboard(_params: IFilterParams): Promise<IOpsDashboard> {
    await delay()
    const mod = await import('../data/ops/dashboard.json')
    return mod.default as IOpsDashboard
  }

  async getDauData(_params: IFilterParams): Promise<IDauData> {
    await delay()
    const mod = await import('../data/ops/dau.json')
    return mod.default as IDauData
  }

  async getRetentionData(_params: IFilterParams): Promise<IRetentionData> {
    await delay()
    const mod = await import('../data/ops/retention.json')
    return mod.default as IRetentionData
  }

  async getConversionData(_params: IFilterParams): Promise<IConversionData> {
    await delay()
    const mod = await import('../data/ops/conversion.json')
    return mod.default as IConversionData
  }

  async getSatisfactionData(_params: IFilterParams): Promise<ISatisfactionData> {
    await delay()
    const mod = await import('../data/ops/satisfaction.json')
    return mod.default as ISatisfactionData
  }
}
