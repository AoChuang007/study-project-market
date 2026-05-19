import dayjs from 'dayjs'

export const formatDate = (date: string | Date, fmt = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(fmt)
}

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}

export const formatPercent = (num: number): string => {
  return (num * 100).toFixed(1) + '%'
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return minutes + '分钟'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}小时${m}分钟` : `${h}小时`
}
