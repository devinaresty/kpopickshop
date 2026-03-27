import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isCartSidebarOpen = ref(false)

  const openCartSidebar = () => {
    isCartSidebarOpen.value = true
  }

  const closeCartSidebar = () => {
    isCartSidebarOpen.value = false
  }

  const toggleCartSidebar = () => {
    isCartSidebarOpen.value = !isCartSidebarOpen.value
  }

  return {
    isCartSidebarOpen,
    openCartSidebar,
    closeCartSidebar,
    toggleCartSidebar
  }
})
