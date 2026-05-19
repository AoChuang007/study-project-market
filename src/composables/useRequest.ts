import { ref } from 'vue'

export const useRequest = <T>(
  fetcher: (...args: unknown[]) => Promise<T>
) => {
  const data = ref<T | null>(null) as ReturnType<typeof ref<T | null>>
  const loading = ref(false)
  const error = ref<string | null>(null)
  let requestId = 0

  const execute = async (...args: unknown[]) => {
    const id = ++requestId
    loading.value = true
    error.value = null
    try {
      const result = await fetcher(...args)
      if (id === requestId) {
        data.value = result
      }
    } catch (e) {
      if (id === requestId) {
        error.value = e instanceof Error ? e.message : '数据加载失败'
      }
    } finally {
      if (id === requestId) {
        loading.value = false
      }
    }
  }

  return { data, loading, error, execute }
}
