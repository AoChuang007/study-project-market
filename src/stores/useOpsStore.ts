import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'
import type {
  IOpsDashboard,
  IDauData,
  IRetentionData,
  IConversionData,
  ISatisfactionData,
} from '@/types'
import { apiService } from '@/api'
import { useFilterStore } from '@/stores/useFilterStore'

type TNullable<T> = Ref<T | null>

const createNullableRef = <T>() => ref<T | null>(null) as TNullable<T>

export const useOpsStore = defineStore('ops', () => {
  const filterStore = useFilterStore()

  const dashboard = createNullableRef<IOpsDashboard>()
  const dau = createNullableRef<IDauData>()
  const retention = createNullableRef<IRetentionData>()
  const conversion = createNullableRef<IConversionData>()
  const satisfaction = createNullableRef<ISatisfactionData>()

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

  const fetchDashboard = async () => {
    const result = await withLoading(() => apiService.getOpsDashboard(filterStore.apiParams))
    if (result !== null) dashboard.value = result
  }

  const fetchDau = async () => {
    const result = await withLoading(() => apiService.getDauData(filterStore.apiParams))
    if (result !== null) dau.value = result
  }

  const fetchRetention = async () => {
    const result = await withLoading(() => apiService.getRetentionData(filterStore.apiParams))
    if (result !== null) retention.value = result
  }

  const fetchConversion = async () => {
    const result = await withLoading(() => apiService.getConversionData(filterStore.apiParams))
    if (result !== null) conversion.value = result
  }

  const fetchSatisfaction = async () => {
    const result = await withLoading(() => apiService.getSatisfactionData(filterStore.apiParams))
    if (result !== null) satisfaction.value = result
  }

  /** 筛选器变化时，重取所有已加载模块的数据 */
  watch(() => filterStore.apiParams, () => {
    if (dashboard.value !== null) fetchDashboard()
    if (dau.value !== null) fetchDau()
    if (retention.value !== null) fetchRetention()
    if (conversion.value !== null) fetchConversion()
    if (satisfaction.value !== null) fetchSatisfaction()
  }, { deep: true })

  return {
    dashboard, dau, retention, conversion, satisfaction,
    loading, error,
    fetchDashboard, fetchDau, fetchRetention, fetchConversion, fetchSatisfaction,
  }
})
