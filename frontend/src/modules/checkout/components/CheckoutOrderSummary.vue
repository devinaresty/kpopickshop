<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
    <h2 class="text-xl font-bold text-black mb-6">Order Summary</h2>

    <div v-if="cartStore.items.length > 0" class="space-y-4 mb-6 pb-6 border-b border-gray-200">
      <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.name"
          class="w-16 h-16 object-cover rounded-lg"
        />
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 text-sm">{{ item.name }}</h3>
          <p class="text-gray-600 text-sm">Qty: {{ item.quantity }}</p>
          <p class="text-gray-900 font-semibold mt-1">
            Rp {{ formatPrice(item.price * item.quantity) }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-600 mb-6 border-b border-gray-200">
      <p class="text-sm">No items in cart</p>
    </div>

    <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
      <div class="flex justify-between text-gray-600">
        <span class="text-sm">Subtotal</span>
        <span class="font-semibold">Rp {{ formatPrice(subtotal) }}</span>
      </div>
      <div v-if="shippingFee > 0" class="flex justify-between text-gray-600">
        <span class="text-sm">Shipping Fee</span>
        <span class="font-semibold">Rp {{ formatPrice(shippingFee) }}</span>
      </div>
      <div v-if="tax > 0" class="flex justify-between text-gray-600">
        <span class="text-sm">Tax</span>
        <span class="font-semibold">Rp {{ formatPrice(tax) }}</span>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <span class="font-bold text-lg text-black">Total</span>
      <span class="font-bold text-2xl text-black">Rp {{ formatPrice(total) }}</span>
    </div>

    <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-xs text-blue-900">
        You will be redirected to Xendit to complete the payment after reviewing your order.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '@/modules/landing/types'
import { useCartStore } from '@/shared/stores'
import { getShippingFee, calculateTax } from '@/shared/config/shippingAndTax'

const cartStore = useCartStore()

const subtotal = computed(() => {
  return cartStore.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
})

const shippingFee = computed(() => {
  return getShippingFee()
})

const tax = computed(() => {
  return calculateTax(subtotal.value)
})

const total = computed(() => {
  return subtotal.value + shippingFee.value + tax.value
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
</script>
