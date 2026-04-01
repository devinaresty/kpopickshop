<template>
  <div class="space-y-6">
    <!-- Consumer Information Summary -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Consumer Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">Name</p>
          <p class="font-semibold text-gray-900">
            {{ checkoutStore.consumer.firstName }} {{ checkoutStore.consumer.lastName }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Email</p>
          <p class="font-semibold text-gray-900">{{ checkoutStore.consumer.email }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Phone</p>
          <p class="font-semibold text-gray-900">{{ checkoutStore.consumer.phone }}</p>
        </div>
      </div>
    </div>

    <!-- Shipping Information Summary -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Shipping Address</h3>
      <div class="space-y-2">
        <p class="font-semibold text-gray-900">{{ checkoutStore.shipping.address }}</p>
        <p class="text-sm text-gray-600">
          {{ checkoutStore.shipping.city }}, {{ checkoutStore.shipping.province }}
          {{ checkoutStore.shipping.postalCode }}
        </p>
        <p class="text-sm text-gray-600">{{ checkoutStore.shipping.country }}</p>
      </div>
    </div>

    <!-- Payment Method Summary -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Payment Method</h3>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h10m4 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-600">Selected Method</p>
          <p class="font-semibold text-gray-900">{{ formatPaymentMethod(checkoutStore.payment.method) }}</p>
        </div>
      </div>
    </div>

    <!-- Terms & Conditions -->
    <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <input
        type="checkbox"
        id="terms"
        v-model="agreeTerms"
        class="mt-1"
      />
      <label for="terms" class="text-sm text-gray-700">
        I agree to the terms and conditions and privacy policy
      </label>
    </div>

    <!-- Warning if terms not agreed -->
    <div v-if="!agreeTerms" class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <p class="text-sm text-yellow-800">Please agree to terms and conditions to proceed</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCheckoutStore } from '@/stores/checkout.store'
import type { PaymentMethod } from '@/modules/checkout/types'

const checkoutStore = useCheckoutStore()
const agreeTerms = ref(false)

const formatPaymentMethod = (method: PaymentMethod['method']): string => {
  const methods: Record<PaymentMethod['method'], string> = {
    BANK_TRANSFER: 'Bank Transfer',
    CREDIT_CARD: 'Credit / Debit Card',
    E_WALLET: 'E-Wallet',
    QR_PAYMENT: 'QR Payment',
    DIRECT_DEBIT: 'Direct Debit',
  }
  return methods[method] || method
}

defineExpose({
  agreeTerms,
})
</script>
