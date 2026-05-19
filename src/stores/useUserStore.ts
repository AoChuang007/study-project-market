import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type {
  IUserOverview,
  IAIPlanningData,
  IDigitalHumanData,
  IGoalTrackingData,
  ILearningPlanData,
  IExamChallengeData,
} from '@/types'
import { apiService } from '@/api'

type TNullable<T> = Ref<T | null>

const createNullableRef = <T>() => ref<T | null>(null) as TNullable<T>

export const useUserStore = defineStore('user', () => {
  const overview = createNullableRef<IUserOverview>()
  const aiPlanning = createNullableRef<IAIPlanningData>()
  const digitalHuman = createNullableRef<IDigitalHumanData>()
  const goalTracking = createNullableRef<IGoalTrackingData>()
  const learningPlan = createNullableRef<ILearningPlanData>()
  const examChallenge = createNullableRef<IExamChallengeData>()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '数据加载失败'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchOverview = async () => {
    const result = await withLoading(() => apiService.getUserOverview({} as Record<string, never> as never))
    if (result !== null) overview.value = result
  }

  const fetchAIPlanning = async () => {
    const result = await withLoading(() => apiService.getAIPlanningData({} as Record<string, never> as never))
    if (result !== null) aiPlanning.value = result
  }

  const fetchDigitalHuman = async () => {
    const result = await withLoading(() => apiService.getDigitalHumanData({} as Record<string, never> as never))
    if (result !== null) digitalHuman.value = result
  }

  const fetchGoalTracking = async () => {
    const result = await withLoading(() => apiService.getGoalTrackingData({} as Record<string, never> as never))
    if (result !== null) goalTracking.value = result
  }

  const fetchLearningPlan = async () => {
    const result = await withLoading(() => apiService.getLearningPlanData({} as Record<string, never> as never))
    if (result !== null) learningPlan.value = result
  }

  const fetchExamChallenge = async () => {
    const result = await withLoading(() => apiService.getExamChallengeData({} as Record<string, never> as never))
    if (result !== null) examChallenge.value = result
  }

  return {
    overview, aiPlanning, digitalHuman, goalTracking, learningPlan, examChallenge,
    loading, error,
    fetchOverview, fetchAIPlanning, fetchDigitalHuman, fetchGoalTracking, fetchLearningPlan, fetchExamChallenge,
  }
})
