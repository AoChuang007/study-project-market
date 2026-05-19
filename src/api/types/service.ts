export interface IFilterParams {
  dateRange: [string, string]
  grade: string
  subject: string
}

export interface IApiService {
  getDashboardOverview(): Promise<import('../types').IDashboardOverview>
  getUserOverview(params: IFilterParams): Promise<import('../types').IUserOverview>
  getAIPlanningData(params: IFilterParams): Promise<import('../types').IAIPlanningData>
  getDigitalHumanData(params: IFilterParams): Promise<import('../types').IDigitalHumanData>
  getGoalTrackingData(params: IFilterParams): Promise<import('../types').IGoalTrackingData>
  getLearningPlanData(params: IFilterParams): Promise<import('../types').ILearningPlanData>
  getExamChallengeData(params: IFilterParams): Promise<import('../types').IExamChallengeData>
  getOpsDashboard(params: IFilterParams): Promise<import('../types').IOpsDashboard>
  getDauData(params: IFilterParams): Promise<import('../types').IDauData>
  getRetentionData(params: IFilterParams): Promise<import('../types').IRetentionData>
  getConversionData(params: IFilterParams): Promise<import('../types').IConversionData>
  getSatisfactionData(params: IFilterParams): Promise<import('../types').ISatisfactionData>
}
