<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-black text-black mb-2">Shopping Cart</h1>
        <p class="text-gray-600">Review your items and checkout</p>
      </div>

      <!-- Empty Cart Message -->
      <div class="text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-lg">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-gray-600 text-lg mb-4">Your cart is empty</p>
        <RouterLink to="/products" class="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition">
          Continue Shopping
        </RouterLink>
      </div>

      <!-- Cart Items (when not empty) -->
      <div class="hidden">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2">
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div class="divide-y divide-gray-200">
                <!-- Cart Item -->
                <div class="flex gap-4 p-4 hover:bg-gray-50 transition">
                  <div class="w-24 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex-shrink-0 flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">Product Name</h3>
                    <p class="text-sm text-gray-600">Category • Size/Variant</p>
                    <p class="font-bold text-black mt-2">$25.99</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">−</button>
                    <span class="px-4">1</span>
                    <button class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">+</button>
                  </div>
                  <button class="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <h3 class="font-bold text-lg text-black mb-4">Order Summary</h3>
              <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>
              <div class="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>$0.00</span>
              </div>
              <button class="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
