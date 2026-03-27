<template>
  <section class="py-12 sm:py-16 lg:py-20 bg-gray-100">
    <div class="mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl bg-white rounded-lg py-4 sm:py-6 lg:py-8">
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

      <!-- Horizontal Carousel Slider + View All Button -->
      <div v-else class="space-y-6 sm:space-y-8 lg:space-y-10">
        <!-- Carousel Container -->
        <div class="relative px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gray-50 rounded-lg border border-gray-200">
          <!-- Carousel Content -->
          <div class="overflow-hidden rounded-md bg-white">
            <div
              class="flex gap-1 sm:gap-1.5 lg:gap-2 transition-transform duration-500"
              :style="{ transform: `translateX(-${carouselPosition}%)` }"
            >
              <div
                v-for="product in displayedProducts"
                :key="product.id"
                @click="goToProductDetail(product.id)"
                class="group cursor-pointer opacity-100 transition-transform duration-300 hover:scale-105"
                :style="{ flex: `0 0 calc(${100 / itemsPerView}% - ${gap}px)` }"
              >
                <!-- Entire Card Container -->
                <div class="bg-white border border-gray-300 rounded overflow-hidden flex flex-col h-full min-h-72">
                  <!-- Product Image Section - Fixed Aspect Ratio -->
                  <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative flex-shrink-0 overflow-hidden">
                    <!-- Display product image if available -->
                    <img
                      v-if="product.imageUrl"
                      :src="product.imageUrl"
                      :alt="product.name"
                      class="w-full h-full object-contain"
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
                  </div>

                  <!-- Product Info Section - Flexible Growth -->
                  <div class="px-1 sm:px-1.5 py-2 sm:py-2.5 lg:py-3 flex flex-col flex-grow">
                    <p class="text-xs text-gray-500 mb-0.5">{{ product.category }}</p>
                    <h3 class="font-semibold text-gray-900 text-xs line-clamp-2 mb-1.5 sm:mb-2 flex-grow">
                      {{ product.name }}
                    </h3>
                    <div class="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-200">
                      <p class="text-xs font-bold text-black">
                        Rp {{ formatPrice(product.price) }}
                      </p>
                      <span class="text-xs text-gray-500">
                        {{ product.stock }} stok
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Left Arrow -->
          <button
            v-if="canScrollLeft"
            @click="scrollLeft"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-5 z-10 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300"
            :aria-label="'Previous products'"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Right Arrow -->
          <button
            v-if="canScrollRight"
            @click="scrollRight"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-5 z-10 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300"
            :aria-label="'Next products'"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/modules/landing/types'
import { apiClient } from '@/lib/api'

const router = useRouter()
const activeTab = ref('For You')
const tabs = ['For You', 'Flash Sale']

const forYouProducts = ref<Product[]>([])
const flashSaleProducts = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const allProducts = ref<Product[]>([])

// Carousel state
const currentIndex = ref(0)
const itemsPerView = ref(6)
const gap = 8

// Responsive items per view
const getItemsPerView = () => {
  if (window.innerWidth < 640) return 3 // sm
  if (window.innerWidth < 1024) return 4 // md
  return 6 // lg
}

// Format price to Indonesian Rupiah
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Navigate to product detail page
const goToProductDetail = (productId: string | number) => {
  if (productId) {
    router.push({ name: 'product-detail', params: { id: String(productId) } })
  }
}

const reloadProducts = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Fetch products from API
    const response = await apiClient.getProducts(0, 50)
    
    // Map API response to Product type with proper field transformation
    allProducts.value = (response.data || []).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      stock: item.stock,
      imageUrl: item.imageUrl || item.image || '/images/placeholder.webp',
      category: item.category?.name || 'Other',
      slug: item.slug,
      discountPercentage: item.isPromoted ? 10 : 0,
      isFlashSale: item.isPromoted,
    } as any))
    
    // FOR YOU: All products
    forYouProducts.value = allProducts.value
    
    // FLASH SALE: Only promoted products
    flashSaleProducts.value = allProducts.value.filter(
      product => (product as any).isFlashSale === true
    )
    
    console.log('RecommendationSection - For You:', forYouProducts.value.length, 'items')
    console.log('RecommendationSection - Flash Sale:', flashSaleProducts.value.length, 'items')
    
    // Reset carousel position
    currentIndex.value = 0
  } catch (err) {
    console.error('Failed to fetch recommendation products:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  itemsPerView.value = getItemsPerView()
  window.addEventListener('resize', () => {
    itemsPerView.value = getItemsPerView()
  })
  reloadProducts()
})

const displayedProducts = computed(() => {
  return activeTab.value === 'For You' ? forYouProducts.value : flashSaleProducts.value
})

// Carousel calculations - calculate position based on items per view
const carouselPosition = computed(() => {
  const itemPercentage = 100 / itemsPerView.value
  return currentIndex.value * itemPercentage
})

const canScrollLeft = computed(() => {
  return currentIndex.value > 0
})

const canScrollRight = computed(() => {
  return currentIndex.value < displayedProducts.value.length - itemsPerView.value
})

const scrollLeft = () => {
  if (canScrollLeft.value) {
    currentIndex.value = Math.max(0, currentIndex.value - 1)
  }
}

const scrollRight = () => {
  if (canScrollRight.value) {
    currentIndex.value = Math.min(
      displayedProducts.value.length - itemsPerView.value,
      currentIndex.value + 1
    )
  }
}
</script>

<style scoped>
/* No transition - instant carousel movement */
</style>
