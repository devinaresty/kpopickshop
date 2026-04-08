<template>
  <div>
    <AdminTopbar 
      title="Customers"
    />

    <div class="p-8">
      <div v-if="isLoading" class="flex items-center justify-center py-32">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
          <p class="mt-4 text-gray-500 font-medium">Loading customers...</p>
        </div>
      </div>

      <div v-else-if="error" class="p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
        <p class="text-red-800 font-semibold mb-2">Failed to load customers</p>
        <p class="text-red-700 text-sm mb-4">{{ error }}</p>
        <button @click="fetchCustomers" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
          Try Again
        </button>
      </div>

      <div v-else>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-base font-semibold text-gray-900">Customer List</h2>
              <button @click="resetFilter" class="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium">
                Reset Filter
              </button>
            </div>

            <div class="flex gap-2">
              <input 
                v-model="filterText" 
                type="text" 
                placeholder="Search by Name, Email, or Phone..." 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr class="h-12">
                <th class="px-4 py-3 text-center">ID</th>
                <th class="px-4 py-3 text-left">Name</th>
                <th class="px-4 py-3 text-left">Email</th>
                <th class="px-4 py-3 text-left">Phone</th>
                <th class="px-4 py-3 text-left">Date</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="customer in paginatedCustomers" :key="customer.id" class="hover:bg-gray-50 transition h-12">
                <td class="px-5 py-3 align-middle text-center text-xs text-gray-500">{{ customer.id }}</td>
                <td class="px-5 py-3 align-middle text-xs font-medium text-gray-900">{{ customer.name }}</td>
                <td class="px-5 py-3 align-middle text-xs text-gray-600">{{ customer.email || '-' }}</td>
                <td class="px-5 py-3 align-middle text-xs text-gray-600">{{ customer.phone || '-' }}</td>
                <td class="px-5 py-3 align-middle text-xs text-gray-500">{{ formatDate(customer.createdAt) }}</td>
                <td class="px-5 py-3 align-middle text-center">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    Active
                  </span>
                </td>
                <td class="px-5 py-3 align-middle text-center">
                  <button @click="viewCustomerDetail(customer)" class="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="filteredCustomers.length === 0" class="p-8 text-center text-gray-500">
            No customers found
          </div>

          <div v-if="filteredCustomers.length > 0" class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            <div class="text-sm text-gray-600">
              Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredCustomers.length) }} of {{ filteredCustomers.length }} customers
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

    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Customer Details</h3>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">ID</label>
            <p class="text-sm text-gray-900">{{ selectedCustomer?.id }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Name</label>
            <p class="text-sm text-gray-900">{{ selectedCustomer?.name || '-' }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
            <p class="text-sm text-gray-900">{{ selectedCustomer?.email || '-' }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone</label>
            <p class="text-sm text-gray-900">{{ selectedCustomer?.phone || '-' }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Join Date</label>
            <p class="text-sm text-gray-900">{{ formatDate(selectedCustomer?.createdAt) }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Status</label>
            <span class="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Active
            </span>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex justify-end">
          <button 
            @click="closeViewModal"
            class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '@/core/api'
import AdminTopbar from '@/modules/admin/components/AdminTopbar.vue'

const customers = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const showViewModal = ref(false)
const selectedCustomer = ref<any>(null)

const filterText = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredCustomers = computed(() => {
  return customers.value.filter((customer: any) => {
    const matchesText = 
      filterText.value === '' ||
      (customer.name || '').toLowerCase().includes(filterText.value.toLowerCase()) ||
      (customer.email || '').toLowerCase().includes(filterText.value.toLowerCase()) ||
      (customer.phone || '').includes(filterText.value)
    
    return matchesText
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value
})

const paginatedCustomers = computed(() => {
  return filteredCustomers.value.slice(startIndex.value, endIndex.value)
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
  currentPage.value = 1
}

const viewCustomerDetail = (customer: any) => {
  selectedCustomer.value = customer
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedCustomer.value = null
}

const formatDate = (dateValue: any): string => {
  try {
    if (!dateValue) {
      console.warn('formatDate: null/undefined', dateValue)
      return '-'
    }

    if (typeof dateValue === 'object' && Object.keys(dateValue).length === 0) {
      console.warn('formatDate: empty object', dateValue)
      return '-'
    }

    if (dateValue instanceof Date) {
      const formatted = dateValue.toLocaleDateString('id-ID')
      console.log('formatDate: Date object', dateValue, '→', formatted)
      return formatted
    }

    if (typeof dateValue === 'string') {
      const cleanDate = dateValue.replace(/^"|"$/g, '').trim()
      
      const date = new Date(cleanDate)
      
      if (isNaN(date.getTime())) {
        console.warn('formatDate: invalid date string', cleanDate)
        return '-'
      }

      const formatted = date.toLocaleDateString('id-ID')
      console.log('formatDate: string', cleanDate, '→', formatted)
      return formatted
    }

    if (typeof dateValue === 'object') {
      const timestamp = dateValue.timestamp || dateValue.time || dateValue.getTime?.()
      if (timestamp) {
        const date = new Date(timestamp)
        if (!isNaN(date.getTime())) {
          const formatted = date.toLocaleDateString('id-ID')
          console.log('formatDate: object with timestamp', dateValue, '→', formatted)
          return formatted
        }
      }
      
      console.warn('formatDate: object without recognizable date', dateValue)
      return '-'
    }

    console.warn('formatDate: unexpected type', typeof dateValue, dateValue)
    return '-'
  } catch (error) {
    console.error('formatDate: exception', error, 'value:', dateValue)
    return '-'
  }
}

const fetchCustomers = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const customersRes = await apiClient.getUsers()
    customers.value = customersRes || []
    
    console.log('Customers fetched:', customersRes)
    if (customersRes && customersRes.length > 0) {
      console.log('First customer createdAt:', customersRes[0].createdAt)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to load customers: ${errorMessage}`
    console.error('Customer loading error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCustomers()
})
</script>
