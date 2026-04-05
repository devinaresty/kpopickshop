<template>
  <transition name="fade">
    <div v-if="isOpen" @click="closeCart" class="fixed inset-0 bg-black bg-opacity-50 z-30"></div>
  </transition>

  <transition name="slide-in-right">
    <div v-if="isOpen" class="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-40 flex flex-col">
      <div class="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-xl sm:text-2xl font-bold text-black">{{ i18nStore.t('cart.title') }}</h2>
        <button
          @click="closeCart"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center h-full p-6">
          <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p class="text-gray-600 font-semibold">{{ i18nStore.t('cart.cartEmpty') }}</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div v-for="item in cartStore.cartItems" :key="item.id" class="p-4 hover:bg-gray-50 transition">
            <div class="flex gap-3 mb-3">
              <div class="flex-shrink-0 flex items-center pt-1">
                <input
                  type="checkbox"
                  :checked="selectedItems.includes(Number(item.id))"
                  @change="toggleItemSelection(Number(item.id))"
                  class="w-5 h-5 rounded cursor-pointer appearance-none border-2 border-gray-400 checked:bg-black checked:border-black transition-all"
                  style="accent-color: black;"
                />
              </div>

              <div class="w-20 h-20 bg-white border border-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-full h-full object-contain"
                />
                <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div class="flex-1">
                <h3 class="font-semibold text-sm text-gray-900 line-clamp-2">{{ item.name }}</h3>
                <p class="text-xs text-gray-600 mt-1">{{ item.category }}</p>
                <p class="font-bold text-black text-sm mt-2">Rp {{ formatPrice(item.price) }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center border border-gray-300 rounded">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="px-2 py-1 hover:bg-gray-100 text-sm"
                >
                  −
                </button>
                <span class="px-3 py-1 text-sm font-semibold">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="px-2 py-1 hover:bg-gray-100 text-sm"
                >
                  +
                </button>
              </div>
              <button
                @click="cartStore.removeFromCart(item.id)"
                class="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors"
              >
                {{ i18nStore.t('cart.remove') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!cartStore.isEmpty" class="p-4 sm:p-6 border-t border-gray-200 space-y-4">
        <div class="space-y-2 pb-4 border-b border-gray-200 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>{{ i18nStore.t('cart.subtotal') }}</span>
            <span>Rp {{ formatPrice(selectedItemsTotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>{{ i18nStore.t('common.name') }}</span>
            <span>{{ selectedItemsCount }}</span>
          </div>
        </div>

        <div class="flex justify-between font-bold text-lg">
          <span>{{ i18nStore.t('cart.total') }}</span>
          <span>Rp {{ formatPrice(selectedItemsTotal) }}</span>
        </div>

        <div class="space-y-2">
          <button
            @click="goToCheckout"
            class="w-full py-3 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            {{ i18nStore.t('cart.checkout') }}
          </button>
          <button
            @click="closeCart"
            class="w-full py-3 px-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ i18nStore.t('cart.continueShopping') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { useI18nStore } from '@/stores/i18n.store'
import { ref, computed, watch } from 'vue'

const router = useRouter()
const cartStore = useCartStore()
const i18nStore = useI18nStore()
const selectedItems = ref<number[]>([])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Auto-select first item when cart opens
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && cartStore.cartItems && cartStore.cartItems.length > 0) {
      // Set default selection to first item only
      const firstItem = cartStore.cartItems[0]
      if (firstItem) {
        const firstItemId = Number(firstItem.id)
        selectedItems.value = [firstItemId]
      }
    }
  }
)

// Compute total from selected items only
const selectedItemsTotal = computed(() => {
  return cartStore.cartItems
    .filter(item => selectedItems.value.includes(Number(item.id)))
    .reduce((total, item) => total + (item.price * item.quantity), 0)
})

// Compute count of selected items
const selectedItemsCount = computed(() => {
  return cartStore.cartItems
    .filter(item => selectedItems.value.includes(Number(item.id)))
    .reduce((count, item) => count + item.quantity, 0)
})

const closeCart = () => {
  emit('close')
}

const goToCheckout = () => {
  closeCart()
  router.push('/checkout')
}

const toggleItemSelection = (itemId: number) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

// Clear checked items from cart (call this after successful checkout)
const clearCheckedItems = () => {
  selectedItems.value.forEach(itemId => {
    cartStore.removeFromCart(itemId)
  })
  selectedItems.value = []
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('id-ID')
}

// Expose clearCheckedItems function for external use (checkout success)
defineExpose({
  clearCheckedItems
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-in-right-enter-from,
.slide-in-right-leave-to {
  transform: translateX(100%);
}

@keyframes bubbleBurst {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

input[type="checkbox"] {
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: black !important;
  border-color: black !important;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="white" d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>') !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: 75% 75% !important;
}
</style>
