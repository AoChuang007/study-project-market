import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'
import type {
  IUserOverview,
  IAIPlanningData,
  IDigitalHumanData,
  IGoalTrackingData,
  ILearningPlanData,
  IExamChallengeData,
} from '@/types'
import { apiService } from '@/api'
import { useFilterStore } from '@/stores/useFilterStore'

type TNullable<T> = Ref<T | null>

const createNullableRef = <T>() => ref<T | null>(null) as TNullable<T>

export const useUserStore = defineStore('user', () => {
  const filterStore = useFilterStore()

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
    const result = await withLoading(() => apiService.getUserOverview(filterStore.apiParams))
    if (result !== null) overview.value = result
  }

  const fetchAIPlanning = async () => {
    const result = await withLoading(() => apiService.getAIPlanningData(filterStore.apiParams))
    if (result !== null) aiPlanning.value = result
  }

  const fetchDigitalHuman = async () => {
    const result = await withLoading(() => apiService.getDigitalHumanData(filterStore.apiParams))
    if (result !== null) digitalHuman.value = result
  }

  const fetchGoalTracking = async () => {
    const result = await withLoading(() => apiService.getGoalTrackingData(filterStore.apiParams))
    if (result !== null) goalTracking.value = result
  }

  const fetchLearningPlan = async () => {
    const result = await withLoading(() => apiService.getLearningPlanData(filterStore.apiParams))
    if (result !== null) learningPlan.value = result
  }

  const fetchExamChallenge = async () => {
    const result = await withLoading(() => apiService.getExamChallengeData(filterStore.apiParams))
    if (result !== null) examChallenge.value = result
  }

  /** 筛选器变化时，重取所有已加载模块的数据 */
  watch(() => filterStore.apiParams, () => {
    if (overview.value !== null) fetchOverview()
    if (aiPlanning.value !== null) fetchAIPlanning()
    if (digitalHuman.value !== null) fetchDigitalHuman()
    if (goalTracking.value !== null) fetchGoalTracking()
    if (learningPlan.value !== null) fetchLearningPlan()
    if (examChallenge.value !== null) fetchExamChallenge()
  }, { deep: true })

  return {
    overview, aiPlanning, digitalHuman, goalTracking, learningPlan, examChallenge,
    loading, error,
    fetchOverview, fetchAIPlanning, fetchDigitalHuman, fetchGoalTracking, fetchLearningPlan, fetchExamChallenge,
  }
})
