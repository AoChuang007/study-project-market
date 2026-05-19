<script setup lang="ts">
import { computed, onErrorCaptured, ref } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ContentLayout from '@/components/layout/ContentLayout.vue'

const route = useRoute()
const hasError = ref(false)

const layout = computed(() => {
  return (route.meta?.layout as string) === 'dashboard' ? 'dashboard' : 'content'
})

onErrorCaptured((err) => {
  console.error('全局异常捕获:', err)
  hasError.value = true
  return false
})
</script>

<template>
  <div v-if="hasError" class="app-error">
    <h2>应用出现异常</h2>
    <el-button type="primary" @click="hasError = false">刷新页面</el-button>
  </div>
  <DashboardLayout v-else-if="layout === 'dashboard'">
    <router-view />
  </DashboardLayout>
  <ContentLayout v-else>
    <router-view />
  </ContentLayout>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.app-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
  color: #303133;

  h2 { font-size: 20px; }
}
</style>
