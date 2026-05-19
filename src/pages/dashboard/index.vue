<script setup lang="ts">
import { onMounted, computed, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/useDashboardStore'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import PieDistChart from '@/components/charts/PieDistChart.vue'
import BarCompareChart from '@/components/charts/BarCompareChart.vue'
import dayjs from 'dayjs'

const router = useRouter()
const store = useDashboardStore()

onMounted(() => {
  if (store.overview === null) {
    store.fetchOverview()
  }
})

const summary = computed(() => store.overview?.summary ?? [])
const activeTrend = computed(() => store.overview?.activeTrend ?? [])
const aiDistribution = computed(() => store.overview?.aiDistribution ?? [])
const digitalHumanRanking = computed(() => store.overview?.digitalHumanRanking ?? [])
const subjectHeat = computed(() => store.overview?.subjectHeat ?? [])
const realtimeActivity = computed(() => store.overview?.realtimeActivity ?? [])

const drillToUser = () => router.push('/user')
const drillToOps = () => router.push('/ops')

const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const alerts = ['系统运行正常 | 今日AI使用量 +12.5%', '实时数据同步中 | 延迟 23ms', '数字人服务在线 | 满意度 92%']
const currentAlert = ref(0)
let alertTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  alertTimer = setInterval(() => {
    currentAlert.value = (currentAlert.value + 1) % alerts.length
  }, 4000)
})

onUnmounted(() => {
  if (alertTimer) clearInterval(alertTimer)
})
</script>

