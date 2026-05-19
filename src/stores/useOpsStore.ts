import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type {
  IOpsDashboard,
  IDauData,
  IRetentionData,
  IConversionData,
  ISatisfactionData,
} from '@/types'
import { apiService } from '@/api'

type TNullable<T> = Ref<T | null>

const createNullableRef = <T>() => ref<T | null>(null) as TNullable<T>

export const useOpsStore = defineStore('ops', () => {
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
    const result = await withLoading(() => apiService.getOpsDashboard({} as Record<string, never> as never))
    if (result !== null) dashboard.value = result
  }

  const fetchDau = async () => {
    const result = await withLoading(() => apiService.getDauData({} as Record<string, never> as never))
    if (result !== null) dau.value = result
  }

  const fetchRetention = async () => {
    const result = await withLoading(() => apiService.getRetentionData({} as Record<string, never> as never))
    if (result !== null) retention.value = result
  }

  const fetchConversion = async () => {
    const result = await withLoading(() => apiService.getConversionData({} as Record<string, never> as never))
    if (result !== null) conversion.value = result
  }

  const fetchSatisfaction = async () => {
    const result = await withLoading(() => apiService.getSatisfactionData({} as Record<string, never> as never))
    if (result !== null) satisfaction.value = result
  }

  return {
    dashboard, dau, retention, conversion, satisfaction,
    loading, error,
    fetchDashboard, fetchDau, fetchRetention, fetchConversion, fetchSatisfaction,
  }
})
