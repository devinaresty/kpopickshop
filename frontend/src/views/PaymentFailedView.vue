<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <!-- Error Icon -->
      <div class="mb-6 flex justify-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
      <p class="text-gray-600 mb-6">Unfortunately, your payment could not be processed. Please try again.</p>
      
      <!-- Order ID -->
      <div v-if="orderId" class="mb-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Order ID</p>
        <p class="text-lg font-semibold text-gray-900">#{{ orderId }}</p>
      </div>

      <!-- Possible Reasons -->
      <div class="mb-8 p-4 bg-red-50 rounded-lg text-left text-sm">
        <p class="font-semibold text-red-900 mb-2">Possible Reasons:</p>
        <ul class="text-red-700 space-y-1 list-disc list-inside">
          <li>Insufficient funds</li>
          <li>Payment method declined</li>
          <li>Session expired</li>
          <li>Technical issue</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          @click="retryPayment"
          class="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
        <button
          @click="goToHome"
          class="w-full px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Home
        </button>
      </div>

      <!-- Support Text -->
      <p class="text-xs text-gray-500 mt-6">
        Need help? Contact our support team at support@kpopick.com
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const orderId = ref<string | null>(null)

onMounted(() => {
  orderId.value = route.query.orderId as string || null
})

const retryPayment = () => {
  if (orderId.value) {
    router.push({
      name: 'checkout',
    })
  }
}

const goToHome = () => {
  router.push({ name: 'home' })
}
</script>
