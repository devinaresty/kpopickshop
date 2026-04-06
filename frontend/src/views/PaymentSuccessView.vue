<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6 flex justify-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p class="text-gray-600 mb-2">Your payment has been processed successfully.</p>
      
      <div v-if="orderId" class="mb-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Order ID</p>
        <p class="text-lg font-semibold text-gray-900">#{{ orderId }}</p>
      </div>

      <div class="mb-8 space-y-2 text-left text-sm">
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Status:</span>
          <span class="font-semibold text-green-600">Paid</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Payment Method:</span>
          <span class="font-semibold text-gray-900">Xendit</span>
        </div>
      </div>

      <div class="space-y-3">
        <button
          @click="goToHome"
          class="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          @click="viewOrder"
          class="w-full px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Order Details
        </button>
      </div>

      <p class="text-xs text-gray-500 mt-6">
        Thank you for your purchase! Your order will be processed shortly.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/shared/stores'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const orderId = ref<string | null>(null)

onMounted(() => {
  orderId.value = route.query.orderId as string || null
  
  cartStore.items.forEach(item => {
    cartStore.removeFromCart(item.id)
  })
})

const goToHome = () => {
  router.push({ name: 'home' })
}

const viewOrder = () => {
  if (orderId.value) {
    router.push({
      name: 'order-detail',
      params: { id: orderId.value }
    })
  }
}
</script>
