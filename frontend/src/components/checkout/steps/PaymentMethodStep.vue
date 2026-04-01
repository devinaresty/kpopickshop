<template>
  <div class="space-y-4">
    <p class="text-gray-600 mb-6">Select your preferred payment method</p>

    <!-- Payment Methods Options -->
    <div class="space-y-3">
      <!-- Bank Transfer -->
      <button
        @click="selectPaymentMethod('BANK_TRANSFER')"
        :class="[
          'w-full p-4 border-2 rounded-lg text-left transition',
          selectedMethod === 'BANK_TRANSFER'
            ? 'border-black bg-black/5'
            : 'border-gray-300 hover:border-gray-400'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-5 h-5 border-2 rounded-full flex items-center justify-center',
              selectedMethod === 'BANK_TRANSFER' ? 'border-black bg-black' : 'border-gray-400'
            ]"
          >
            <span v-if="selectedMethod === 'BANK_TRANSFER'" class="text-white text-xs">✓</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Bank Transfer</h3>
            <p class="text-sm text-gray-500">Transfer to BCA, BNI, Mandiri, etc.</p>
          </div>
        </div>
      </button>

      <!-- Credit Card -->
      <button
        @click="selectPaymentMethod('CREDIT_CARD')"
        :class="[
          'w-full p-4 border-2 rounded-lg text-left transition',
          selectedMethod === 'CREDIT_CARD'
            ? 'border-black bg-black/5'
            : 'border-gray-300 hover:border-gray-400'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-5 h-5 border-2 rounded-full flex items-center justify-center',
              selectedMethod === 'CREDIT_CARD' ? 'border-black bg-black' : 'border-gray-400'
            ]"
          >
            <span v-if="selectedMethod === 'CREDIT_CARD'" class="text-white text-xs">✓</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Credit / Debit Card</h3>
            <p class="text-sm text-gray-500">Visa, Mastercard, JCB, etc.</p>
          </div>
        </div>
      </button>

      <!-- E-Wallet -->
      <button
        @click="selectPaymentMethod('E_WALLET')"
        :class="[
          'w-full p-4 border-2 rounded-lg text-left transition',
          selectedMethod === 'E_WALLET'
            ? 'border-black bg-black/5'
            : 'border-gray-300 hover:border-gray-400'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-5 h-5 border-2 rounded-full flex items-center justify-center',
              selectedMethod === 'E_WALLET' ? 'border-black bg-black' : 'border-gray-400'
            ]"
          >
            <span v-if="selectedMethod === 'E_WALLET'" class="text-white text-xs">✓</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">E-Wallet</h3>
            <p class="text-sm text-gray-500">GCash, OVO, Dana, LINKAJA, etc.</p>
          </div>
        </div>
      </button>

      <!-- QR Payment -->
      <button
        @click="selectPaymentMethod('QR_PAYMENT')"
        :class="[
          'w-full p-4 border-2 rounded-lg text-left transition',
          selectedMethod === 'QR_PAYMENT'
            ? 'border-black bg-black/5'
            : 'border-gray-300 hover:border-gray-400'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-5 h-5 border-2 rounded-full flex items-center justify-center',
              selectedMethod === 'QR_PAYMENT' ? 'border-black bg-black' : 'border-gray-400'
            ]"
          >
            <span v-if="selectedMethod === 'QR_PAYMENT'" class="text-white text-xs">✓</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">QR Payment</h3>
            <p class="text-sm text-gray-500">QRIS, GCash QR, etc.</p>
          </div>
        </div>
      </button>

      <!-- Direct Debit -->
      <button
        @click="selectPaymentMethod('DIRECT_DEBIT')"
        :class="[
          'w-full p-4 border-2 rounded-lg text-left transition',
          selectedMethod === 'DIRECT_DEBIT'
            ? 'border-black bg-black/5'
            : 'border-gray-300 hover:border-gray-400'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-5 h-5 border-2 rounded-full flex items-center justify-center',
              selectedMethod === 'DIRECT_DEBIT' ? 'border-black bg-black' : 'border-gray-400'
            ]"
          >
            <span v-if="selectedMethod === 'DIRECT_DEBIT'" class="text-white text-xs">✓</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Direct Debit</h3>
            <p class="text-sm text-gray-500">Automatic bank deduction</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Error message -->
    <span v-if="checkoutStore.errors['method']" class="text-sm text-red-500 block mt-4">
      {{ checkoutStore.errors['method'] }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCheckoutStore } from '@/stores/checkout.store'
import type { PaymentMethod } from '@/modules/checkout/types'

const checkoutStore = useCheckoutStore()

const selectedMethod = ref(checkoutStore.payment.method)

const selectPaymentMethod = (method: PaymentMethod['method']) => {
  selectedMethod.value = method
  checkoutStore.setPaymentMethod({
    method,
    bankCode: method === 'BANK_TRANSFER' ? 'BCA' : undefined,
    walletProvider: method === 'E_WALLET' ? 'GCASH' : undefined,
  })
}

watch(
  () => checkoutStore.payment.method,
  (newMethod) => {
    selectedMethod.value = newMethod
  }
)
</script>
