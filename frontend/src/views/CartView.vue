<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-black text-black mb-2">{{ i18nStore.t('cart.title') }}</h1>
        <p class="text-gray-600">{{ i18nStore.t('cart.subtitle') }}</p>
      </div>

      <div v-if="cartStore.isEmpty" class="text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-lg">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-gray-600 text-lg mb-4">{{ i18nStore.t('cart.cartEmpty') }}</p>
        <RouterLink to="/products" class="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition">
          {{ i18nStore.t('cart.continueShopping') }}
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="divide-y divide-gray-200">
              <div v-for="item in cartStore.cartItems" :key="item.id" class="flex gap-4 p-4 hover:bg-gray-50 transition">
                <div class="w-24 h-32 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                  <img 
                    v-if="item.imageUrl" 
                    :src="item.imageUrl" 
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-200 to-gray-300">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600">{{ item.category }}</p>
                  <p class="font-bold text-black mt-2">Rp {{ item.price.toLocaleString('id-ID') }}</p>
                </div>

                <div class="flex items-center gap-2">
                  <button 
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <span class="px-4">{{ item.quantity }}</span>
                  <button 
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>

                <button 
                  @click="cartStore.removeFromCart(item.id)"
                  class="text-red-500 hover:text-red-700 font-semibold transition"
                >
                  {{ i18nStore.t('cart.remove') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h3 class="font-bold text-lg text-black mb-4">{{ i18nStore.t('cart.cartSummary') }}</h3>
            <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div class="flex justify-between text-gray-600">
                <span>{{ i18nStore.t('cart.subtotal') }}</span>
                <span>Rp {{ calculateSubtotal().toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>{{ i18nStore.t('cart.shipping') }}</span>
                <span>Rp {{ SHIPPING_COST.toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>{{ i18nStore.t('cart.tax') }}</span>
                <span>Rp {{ calculateTax().toLocaleString('id-ID') }}</span>
              </div>
            </div>
            <div class="flex justify-between font-bold text-lg mb-6">
              <span>{{ i18nStore.t('cart.total') }}</span>
              <span>Rp {{ calculateTotal().toLocaleString('id-ID') }}</span>
            </div>
            <RouterLink 
              to="/checkout"
              class="block w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition text-center"
            >
              {{ i18nStore.t('cart.checkout') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore, useI18nStore } from '@/shared/stores'

const cartStore = useCartStore()
const i18nStore = useI18nStore()

const SHIPPING_COST = 10000

const calculateSubtotal = () => {
  return cartStore.cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

const calculateTax = () => {
  return Math.round(calculateSubtotal() * 0.1)
}

const calculateTotal = () => {
  return calculateSubtotal() + calculateTax() + SHIPPING_COST
}
</script>
