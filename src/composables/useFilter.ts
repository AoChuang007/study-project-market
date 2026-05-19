import { debounce } from 'lodash-es'
import { type Ref, watch } from 'vue'

export const useFilter = (
  params: Ref<Record<string, unknown>>,
  callback: () => void
) => {
  const debouncedCallback = debounce(callback, 300)

  watch(params, () => {
    debouncedCallback()
  }, { deep: true })

  return { refresh: callback }
}
