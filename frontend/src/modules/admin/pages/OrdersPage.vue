<template>
  <div>
    <AdminTopbar 
      title="Orders"
    />

    <div class="p-8">
      <div v-if="isLoading" class="flex items-center justify-center py-32">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
          <p class="mt-4 text-gray-500 font-medium">Loading orders...</p>
        </div>
      </div>

      <div v-else-if="error" class="p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
        <p class="text-red-800 font-semibold mb-2">Failed to load orders</p>
        <p class="text-red-700 text-sm mb-4">{{ error }}</p>
        <button @click="fetchOrders" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
          Try Again
        </button>
      </div>

      <div v-else>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header with Filter -->
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-base font-semibold text-gray-900">Order List</h2>
              <button @click="resetFilter" class="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium">
                Reset Filter
              </button>
            </div>

            <div class="flex gap-2">
              <input 
                v-model="filterText" 
                type="text" 
                placeholder="Search by Order ID, Customer Name, or Status..." 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <select 
                v-model="filterStatus" 
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="WAITING_PAYMENT">Waiting Payment</option>
                <option value="PAID">Paid</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <!-- Orders Table -->
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr class="h-12">
                <th class="px-4 py-3 text-center">Order ID</th>
                <th class="px-4 py-3 text-left">Customer</th>
                <th class="px-4 py-3 text-left">Total</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-left">Date</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 transition h-12">
                <td class="px-5 py-3 align-middle text-center text-xs text-gray-500">{{ order.id }}</td>
                <td class="px-5 py-3 align-middle text-xs font-medium text-gray-900">{{ order.user?.name || 'Unknown' }}</td>
                <td class="px-5 py-3 align-middle text-xs font-medium text-gray-900">Rp {{ order.totalPrice?.toLocaleString('id-ID') || '-' }}</td>
                <td class="px-5 py-3 align-middle text-center">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center" :class="getStatusColor(order.status)">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-5 py-3 align-middle text-xs text-gray-500">{{ formatDate(order.createdAt) }}</td>
                <td class="px-5 py-3 align-middle text-center">
                  <select 
                    @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                    class="border border-gray-300 rounded px-2 py-0.5 text-xs bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
                    :value="order.status"
                    :disabled="isUpdatingStatus"
                  >
                    <option value="WAITING_PAYMENT">Waiting Payment</option>
                    <option value="PAID">Paid</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="filteredOrders.length === 0" class="p-8 text-center text-gray-500">
            No orders found
          </div>

          <div v-if="filteredOrders.length > 0" class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            <div class="text-sm text-gray-600">
              Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredOrders.length) }} of {{ filteredOrders.length }} orders
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="previousPage" 
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="text-sm font-medium text-gray-700 px-2">Page {{ currentPage }} of {{ totalPages }}</span>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
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

const orders = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isUpdatingStatus = ref(false)

const filterText = ref('')
const filterStatus = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredOrders = computed(() => {
  return orders.value.filter((order: any) => {
    const matchesText = 
      filterText.value === '' ||
      order.id.toString().includes(filterText.value) ||
      (order.user?.name || '').toLowerCase().includes(filterText.value.toLowerCase()) ||
      formatStatus(order.status).toLowerCase().includes(filterText.value.toLowerCase())
    
    const matchesStatus = filterStatus.value === '' || order.status === filterStatus.value
    
    return matchesText && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value
})

const paginatedOrders = computed(() => {
  return filteredOrders.value.slice(startIndex.value, endIndex.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const resetFilter = () => {
  filterText.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

const fetchOrders = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const allOrders = await apiClient.getAllOrdersAdmin()
    orders.value = allOrders || []
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to load orders: ${errorMessage}`
    console.error('Order loading error:', err)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (id: number, newStatus: string) => {
  isUpdatingStatus.value = true
  try {
    await apiClient.updateOrderStatus(id, newStatus)
    await fetchOrders()

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    error.value = `Failed to update status: ${errorMessage}`
    console.error('Status update error:', err)
  } finally {
    isUpdatingStatus.value = false
  }
}

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'WAITING_PAYMENT': 'Waiting Payment',
    'PAID': 'Paid',
    'PROCESSING': 'Processing',
    'SHIPPED': 'Shipped',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'WAITING_PAYMENT': return 'bg-red-50 text-red-700 border-red-200 border'
    case 'PAID': return 'bg-green-50 text-green-700 border-green-200 border'
    case 'PROCESSING': return 'bg-blue-50 text-blue-700 border-blue-200 border'
    case 'SHIPPED': return 'bg-green-50 text-green-700 border-green-200 border'
    case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200 border'
    case 'CANCELLED': return 'bg-orange-50 text-orange-700 border-orange-200 border'
    default: return 'bg-gray-50 text-gray-700 border-gray-200 border'
  }
}

const formatDate = (value: any): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return '-'
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return '-'
    }
    try {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return '-'
      }
      return date.toLocaleDateString('id-ID')
    } catch (error) {
      return '-'
    }
  }

  if (value instanceof Date) {
    try {
      if (isNaN(value.getTime())) {
        return '-'
      }
      return value.toLocaleDateString('id-ID')
    } catch (error) {
      return '-'
    }
  }

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return '-'
    }
    return date.toLocaleDateString('id-ID')
  } catch (error) {
    return '-'
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
