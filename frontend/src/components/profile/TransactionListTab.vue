<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-xl font-bold text-black">{{ i18nStore.t('transaction.title') }}</h3>
    </div>

    <div class="p-6">
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>

      <div v-else-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ errorMessage }}
      </div>

      <div v-else-if="transactions.length === 0" class="text-center py-12">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-600 font-medium">{{ i18nStore.t('transaction.emptyMessage') }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ i18nStore.t('transaction.emptySubtitle') }}</p>
      </div>

      <div v-else class="space-y-4">
        <div class="mb-6 flex gap-3">
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 font-medium"
          >
            <option value="">{{ i18nStore.t('transaction.allStatus') }}</option>
            <option value="PENDING">{{ i18nStore.t('transaction.pending') }}</option>
            <option value="SUCCESS">{{ i18nStore.t('transaction.success') }}</option>
            <option value="FAILED">{{ i18nStore.t('transaction.failed') }}</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">{{ i18nStore.t('transaction.orderId') }}</th>
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">{{ i18nStore.t('transaction.amount') }}</th>
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">{{ i18nStore.t('transaction.paymentMethod') }}</th>
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">{{ i18nStore.t('transaction.status') }}</th>
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">{{ i18nStore.t('transaction.date') }}</th>
                <th class="px-4 py-3 text-center text-sm font-bold text-gray-700">{{ i18nStore.t('transaction.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="border-b border-gray-200 hover:bg-gray-50 transition">
                <td class="px-4 py-4 font-medium text-gray-900">#{{ transaction.orderId }}</td>
                <td class="px-4 py-4 text-gray-900 font-semibold">
                  {{ formatCurrency(transaction.amount) }}
                </td>
                <td class="px-4 py-4 text-gray-700">
                  {{ transaction.paymentMethod || '-' }}
                </td>
                <td class="px-4 py-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold"
                    :class="{
                      'bg-yellow-100 text-yellow-800': transaction.status === 'PENDING',
                      'bg-green-100 text-green-800': transaction.status === 'SUCCESS',
                      'bg-red-100 text-red-800': transaction.status === 'FAILED',
                    }"
                  >
                    {{ getStatusLabel(transaction.status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-gray-700 text-sm">
                  {{ formatDate(transaction.createdAt) }}
                </td>
                <td class="px-4 py-4 text-center">
                  <button
                    @click="viewDetails(transaction)"
                    class="text-sm font-semibold text-black hover:text-gray-700 transition"
                  >
                    {{ i18nStore.t('transaction.view') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredTransactions.length > 0" class="mt-6 flex justify-center gap-2">
          <button 
            @click="goToPrevious"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← {{ i18nStore.t('common.previous') }}
          </button>
          
          <button 
            v-for="page in visiblePages"
            :key="page"
            @click="typeof page === 'number' && goToPage(page)"
            :disabled="page === '...'"
            :class="{
              'px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition': currentPage === page,
              'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition': currentPage !== page && page !== '...',
              'px-4 py-2 text-gray-400 cursor-default': page === '...',
            }"
          >
            {{ page }}
          </button>
          
          <button 
            @click="goToNext"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ i18nStore.t('common.next') }} →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.store'
import { apiClient } from '@/lib/api'
import type { Transaction } from '@/modules/profile/types'

const router = useRouter()
const i18nStore = useI18nStore()

defineProps<{
  transactions?: Transaction[]
}>()

const filterStatus = ref('')
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10

const transactions = ref<Transaction[]>([])

// Reset ke halaman 1 saat filter berubah
watch(filterStatus, () => {
  currentPage.value = 1
})

onMounted(async () => {
  await loadTransactions()
})

const loadTransactions = async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const orders = await apiClient.getAllOrders()
    
    // Map orders to transactions
    transactions.value = orders.map((order: any) => ({
      id: order.id,
      orderId: order.id,
      userId: order.userId,
      amount: order.totalPrice,
      status: mapOrderStatusToPaymentStatus(order.status),
      paymentMethod: order.paymentMethod || '-',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Oldest first
    
    currentPage.value = 1
  } catch (err: any) {
    console.error('Failed to load transactions:', err)
    errorMessage.value = 'Failed to load payment history'
    transactions.value = []
  } finally {
    isLoading.value = false
  }
}

const mapOrderStatusToPaymentStatus = (orderStatus: string): 'PENDING' | 'SUCCESS' | 'FAILED' => {
  // Map order status to payment status for display
  const statusMap: { [key: string]: 'PENDING' | 'SUCCESS' | 'FAILED' } = {
    'WAITING_PAYMENT': 'PENDING',
    'PAID': 'SUCCESS',
    'PROCESSING': 'SUCCESS',
    'SHIPPED': 'SUCCESS',
    'COMPLETED': 'SUCCESS',
    'CANCELLED': 'FAILED',
  }
  return statusMap[orderStatus] || 'PENDING'
}

const filteredTransactions = computed(() => {
  let filtered = transactions.value
  
  if (filterStatus.value) {
    filtered = filtered.filter(t => t.status === filterStatus.value)
  }
  
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  return filtered.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  const filtered = filterStatus.value 
    ? transactions.value.filter(t => t.status === filterStatus.value)
    : transactions.value
  
  return Math.ceil(filtered.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - maxVisiblePages + 1; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    }
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPrevious = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNext = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'PENDING': i18nStore.t('transaction.pending'),
    'SUCCESS': i18nStore.t('transaction.success'),
    'FAILED': i18nStore.t('transaction.failed'),
  }
  return statusMap[status] || status
}

const viewDetails = (transaction: Transaction) => {
  router.push({
    name: 'order-detail',
    params: { id: transaction.orderId }
  })
}
</script>
