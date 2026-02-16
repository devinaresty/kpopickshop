<template>
  <section class="py-12 sm:py-16 lg:py-20 bg-white">
    <div class="max-w-full px-3 sm:px-4 lg:px-8">
      <!-- Section Header -->
      <div class="mb-6 sm:mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-1.5">Featured Products</h2>
        <p class="text-xs sm:text-sm text-gray-600">Trending items from your favorite artists</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p class="text-gray-600">Loading products...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center py-12">
        <div class="text-center">
          <p class="text-red-600 font-semibold mb-4">{{ error }}</p>
          <button @click="reloadProducts()" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            Retry
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="flex justify-center items-center py-12">
        <div class="text-center">
          <p class="text-gray-600 font-semibold">No products available</p>
        </div>
      </div>

      <!-- Product Grid with Stagger Animation -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="group"
          :style="{ animation: `scaleInStagger 0.6s ease-out forwards`, animationDelay: `${index * 100}ms` }"
        >
          <div
            class="relative bg-white rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg border border-gray-200"
            @mouseenter="hoveredProduct = String(product.id)"
            @mouseleave="hoveredProduct = null"
          >
            <!-- Product Image -->
            <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative">
              <svg class="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300"
                :class="{ 'opacity-100': hoveredProduct === String(product.id) }"
              >
                <button
                  class="px-5 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Details
                </button>
              </div>

              <!-- Sale Badge -->
              <div
                v-if="product.stock > 50"
                class="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold"
              >
                Popular
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-3 sm:p-4 bg-white">
              <p class="text-xs text-gray-500 mb-1.5">{{ product.category }}</p>
              <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-3 leading-snug">
                {{ product.name }}
              </h3>
              <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                <p class="text-lg sm:text-xl font-bold text-black">
                  ${{ product.price.toFixed(2) }}
                </p>
                <span class="text-xs text-gray-500">
                  {{ product.stock }} in stock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="mt-6 sm:mt-8 text-center">
        <button
          class="px-6 sm:px-8 py-2 sm:py-2.5 border-2 border-black text-black rounded text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300"
        >
          View All Products
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product } from '@/modules/landing/types'
import { apiClient } from '@/lib/api'

const hoveredProduct = ref<string | null>(null)
const products = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const reloadProducts = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await apiClient.getProducts(0, 12)
    
    // Debug: Log raw response structure
    console.log('ProductGridSection - Raw Response:', response)
    
    // Validate and transform response
    if (response && response.data && Array.isArray(response.data)) {
      // Ensure we're only keeping the properties we need
      products.value = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        imageUrl: item.imageUrl,
        category: item.category?.name || item.category,
        rating: item.rating,
        description: item.description,
        badge: item.badge,
        artist: item.artist,
      }))
      console.log('ProductGridSection - Transformed Products:', products.value)
    } else {
      console.warn('Unexpected response format:', response)
      products.value = []
    }
  } catch (err) {
    console.error('Failed to fetch products:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  reloadProducts()
})
</script>

<style scoped>
@keyframes scaleInStagger {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
