<template>
  <div>
    <AdminTopbar 
      title="Dashboard"
    />
    
    <div class="p-6">
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400"></div>
        <p class="mt-3 text-gray-500 font-medium text-sm">Loading dashboard data...</p>
      </div>
    </div>

    <div v-else-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-800 font-semibold mb-2 text-sm">Failed to load dashboard data</p>
      <p class="text-red-700 text-xs mb-3">{{ error }}</p>
      <button @click="loadDashboardData" class="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors font-medium">
        Try Again
      </button>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="relative overflow-hidden bg-gradient-to-br from-black to-gray-700 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-gray-600 opacity-20 rounded-full"></div>
          <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-gray-500 opacity-20 rounded-full"></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-gray-200 text-sm font-semibold uppercase tracking-wider mb-1">Total Products</p>
                <p class="text-4xl font-bold">{{ productsCount }}</p>
              </div>
              <div class="p-3 bg-gray-600 bg-opacity-30 backdrop-blur-sm rounded-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <p class="text-gray-300 text-xs">Managed inventory</p>
          </div>
        </div>

        <div class="relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-500 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-gray-600 opacity-20 rounded-full"></div>
          <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-gray-500 opacity-20 rounded-full"></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-gray-100 text-sm font-semibold uppercase tracking-wider mb-1">Total Orders</p>
                <p class="text-4xl font-bold">{{ ordersCount }}</p>
              </div>
              <div class="p-3 bg-gray-500 bg-opacity-30 backdrop-blur-sm rounded-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-200 text-xs">All time transactions</p>
          </div>
        </div>

        <div class="relative overflow-hidden bg-gradient-to-br from-gray-600 to-gray-400 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-gray-500 opacity-20 rounded-full"></div>
          <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-gray-400 opacity-20 rounded-full"></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-gray-100 text-sm font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
                <p class="text-3xl font-bold">Rp {{ formattedRevenue }}</p>
              </div>
              <div class="p-3 bg-gray-500 bg-opacity-30 backdrop-blur-sm rounded-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-100 text-xs">Completed transactions</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-gradient-to-br from-gray-800 to-black rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Product Sales Analytics</h3>
        </div>

        <div class="grid grid-cols-12 gap-3 mb-3 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="col-span-1">
            <p class="text-xs font-bold text-gray-700">#</p>
          </div>
          <div class="col-span-1">
            <p class="text-xs font-bold text-gray-700">Photo</p>
          </div>
          <div class="col-span-4">
            <p class="text-xs font-bold text-gray-700">Product Name</p>
          </div>
          <div class="col-span-2 text-right">
            <p class="text-xs font-bold text-gray-700">Units</p>
          </div>
          <div class="col-span-2 text-right">
            <p class="text-xs font-bold text-gray-700">Share</p>
          </div>
          <div class="col-span-2 text-right">
            <p class="text-xs font-bold text-gray-700">Revenue</p>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div 
            v-for="(product, idx) in (topProducts.length > 0 ? topProducts : placeholderProducts)" 
            :key="idx"
            :class="[
              'grid grid-cols-12 gap-3 px-4 py-3 rounded-lg border transition-all duration-300',
              topProducts.length > 0 
                ? 'bg-white border-gray-200 hover:shadow-md hover:border-gray-400' 
                : 'bg-gray-100 border-gray-300 opacity-60'
            ]"
          >
            <div class="col-span-1 flex items-center">
              <span class="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full" :class="[
                topProducts.length > 0 
                  ? 'bg-gradient-to-br from-gray-800 to-black text-white'
                  : 'bg-gray-300 text-gray-500'
              ]">
                {{ idx + 1 }}
              </span>
            </div>

            <div class="col-span-1 flex items-center">
              <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                <img 
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="col-span-4 flex items-center">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</p>
            </div>

            <div class="col-span-2 flex items-center justify-end">
              <p class="text-sm font-bold text-gray-900">{{ product.soldCount }}</p>
            </div>

            <div class="col-span-2 flex items-center justify-end">
              <div class="flex items-center gap-2 w-full">
                <div class="flex-1 min-w-0">
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-300"
                      :style="{ 
                        width: totalUnitsSold > 0 ? (product.soldCount / totalUnitsSold) * 100 + '%' : '0%',
                        backgroundColor: getProductBarColor(idx)
                      }"
                    ></div>
                  </div>
                </div>
                <p class="text-xs font-bold text-gray-700 w-8 text-right">{{ getProductPercentage(product.soldCount) }}%</p>
              </div>
            </div>

            <div class="col-span-2 flex items-center justify-end">
              <p class="text-sm font-semibold text-gray-800">{{ formatCurrency(calculateProductRevenue(product.id)) }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-3 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-sm">
          <div class="col-span-1"></div>
          <div class="col-span-1"></div>
          <div class="col-span-4">
            <p class="text-xs font-bold text-white">Total</p>
          </div>
          <div class="col-span-2 text-right">
            <p class="text-xs font-bold text-white">{{ totalUnitsSold }}</p>
          </div>
          <div class="col-span-2 text-right">
            <p class="text-xs font-bold text-white">100%</p>
          </div>
          <div class="col-span-2 text-right">
            <p class="text-xs font-bold text-white">{{ formatCurrency(totalProductsRevenue) }}</p>
          </div>
        </div>

        <div v-if="topProducts.length === 0" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-blue-800"><span class="font-semibold">Tip:</span> Sales data will appear here once customers place orders with products</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '@/core/api'
import AdminTopbar from '@/modules/admin/components/AdminTopbar.vue'

const productsCount = ref(0)
const ordersCount = ref(0)
const revenue = ref(0)
const isLoading = ref(true)
const error = ref<string | null>(null)
const topProducts = ref<any[]>([])

const placeholderProducts = ref<any[]>([
  { id: 1, name: 'Premium Album Collection', soldCount: 0, imageUrl: '' },
  { id: 2, name: 'Official Lightstick Ver 4', soldCount: 0, imageUrl: '' },
  { id: 3, name: 'BTS Poster Set', soldCount: 0, imageUrl: '' },
  { id: 4, name: 'Limited Edition Merchandise', soldCount: 0, imageUrl: '' },
  { id: 5, name: 'Exclusive Photo Card Pack', soldCount: 0, imageUrl: '' },
  { id: 6, name: 'Concert DVD Collection', soldCount: 0, imageUrl: '' },
])

const formattedRevenue = computed(() => {
  return revenue.value.toLocaleString('id-ID')
})

const totalUnitsSold = computed(() => {
  return topProducts.value.reduce((sum, p) => sum + p.soldCount, 0)
})

const totalProductsRevenue = computed(() => {
  return topProducts.value.reduce((sum, product) => {
    return sum + calculateProductRevenue(product.id)
  }, 0)
})

const getProductPercentage = (soldCount: number): number => {
  if (totalUnitsSold.value === 0) return 0
  return Math.round((soldCount / totalUnitsSold.value) * 100)
}

const getProductBarColor = (index: number): string => {
  const colors: string[] = [
    '#000000', 
    '#1a1a1a', 
    '#2d2d2d', 
    '#404040', 
    '#525252', 
    '#6b6b6b'  
  ]
  return colors[index % colors.length] || '#000000'
}

const calculateProductRevenue = (productId: number): number => {
  const product = topProducts.value.find(p => p.id === productId) || 
                  placeholderProducts.value.find(p => p.id === productId)
  if (!product) return 0
  const avgPricePerUnit = totalUnitsSold.value > 0 ? revenue.value / totalUnitsSold.value : 0
  return Math.round(product.soldCount * avgPricePerUnit)
}

const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'Rp 0'
  if (amount >= 1000000) {
    return 'Rp ' + Math.round(amount / 1000000) + 'M'
  }
  return 'Rp ' + Math.round(amount / 1000) + 'K'
}

