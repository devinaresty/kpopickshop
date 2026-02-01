<template>
  <!-- Cart Sidebar Backdrop -->
  <div
    v-if="landingStore.state.isCartOpen"
    class="fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
    @click="landingStore.toggleCart()"
  />

  <!-- Cart Sidebar -->
  <div
    class="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-40 transition-transform duration-300 flex flex-col overflow-hidden"
    :class="landingStore.state.isCartOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
      <h2 class="text-lg sm:text-xl font-black">Your Cart</h2>
      <button
        @click="landingStore.toggleCart()"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div
        v-if="landingStore.state.cartItems.length === 0"
        class="flex flex-col items-center justify-center h-full text-center"
      >
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p class="text-gray-600 font-medium">Your cart is empty</p>
        <p class="text-sm text-gray-500 mt-2">Add products to get started</p>
      </div>

      <div
        v-for="item in landingStore.state.cartItems"
        :key="item.id"
        class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
      >
        <!-- Item Image -->
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Item Info -->
        <div class="flex-1">
          <h4 class="font-semibold text-xs sm:text-sm line-clamp-2 mb-1">{{ item.title }}</h4>
          <p class="text-xs text-gray-600 mb-2">{{ item.category }}</p>
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs sm:text-sm">${{ item.price.toFixed(2) }}</span>
            <button
              @click="removeFromCart(item.id)"
              class="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Summary -->
    <div v-if="landingStore.state.cartItems.length > 0" class="border-t border-gray-100 p-4 sm:p-6 space-y-3 sm:space-y-4">
      <!-- Subtotal -->
      <div class="flex justify-between text-xs sm:text-sm">
        <span class="text-gray-600">Subtotal</span>
        <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
      </div>

      <!-- Shipping -->
      <div class="flex justify-between text-xs sm:text-sm">
        <span class="text-gray-600">Shipping</span>
        <span class="font-semibold">Free</span>
      </div>

      <!-- Tax -->
      <div class="flex justify-between text-xs sm:text-sm">
        <span class="text-gray-600">Tax</span>
        <span class="font-semibold">${{ (subtotal * 0.1).toFixed(2) }}</span>
      </div>

      <!-- Total -->
      <div class="flex justify-between text-base sm:text-lg border-t border-gray-200 pt-3 sm:pt-4">
        <span class="font-bold">Total</span>
        <span class="font-black">${{ (subtotal * 1.1).toFixed(2) }}</span>
      </div>

      <!-- Checkout Button -->
      <button class="w-full px-4 py-2 sm:py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base">
        Proceed to Checkout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLandingStore } from '@/modules/landing/stores/landing.store'
import type { Product } from '@/modules/landing/domain/landing.types'

const landingStore = useLandingStore()

const subtotal = computed(() => {
  return landingStore.state.cartItems.reduce((sum: number, item: Product) => sum + item.price, 0)
})

const removeFromCart = (id: string) => {
  const index = landingStore.state.cartItems.findIndex((item: Product) => item.id === id)
  if (index > -1) {
    landingStore.state.cartItems.splice(index, 1)
  }
}
</script>
