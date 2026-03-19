<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <p class="mt-4 text-gray-500">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700 font-medium">Failed to load dashboard data</p>
      <p class="text-red-600 text-sm mt-1">{{ error }}</p>
      <button @click="loadDashboardData" class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
        Try Again
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="p-4 bg-blue-100 text-blue-600 rounded-full text-2xl">📦</div>
          <div>
            <p class="text-sm text-gray-500">Total Products</p>
            <p class="text-2xl font-bold">{{ productsCount }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="p-4 bg-green-100 text-green-600 rounded-full text-2xl">🛍️</div>
          <div>
            <p class="text-sm text-gray-500">Total Orders</p>
            <p class="text-2xl font-bold">{{ ordersCount }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="p-4 bg-purple-100 text-purple-600 rounded-full text-2xl">💰</div>
          <div>
            <p class="text-sm text-gray-500">Estimated Revenue</p>
            <p class="text-2xl font-bold">Rp {{ revenue.toLocaleString('id-ID') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-20">
        <p class="text-gray-400 text-lg">More charts and analytics coming soon!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/lib/api'

const productsCount = ref(0)
const ordersCount = ref(0)
const revenue = ref(0)
const isLoading = ref(true)
const error = ref<string | null>(null)

const loadDashboardData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch products count
    const prods = await apiClient.getProducts(0, 1)
    productsCount.value = prods.total || 0

    // Fetch all orders (admin endpoint)
    const orders = await apiClient.getAllOrdersAdmin()
    ordersCount.value = orders.length
    
    // Calculate total revenue from paid/completed orders
    revenue.value = orders
      .filter((o: any) => o.grandTotal && ['PAID', 'COMPLETED', 'SHIPPED'].includes(o.status))
      .reduce((sum: number, o: any) => sum + (o.grandTotal || 0), 0)

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to load dashboard: ${errorMessage}`
    console.error('Dashboard data loading error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>