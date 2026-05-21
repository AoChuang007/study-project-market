import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import type { IFilterParams } from '@/api/types/service'

/** 将日期范围字符串转为起止日期元组 */
function resolveDateRange(range: string): [string, string] {
  const today = dayjs()
  const format = 'YYYY-MM-DD'

  switch (range) {
    case 'today':
      return [today.format(format), today.format(format)]
    case '7d':
      return [today.subtract(7, 'day').format(format), today.format(format)]
    case '30d':
      return [today.subtract(30, 'day').format(format), today.format(format)]
    case '90d':
      return [today.subtract(90, 'day').format(format), today.format(format)]
    default:
      return [today.subtract(7, 'day').format(format), today.format(format)]
  }
}

export const useFilterStore = defineStore('filter', () => {
  const route = useRoute()

  const filters = ref({
    dateRange: '7d',
    grade: '',
    subject: '',
  })

  /** 当前路由下应显示的筛选器列表 */
  const visibleFilters = computed(() => {
    if (route.path.startsWith('/user')) {
      return ['dateRange', 'grade', 'subject']
    }
    return ['dateRange']
  })

  /** 转换为 IFilterParams 格式，供 API 调用使用 */
  const apiParams = computed<IFilterParams>(() => ({
    dateRange: resolveDateRange(filters.value.dateRange),
    grade: filters.value.grade,
    subject: filters.value.subject,
  }))

  return {
    filters,
    visibleFilters,
    apiParams,
  }
})
