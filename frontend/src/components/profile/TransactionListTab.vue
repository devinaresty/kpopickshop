<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-xl font-bold text-black">{{ i18nStore.t('transaction.title') }}</h3>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Empty State -->
      <div v-if="transactions.length === 0" class="text-center py-12">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-600 font-medium">{{ i18nStore.t('transaction.emptyMessage') }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ i18nStore.t('transaction.emptySubtitle') }}</p>
      </div>

      <!-- Transaction List -->
      <div v-else class="space-y-4">
        <!-- Filter/Sort Options -->
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

        <!-- Transactions Table -->
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

        <!-- Pagination (if needed) -->
        <div v-if="filteredTransactions.length > 0" class="mt-6 flex justify-center gap-2">
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50" disabled>← {{ i18nStore.t('common.previous') }}</button>
          <button class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">1</button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">2</button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">{{ i18nStore.t('common.next') }} →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.store'
import type { Transaction } from '@/modules/profile/types'

const i18nStore = useI18nStore()

defineProps<{
  transactions?: Transaction[]
}>()

const filterStatus = ref('')

const transactions = ref<Transaction[]>([
  // Mock data - will be replaced with actual data
  {
    id: 1,
    orderId: 12345,
    userId: 1,
    amount: 250000,
    status: 'SUCCESS',
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    orderId: 12346,
    userId: 1,
    amount: 150000,
    status: 'SUCCESS',
    paymentMethod: 'Bank Transfer',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    orderId: 12347,
    userId: 1,
    amount: 75000,
    status: 'PENDING',
    paymentMethod: 'E-Wallet',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    orderId: 12348,
    userId: 1,
    amount: 200000,
    status: 'FAILED',
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
])

const filteredTransactions = computed(() => {
  if (!filterStatus.value) return transactions.value
  return transactions.value.filter(t => t.status === filterStatus.value)
})

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
  // TODO: Navigate to transaction details or show modal
  alert(`Order #${transaction.orderId} ${i18nStore.t('common.details')}`)
}
</script>
