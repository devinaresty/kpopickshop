<template>
  <section class="py-4 sm:py-6 lg:py-8 bg-gray-100">
    <div class="mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl bg-white rounded-lg py-6 sm:py-8 lg:py-10">
      <!-- Tabs -->
      <div class="flex gap-2 sm:gap-3 mb-4 sm:mb-6 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300"
          :class="
            activeTab === tab
              ? 'text-black border-b-2 border-black'
              : 'text-gray-600 hover:text-gray-900'
          "
        >
          {{ tab }}
        </button>
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
      <div v-else-if="displayedProducts.length === 0" class="flex justify-center items-center py-12">
        <div class="text-center">
          <p class="text-gray-600 font-semibold">No products available</p>
        </div>
      </div>

      <!-- Content Grid with Responsive Scaling -->
      <div v-else class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-1.5 lg:gap-2">
        <div
          v-for="(product, index) in displayedProducts"
          :key="product.id"
          class="group cursor-pointer transition-transform duration-300 hover:scale-105"
          :style="{ animation: `fadeInUp 0.5s ease-out forwards`, animationDelay: `${index * 50}ms` }"
        >
          <!-- Entire Card Container -->
          <div class="bg-white border border-gray-300 rounded overflow-hidden flex flex-col h-full">
            <!-- Product Image Section - Fixed Aspect Ratio -->
            <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative flex-shrink-0 overflow-hidden"
              @mouseenter="hoveredProduct = String(product.id)"
              @mouseleave="hoveredProduct = null">
              <!-- Display product image if available -->
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <!-- Fallback icon if no image -->
              <svg v-else class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>

              <!-- Flash Sale Badge - Dynamic from product data -->
              <div
                v-if="product.discountPercentage && product.discountPercentage > 0"
                class="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold"
              >
                -{{ product.discountPercentage }}%
              </div>

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300"
                :class="{ 'opacity-100': hoveredProduct === String(product.id) }"
              >
                <button
                  class="px-2 sm:px-3 py-1 bg-white text-black rounded text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            <!-- Product Info Section - Flexible Growth -->
            <div class="px-1 sm:px-1.5 py-2 sm:py-2.5 lg:py-3 flex flex-col flex-grow">
              <p class="text-xs text-gray-500 mb-0.5">{{ product.category }}</p>
              <h3 class="font-semibold text-gray-900 text-xs line-clamp-2 mb-1.5 sm:mb-2 flex-grow">
                {{ product.name }}
              </h3>
              <div class="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-200">
                <p class="text-xs font-bold text-black">
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
      <div class="mt-6 sm:mt-8 lg:mt-10 text-center">
        <button
          class="px-5 sm:px-6 lg:px-7 py-2 sm:py-2.5 lg:py-3 border border-gray-300 text-black rounded-md text-xs sm:text-sm lg:text-base font-semibold hover:border-black hover:bg-black hover:text-white transition-all duration-300"
        >
          View More {{ activeTab }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Product } from '@/modules/landing/types'

const activeTab = ref('For You')
const hoveredProduct = ref<string | null>(null)
const tabs = ['For You', 'Flash Sale']

const forYouProducts = ref<Product[]>([])
const flashSaleProducts = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Hardcoded products for 3 rows (6 cols × 3 = 18 items on desktop)
const createMockProducts = (): Product[] => {
  const baseProduct: Product = {
    id: 1,
    name: 'ILLIT : AFTER THE GLITTER DAY PHOTOBOOK',
    price: 299000,
    stock: 50,
    imageUrl: '/images/produk1.webp',
    category: 'Photobook',
    rating: 5,
    description: 'Official ILLIT Photobook',
    badge: 'New',
    artist: 'ILLIT',
  }
  
  // Create 18 items with varied discount data
  return Array.from({ length: 18 }, (_, index) => ({
    ...baseProduct,
    id: index + 1,
    // Every 3rd item is Flash Sale with discount
    isFlashSale: index % 3 === 0,
    discountPercentage: index % 3 === 0 ? 30 : 0,
    badge: index % 3 === 0 ? 'Flash Sale' : (index % 2 === 0 ? 'New' : 'Hot'),
  }))
}

const reloadProducts = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Get all products
    const allProducts = createMockProducts()
    
    // FOR YOU: Products without discount (default products)
    forYouProducts.value = allProducts.filter(
      product => !product.isFlashSale && (!product.discountPercentage || product.discountPercentage === 0)
    )
    
    // FLASH SALE: Products with isFlashSale OR discountPercentage > 0
    flashSaleProducts.value = allProducts.filter(
      product => product.isFlashSale === true || (product.discountPercentage && product.discountPercentage > 0)
    )
    
    console.log('RecommendationSection - For You:', forYouProducts.value.length, 'items')
    console.log('RecommendationSection - Flash Sale:', flashSaleProducts.value.length, 'items')
  } catch (err) {
    console.error('Failed to fetch recommendation products:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  reloadProducts()
})

const displayedProducts = computed(() => {
  return activeTab.value === 'For You' ? forYouProducts.value : flashSaleProducts.value
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
