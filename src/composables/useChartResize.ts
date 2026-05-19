import { ref, onMounted, onUnmounted } from 'vue'

export const useChartResize = () => {
  const chartRef = ref<HTMLElement | null>(null)
  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (chartRef.value) {
      observer = new ResizeObserver(() => {
        const event = new Event('resize')
        chartRef.value?.dispatchEvent(event)
      })
      observer.observe(chartRef.value)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { chartRef }
}
