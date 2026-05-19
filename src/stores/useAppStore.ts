import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TRole } from '@/types'

export const useAppStore = defineStore('app', () => {
  const currentRole = ref<TRole>('user')
  const sidebarCollapsed = ref(false)

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setRole = (role: TRole) => {
    currentRole.value = role
  }

  return {
    currentRole,
    sidebarCollapsed,
    toggleSidebar,
    setRole,
  }
})
