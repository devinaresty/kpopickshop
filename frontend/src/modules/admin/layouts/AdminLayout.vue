<template>
  <div class="min-h-screen bg-gray-100 flex font-sans">
    <aside class="w-64 bg-white flex flex-col fixed h-full shadow-lg z-10 border-r border-gray-200">
      <div class="h-16 px-5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-white to-gray-50">
        <img src="/logo (5).png" alt="KPopick Logo" class="w-10 h-10 object-contain flex-shrink-0" />
        <span class="text-base font-bold text-gray-900 tracking-tight">KPopick Admin</span>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <p class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</p>
        
        <router-link 
          to="/admin/dashboard" 
          active-class="bg-gray-100 text-gray-900 border-l-4 border-gray-900" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-l-4 border-transparent text-sm font-medium"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4" />
          </svg>
          <span>Dashboard</span>
        </router-link>
        
        <router-link 
          to="/admin/products" 
          active-class="bg-gray-100 text-gray-900 border-l-4 border-gray-900" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-l-4 border-transparent text-sm font-medium"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span>Products</span>
        </router-link>
        
        <router-link 
          to="/admin/categories" 
          active-class="bg-gray-100 text-gray-900 border-l-4 border-gray-900" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-l-4 border-transparent text-sm font-medium"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span>Categories</span>
        </router-link>
        
        <router-link 
          to="/admin/orders" 
          active-class="bg-gray-100 text-gray-900 border-l-4 border-gray-900" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-l-4 border-transparent text-sm font-medium"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Orders</span>
        </router-link>

        <router-link 
          to="/admin/customers" 
          active-class="bg-gray-100 text-gray-900 border-l-4 border-gray-900" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-l-4 border-transparent text-sm font-medium"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <span>Customers</span>
        </router-link>
      </nav>

      <div class="p-3 border-t border-gray-100 bg-gray-50">
        <button 
          @click="openLogoutModal" 
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Confirm Logout</h3>
        </div>

        <div class="p-6">
          <p class="text-gray-700 text-sm">
            Are you sure you want to logout from your admin account?
          </p>
        </div>

        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button 
            @click="closeLogoutModal" 
            class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmLogout" 
            class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <main class="flex-1 ml-64 pt-16">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/shared/stores'

const authStore = useAuthStore()

const showLogoutModal = ref(false)

const openLogoutModal = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const confirmLogout = () => {
  authStore.logout()
  closeLogoutModal()
  window.location.href = '/admin/login'
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>
