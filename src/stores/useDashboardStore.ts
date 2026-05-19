import { defineStore } from 'pinia'
import type { IDashboardOverview } from '@/types'
import { apiService } from '@/api'
import { useRequest } from '@/composables/useRequest'

export const useDashboardStore = defineStore('dashboard', () => {
  const { data, loading, error, execute } = useRequest<IDashboardOverview>(
    () => apiService.getDashboardOverview()
  )

  return {
    overview: data,
    loading,
    error,
    fetchOverview: execute,
  }
})
