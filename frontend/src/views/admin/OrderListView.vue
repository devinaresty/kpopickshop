<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p class="mt-4 text-gray-500">Loading orders...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
      <p class="text-red-700 font-medium">{{ error }}</p>
      <button @click="fetchOrders" class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
        Try Again
      </button>
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
          <tr>
            <th class="p-4 border-b">Order ID</th>
            <th class="p-4 border-b">Customer</th>
            <th class="p-4 border-b">Total</th>
            <th class="p-4 border-b">Status</th>
            <th class="p-4 border-b">Date</th>
            <th class="p-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="p-4 font-mono text-xs text-gray-500">#{{ order.id }}</td>
            <td class="p-4 font-medium">{{ order.user?.name || 'Unknown' }}</td>
            <td class="p-4 font-bold">Rp {{ order.totalPrice?.toLocaleString('id-ID') || '-' }}</td>
            <td class="p-4">
              <span class="px-2 py-1 rounded text-xs font-bold" :class="getStatusColor(order.status)">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td class="p-4 text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
            <td class="p-4">
              <select 
                @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                class="border rounded px-2 py-1 text-xs bg-white cursor-pointer hover:border-black disabled:opacity-50"
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
      
      <div v-if="orders.length === 0" class="p-8 text-center text-gray-500">
        No orders found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/lib/api'

const orders = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isUpdatingStatus = ref(false)
const successMessage = ref<string | null>(null)

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
    successMessage.value = 'Order status updated successfully!'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
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
    case 'WAITING_PAYMENT': return 'bg-yellow-100 text-yellow-800'
    case 'PAID': return 'bg-blue-100 text-blue-800'
    case 'PROCESSING': return 'bg-purple-100 text-purple-800'
    case 'SHIPPED': return 'bg-indigo-100 text-indigo-800'
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'CANCELLED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('id-ID')
  } catch {
    return '-'
  }
}

onMounted(() => {
  fetchOrders()
})
</script>