const loadDashboardData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const prods = await apiClient.getProducts(0, 1)
    productsCount.value = prods.total || 0

    const orders = await apiClient.getAllOrdersAdmin()
    ordersCount.value = orders.length
    
    revenue.value = orders
      .filter((o: any) => {
        const hasAmount = o.totalPrice
        return hasAmount !== undefined && hasAmount !== null && hasAmount > 0
      })
      .reduce((sum: number, o: any) => {
        const amount = o.totalPrice || 0
        return sum + (typeof amount === 'number' ? amount : 0)
      }, 0)

    console.log('Orders loaded:', orders.length, 'Total revenue calculated:', revenue.value)

    const productSalesMap = new Map<number, { id: number; name: string; soldCount: number; imageUrl?: string }>()
    
    orders.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productId = item.productId || item.product?.id
          const productName = item.product?.name || item.productName || `Product ${productId}`
          const imageUrl = item.product?.imageUrl || item.imageUrl
          const quantity = item.quantity || 0
          
          if (productId) {
            if (productSalesMap.has(productId)) {
              const existing = productSalesMap.get(productId)!
              existing.soldCount += quantity
            } else {
              productSalesMap.set(productId, {
                id: productId,
                name: productName,
                soldCount: quantity,
                imageUrl: imageUrl
              })
            }
          }
        })
      }
    })
    
    topProducts.value = Array.from(productSalesMap.values())
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 6)

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
