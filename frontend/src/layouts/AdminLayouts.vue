<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <aside class="w-64 bg-gray-900 text-white flex flex-col fixed h-full shadow-xl z-10">
      <div class="p-6 border-b border-gray-800 flex items-center gap-3">
        <div class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center font-bold">K</div>
        <span class="text-xl font-bold tracking-wide">KPopick Admin</span>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <p class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
        
        <router-link to="/admin/dashboard" active-class="bg-pink-600 text-white shadow-lg" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
          <span>📊</span> Dashboard
        </router-link>
        
        <router-link to="/admin/products" active-class="bg-pink-600 text-white shadow-lg" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
          <span>📦</span> Products
        </router-link>
        
        <router-link to="/admin/orders" active-class="bg-pink-600 text-white shadow-lg" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
          <span>🛍️</span> Orders
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <button @click="handleLogout" class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 ml-64 p-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/shared/stores'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  if(confirm('Are you sure you want to logout?')) {
    authStore.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>