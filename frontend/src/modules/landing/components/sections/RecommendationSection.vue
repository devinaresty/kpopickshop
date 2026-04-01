<template>
  <section class="py-4 sm:py-6 lg:py-8 bg-gray-100">
    <div class="mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl bg-white rounded-lg py-6 sm:py-8 lg:py-10">
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

      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p class="text-gray-600">Loading products...</p>
        </div>
      </div>

      <div v-else-if="error" class="flex justify-center items-center py-12">
        <div class="text-center">
          <p class="text-red-600 font-semibold mb-4">{{ error }}</p>
          <button @click="reloadProducts()" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            Retry
          </button>
        </div>
      </div>

      <div v-else-if="displayedProducts.length === 0" class="flex justify-center items-center py-12">
        <div class="text-center">
          <p class="text-gray-600 font-semibold">No products available</p>
        </div>
      </div>

      <div v-else class="relative overflow-hidden rounded-lg">
        <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-0.5 sm:gap-1 lg:gap-1.5">
          <div
            v-for="(product, index) in displayedProducts"
            :key="product.id"
            class="cursor-pointer"
            @click="goToProductDetail(product.id)"
            :style="{ animation: `fadeInUp 0.5s ease-out forwards`, animationDelay: `${index * 50}ms` }"
          >
            <div class="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
              <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative flex-shrink-0 overflow-hidden">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />

                <svg v-else class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>

                <div
                  v-if="product.isFlashSale"
                  class="absolute top-2 left-2 bg-red-500/40 backdrop-blur-sm text-red-700 px-1.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-0.5"
                >
                  <span>%</span>
                  <span>Sale</span>
                </div>
              </div>

              <div class="px-2 py-2 sm:py-2.5 flex flex-col flex-grow gap-1">
                <p class="text-xs text-gray-500 mb-0.5 leading-tight">{{ product.category }}</p>
                <h3 class="font-semibold text-gray-900 text-xs line-clamp-2 mb-1 flex-grow leading-snug">
                  {{ product.name }}
                </h3>
                <div class="flex items-center justify-between pt-1 border-t border-gray-200">
                  <p class="text-xs font-bold text-black">
                    Rp {{ product.price.toLocaleString('id-ID') }}
                  </p>
                  <span class="text-xs text-gray-500">
                    {{ product.stock }} in stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isUserLoggedIn" class="absolute left-0 right-0 bottom-0 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
             :style="{ 
               'top': overlayTop,
               'background': 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2) 100%)'
             }">
          <button
            @click="landingStore.openAuthModal('login')"
            class="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm whitespace-nowrap"
          >
            Login to See More
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/modules/landing/types'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { useLandingStore } from '@/modules/landing/stores/landing.store'

const router = useRouter()
const authStore = useAuthStore()
const landingStore = useLandingStore()

const activeTab = ref('For You')
const tabs = ['For You', 'Flash Sale']

const forYouProducts = ref<Product[]>([])
const flashSaleProducts = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const goToProductDetail = (productId: string | number) => {
  router.push({
    name: 'product-detail',
    params: { id: productId }
  })
}

const mapProductFromAPI = (apiProduct: any): Product => {
  const imageUrl = apiProduct.imageUrl || apiProduct.image || '/images/produk1.webp'
  
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    stock: apiProduct.stock,
    imageUrl: imageUrl,
    category: apiProduct.category?.name,
    artist: apiProduct.artist,
    badge: apiProduct.isPromoted ? 'Flash Sale' : 'New',
    rating: apiProduct.rating || 0,
    discountPercentage: 0,
    isFlashSale: apiProduct.isPromoted,
  }
}

const reloadProducts = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const allProductsResponse = await apiClient.getProducts(0, 50)
    const allProducts = allProductsResponse.data.map(mapProductFromAPI)
    
    forYouProducts.value = allProducts
    
    flashSaleProducts.value = allProducts.filter(product => product.isFlashSale === true)
    
    console.log('RecommendationSection - For You:', forYouProducts.value.length, 'items')
    console.log('RecommendationSection - Flash Sale:', flashSaleProducts.value.length, 'items')
  } catch (err) {
    console.error('Failed to fetch recommendation products:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

const displayedProducts = computed(() => {
  return activeTab.value === 'For You' ? forYouProducts.value : flashSaleProducts.value
})

const isUserLoggedIn = computed(() => {
  return authStore.isAuthenticated
})

const overlayTop = computed(() => {
  const width = windowWidth.value
  let columns = 3
  
  if (width >= 1024) columns = 6
  else if (width >= 640) columns = 4
  else columns = 3
  
  const totalRows = Math.ceil(displayedProducts.value.length / columns)
  
  const topPercentage = (2 / totalRows) * 100
  
  return `${topPercentage}%`
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  reloadProducts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
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
