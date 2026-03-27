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
        :key="String(item.id)"
        class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
      >
        <!-- Checkbox -->
        <input
          type="checkbox"
          :checked="isItemChecked(String(item.id))"
          @change="toggleItemCheck(String(item.id))"
          class="w-5 h-5 mt-1 accent-black cursor-pointer flex-shrink-0"
        />

        <!-- Item Image -->
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <svg v-else class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Item Info -->
        <div class="flex-1">
          <h4 class="font-semibold text-xs sm:text-sm line-clamp-2 mb-1">{{ item.name }}</h4>
          <p class="text-xs text-gray-600 mb-2">{{ item.category }}</p>
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-xs sm:text-sm">Rp {{ formatPrice(item.price) }}</span>
            <button
              @click="removeFromCart(String(item.id))"
              class="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
              </svg>
            </button>
          </div>
          <!-- Quantity Selector -->
          <div class="flex items-center gap-2">
            <button
              @click="decrementQuantity(String(item.id))"
              class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors text-xs font-semibold"
            >
              −
            </button>
            <span class="text-xs font-semibold px-2">{{ getItemQuantity(String(item.id)) }}</span>
            <button
              @click="incrementQuantity(String(item.id))"
              class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors text-xs font-semibold"
            >
              +
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
        <span class="font-semibold">Rp {{ formatPrice(subtotal) }}</span>
      </div>

      <!-- Shipping -->
      <div class="flex justify-between text-xs sm:text-sm">
        <span class="text-gray-600">Shipping</span>
        <span class="font-semibold">Free</span>
      </div>

      <!-- Tax -->
      <div class="flex justify-between text-xs sm:text-sm">
        <span class="text-gray-600">Tax</span>
        <span class="font-semibold">Rp {{ formatPrice(subtotal * 0.1) }}</span>
      </div>

      <!-- Total -->
      <div class="flex justify-between text-base sm:text-lg border-t border-gray-200 pt-3 sm:pt-4">
        <span class="font-bold">Total</span>
        <span class="font-black">Rp {{ formatPrice(subtotal * 1.1) }}</span>
      </div>

      <!-- Checkout Button -->
      <button class="w-full px-4 py-2 sm:py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base">
        Proceed to Checkout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useLandingStore } from '@/modules/landing/stores/landing.store'
import type { Product } from '@/modules/landing/types'

const landingStore = useLandingStore()
const checkedItems = ref<Set<string>>(new Set())
const itemQuantities = ref<Map<string, number>>(new Map())
const lastAddedItemId = ref<string | null>(null)

// Initialize quantities from cart items
const initializeQuantities = () => {
  landingStore.state.cartItems.forEach((item: any) => {
    const itemId = String(item.id)
    if (!itemQuantities.value.has(itemId)) {
      // Use quantity from item if it exists, otherwise default to 1
      itemQuantities.value.set(itemId, item.quantity || 1)
    }
  })
}

// Watch for new items added to cart and initialize their quantities + auto-check
const watchCartChanges = () => {
  const newItem = landingStore.state.cartItems[landingStore.state.cartItems.length - 1]
  if (newItem) {
    const newItemId = String(newItem.id)
    if (!itemQuantities.value.has(newItemId)) {
      itemQuantities.value.set(newItemId, newItem.quantity || 1)
      // Auto-check only the newly added item
      checkedItems.value.clear()
      checkedItems.value.add(newItemId)
      lastAddedItemId.value = newItemId
    }
  }
}

const subtotal = computed(() => {
  return landingStore.state.cartItems.reduce((sum: number, item: Product) => {
    const itemId = String(item.id)
    if (checkedItems.value.has(itemId)) {
      const quantity = itemQuantities.value.get(itemId) || 1
      return sum + (item.price * quantity)
    }
    return sum
  }, 0)
})

// Format price to Indonesian Rupiah
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const removeFromCart = (id: string) => {
  const index = landingStore.state.cartItems.findIndex((item: Product) => String(item.id) === id)
  if (index > -1) {
    landingStore.state.cartItems.splice(index, 1)
    checkedItems.value.delete(id)
    itemQuantities.value.delete(id)
  }
}

const isItemChecked = (id: string): boolean => {
  return checkedItems.value.has(id)
}

const toggleItemCheck = (id: string) => {
  if (checkedItems.value.has(id)) {
    checkedItems.value.delete(id)
  } else {
    checkedItems.value.add(id)
  }
}

const getItemQuantity = (id: string): number => {
  return itemQuantities.value.get(id) || 1
}

const incrementQuantity = (id: string) => {
  const current = itemQuantities.value.get(id) || 1
  const item = landingStore.state.cartItems.find((item: any) => String(item.id) === id)
  if (item && current < item.stock) {
    itemQuantities.value.set(id, current + 1)
  }
}

const decrementQuantity = (id: string) => {
  const current = itemQuantities.value.get(id) || 1
  if (current > 1) {
    itemQuantities.value.set(id, current - 1)
  }
}

// Initialize quantities on component mount
onMounted(() => {
  initializeQuantities()
})

// Watch cart items for changes
watch(
  () => landingStore.state.cartItems.length,
  () => {
    watchCartChanges()
  }
)
</script>