<template>
  <div class="cmd-center">
    <div class="cmd-center__grid-bg" />

    <div class="cmd-center__scanline" />

    <div class="cmd-center__top-bar">
      <div class="cmd-center__top-left">
        <span class="cmd-center__dot cmd-center__dot--live" />
        <span class="cmd-center__status-text">系统在线 · 实时监控</span>
      </div>
      <div class="cmd-center__top-center">
        <div class="cmd-center__alert-marquee">
          <span class="cmd-center__alert-label">INFO</span>
          <span class="cmd-center__alert-text">{{ alerts[currentAlert] }}</span>
        </div>
      </div>
      <div class="cmd-center__top-right">
        <span class="cmd-center__clock">{{ currentTime }}</span>
      </div>
    </div>

    <header class="cmd-center__header">
      <div class="cmd-center__header-deco left" />
      <div class="cmd-center__header-content">
        <h1 class="cmd-center__title">
          <span class="cmd-center__title-icon">◇</span>
          学情大数据平台
          <span class="cmd-center__title-icon">◇</span>
        </h1>
        <p class="cmd-center__subtitle">QUANTUM COMMAND NEXUS · 智能学习数据指挥中枢</p>
      </div>
      <div class="cmd-center__header-deco right" />
    </header>

    <div class="cmd-center__metrics">
      <div
        v-for="(card, i) in summary"
        :key="i"
        class="cmd-center__metric-wrapper"
        :class="{ 'is-drillable': i < 2 }"
        @click="i < 2 ? (i === 0 ? drillToOps() : drillToUser()) : undefined"
      >
        <div class="cmd-center__metric-border" />
        <div class="cmd-center__metric-card">
          <div class="cmd-center__metric-top">
            <span class="cmd-center__metric-label">{{ card.label }}</span>
            <div class="cmd-center__sparkline">
              <svg width="48" height="20" viewBox="0 0 48 20">
                <polyline
                  fill="none"
                  stroke="#00e5ff"
                  stroke-width="1"
                  stroke-opacity="0.5"
                  :points="'0,15 8,12 16,16 24,8 32,10 40,4 48,6'"
                />
              </svg>
            </div>
          </div>
          <div class="cmd-center__metric-value">
            <span class="cmd-center__metric-num">{{ card.unit === '' ? Math.round((card.value as number) * 100) + '%' : (card.value as number) >= 10000 ? ((card.value as number) / 10000).toFixed(1) + '万' : card.value }}</span>
            <span v-if="card.unit && card.unit !== ''" class="cmd-center__metric-unit">{{ card.unit }}</span>
          </div>
          <div class="cmd-center__metric-trend">
            <span class="cmd-center__metric-arrow" :class="card.trend >= 0 ? 'is-up' : 'is-down'">
              {{ card.trend >= 0 ? '▲' : '▼' }} {{ Math.abs(card.trend * 100).toFixed(1) }}%
            </span>
            <span class="cmd-center__metric-trend-label">{{ card.trendLabel }}</span>
          </div>
        </div>
        <div v-if="i < 2" class="cmd-center__drill-hint">
          点击钻取 →
        </div>
      </div>
    </div>

    <div class="cmd-center__row cmd-center__row--two">
      <div class="cmd-center__panel">
        <div class="cmd-center__panel-border" />
        <div class="cmd-center__panel-corner tl" />
        <div class="cmd-center__panel-corner tr" />
        <div class="cmd-center__panel-corner bl" />
        <div class="cmd-center__panel-corner br" />
        <h3 class="cmd-center__panel-title">
          <span class="cmd-center__panel-dot" />
          用户活跃趋势
        </h3>
        <TrendLineChart
          :data="activeTrend"
          :loading="store.loading"
          :error="store.error"
        />
      </div>

      <div class="cmd-center__panel">
        <div class="cmd-center__panel-border" />
        <div class="cmd-center__panel-corner tl" />
        <div class="cmd-center__panel-corner tr" />
        <div class="cmd-center__panel-corner bl" />
        <div class="cmd-center__panel-corner br" />
        <h3 class="cmd-center__panel-title">
          <span class="cmd-center__panel-dot" />
          AI功能使用分布
        </h3>
        <PieDistChart
          :data="aiDistribution"
          type="ring"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>

    <div class="cmd-center__row cmd-center__row--three">
      <div class="cmd-center__panel">
        <div class="cmd-center__panel-border" />
        <div class="cmd-center__panel-corner tl" />
        <div class="cmd-center__panel-corner tr" />
        <div class="cmd-center__panel-corner bl" />
        <div class="cmd-center__panel-corner br" />
        <h3 class="cmd-center__panel-title">
          <span class="cmd-center__panel-dot" />
          数字人会话排行
        </h3>
        <BarCompareChart
          :data="digitalHumanRanking.map(r => ({ name: r.name, count: r.value, ratio: 0 }))"
          :loading="store.loading"
          :error="store.error"
        />
      </div>

      <div class="cmd-center__panel">
        <div class="cmd-center__panel-border" />
        <div class="cmd-center__panel-corner tl" />
        <div class="cmd-center__panel-corner tr" />
        <div class="cmd-center__panel-corner bl" />
        <div class="cmd-center__panel-corner br" />
        <h3 class="cmd-center__panel-title">
          <span class="cmd-center__panel-dot" />
          学科答题热度
        </h3>
        <PieDistChart
          :data="subjectHeat"
          type="pie"
          :loading="store.loading"
          :error="store.error"
        />
      </div>

      <div class="cmd-center__panel">
        <div class="cmd-center__panel-border" />
        <div class="cmd-center__panel-corner tl" />
        <div class="cmd-center__panel-corner tr" />
        <div class="cmd-center__panel-corner bl" />
        <div class="cmd-center__panel-corner br" />
        <h3 class="cmd-center__panel-title">
          <span class="cmd-center__panel-dot" />
          今日实时活跃
        </h3>
        <TrendLineChart
          :data="realtimeActivity"
          :loading="store.loading"
          :error="store.error"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cmd-center {
  position: relative;
  min-height: 100%;
  color: $dark-text-primary;
  z-index: 1;

  &__grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  }

  &__scanline {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 229, 255, 0.008) 2px,
      rgba(0, 229, 255, 0.008) 4px
    );
  }

  // 顶部状态栏
  &__top-bar {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 24px;
    margin-bottom: 32px;
    background: rgba(0, 229, 255, 0.04);
    border: 1px solid rgba(0, 229, 255, 0.12);
    border-radius: $border-radius-sm;
    font-size: 12px;
    font-family: 'Courier New', monospace;
  }

  &__top-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #00e5ff;
    box-shadow: 0 0 6px #00e5ff;

    &--live {
      animation: cmd-breathe 2s ease-in-out infinite;
    }
  }

  &__status-text {
    color: rgba(0, 229, 255, 0.8);
    letter-spacing: 1px;
  }

  &__top-center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &__alert-marquee {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 16px;
    background: rgba(0, 229, 255, 0.06);
    border: 1px solid rgba(0, 229, 255, 0.15);
    border-radius: 2px;
  }

  &__alert-label {
    color: #00e5ff;
    font-size: 10px;
    padding: 2px 6px;
    border: 1px solid #00e5ff;
    border-radius: 1px;
    letter-spacing: 1px;
  }

  &__alert-text {
    color: rgba(0, 229, 255, 0.7);
    letter-spacing: 0.5px;
  }

  &__top-right {
    color: rgba(0, 229, 255, 0.6);
  }

  &__clock {
    letter-spacing: 2px;
    font-variant-numeric: tabular-nums;
  }

  // Header
  &__header {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }

  &__header-deco {
    width: 80px;
    height: 1px;

    &.left {
      background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5));
    }
    &.right {
      background: linear-gradient(90deg, rgba(0, 229, 255, 0.5), transparent);
    }
  }

  &__header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__title {
    font-size: 32px;
    font-weight: 200;
    letter-spacing: 12px;
    color: #e0e6f0;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 16px;
    text-shadow: 0 0 40px rgba(0, 229, 255, 0.3);
  }

  &__title-icon {
    color: #00e5ff;
    font-size: 12px;
    animation: cmd-icon-pulse 3s ease-in-out infinite;

    &:last-child { animation-delay: 1.5s; }
  }

  &__subtitle {
    font-size: 10px;
    color: rgba(0, 229, 255, 0.5);
    letter-spacing: 6px;
    text-transform: uppercase;
    font-family: 'Courier New', monospace;
    margin: 0;
  }

  // 指标卡区域
  &__metrics {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  &__metric-wrapper {
    position: relative;
    cursor: default;

    &.is-drillable {
      cursor: pointer;

      &:hover .cmd-center__metric-border {
        opacity: 1;
        animation: cmd-border-rotate 3s linear infinite;
      }

      &:hover .cmd-center__drill-hint {
        opacity: 1;
      }
    }
  }

  &__metric-border {
    position: absolute;
    inset: -1px;
    border-radius: $border-radius-md;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.3), transparent 50%, rgba(0, 229, 255, 0.15));
    opacity: 0.4;
    z-index: 0;
    transition: opacity 0.4s;
  }

  &__metric-card {
    position: relative;
    z-index: 1;
    background: linear-gradient(180deg, rgba(2, 9, 28, 0.95), rgba(6, 15, 45, 0.85));
    border-radius: $border-radius-md;
    padding: 20px 24px;
    backdrop-filter: blur(20px);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.4), transparent);
    }
  }

  &__metric-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__metric-label {
    font-size: 12px;
    color: $dark-text-secondary;
    letter-spacing: 1px;
  }

  &__sparkline {
    opacity: 0.5;
  }

  &__metric-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 10px;
  }

  &__metric-num {
    font-size: 32px;
    font-weight: 300;
    color: $dark-text-primary;
    font-family: 'DIN Alternate', 'Courier New', monospace;
    letter-spacing: 1px;
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
  }

  &__metric-unit {
    font-size: 13px;
    color: $dark-text-secondary;
    letter-spacing: 1px;
  }

  &__metric-trend {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
  }

  &__metric-arrow {
    &.is-up { color: #00e5ff; }
    &.is-down { color: $color-danger; }
  }

  &__metric-trend-label {
    color: $dark-text-secondary;
  }

  &__drill-hint {
    position: absolute;
    bottom: -22px;
    right: 4px;
    font-size: 10px;
    color: rgba(0, 229, 255, 0.5);
    opacity: 0;
    transition: opacity 0.3s;
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }

  // 面板通用
  &__row {
    position: relative;
    z-index: 2;
    display: grid;
    gap: 20px;
    margin-bottom: 20px;

    &--two { grid-template-columns: 1fr 1fr; }
    &--three { grid-template-columns: 1fr 1fr 1fr; }
  }

  &__panel {
    position: relative;
    background: linear-gradient(180deg, rgba(2, 9, 28, 0.9), rgba(6, 15, 45, 0.8));
    border-radius: $border-radius-lg;
    padding: 24px;
    backdrop-filter: blur(20px);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
      z-index: 2;
    }
  }

  &__panel-border {
    position: absolute;
    inset: 0;
    border-radius: $border-radius-lg;
    padding: 1px;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), transparent 40%, rgba(0, 229, 255, 0.08));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &__panel-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 3;
    pointer-events: none;

    &.tl { top: 0; left: 0; border-top: 1px solid rgba(0, 229, 255, 0.4); border-left: 1px solid rgba(0, 229, 255, 0.4); border-radius: 4px 0 0 0; }
    &.tr { top: 0; right: 0; border-top: 1px solid rgba(0, 229, 255, 0.4); border-right: 1px solid rgba(0, 229, 255, 0.4); border-radius: 0 4px 0 0; }
    &.bl { bottom: 0; left: 0; border-bottom: 1px solid rgba(0, 229, 255, 0.4); border-left: 1px solid rgba(0, 229, 255, 0.4); border-radius: 0 0 0 4px; }
    &.br { bottom: 0; right: 0; border-bottom: 1px solid rgba(0, 229, 255, 0.4); border-right: 1px solid rgba(0, 229, 255, 0.4); border-radius: 0 0 4px 0; }
  }

  &__panel-title {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 229, 255, 0.8);
    margin: 0 0 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(0, 229, 255, 0.1);
    letter-spacing: 1px;
  }

  &__panel-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00e5ff;
    box-shadow: 0 0 8px #00e5ff;
    animation: cmd-breathe 2s ease-in-out infinite;
  }
}

@keyframes cmd-breathe {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px #00e5ff; }
  50% { opacity: 0.4; box-shadow: 0 0 12px #00e5ff; }
}

@keyframes cmd-icon-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes cmd-border-rotate {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}
</style>
