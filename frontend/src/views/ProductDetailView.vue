<template>
  <div class="min-h-screen bg-gray-100 py-2 sm:py-3 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Product Details -->
      <div v-if="product && !isLoading && !error" class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Home Button Inside Container -->
        <div class="p-2 sm:p-3 border-b border-gray-200">
          <button
            @click="goHome"
            class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-sm sm:text-base font-semibold">Home</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 p-4 sm:p-6">
          <!-- Product Image -->
          <div class="flex flex-col gap-3 sm:gap-4 pl-0 sm:pl-4 md:pl-6">
            <!-- Main Image -->
            <div 
              class="flex items-center justify-center bg-white rounded-lg h-80 sm:h-96 md:h-[400px] overflow-hidden"
              @mousemove="handleImageMouseMove"
              @mouseleave="handleImageMouseLeave"
            >
              <img
                v-if="selectedImage"
                :src="selectedImage"
                :alt="product.name"
                class="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-200"
                :style="{
                  transform: isImageHovered ? `scale(2)` : 'scale(1)',
                  transformOrigin: `${zoomX}% ${zoomY}%`
                }"
              />
              <svg v-else class="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Thumbnail Gallery -->
            <div v-if="productImages.length > 0" class="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              <button
                v-for="(image, index) in productImages"
                :key="index"
                @click="selectedImage = image"
                class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded transition-all"
                :class="selectedImage === image ? 'opacity-100' : 'opacity-50 hover:opacity-100'"
              >
                <img
                  :src="image"
                  :alt="`Product thumbnail ${index + 1}`"
                  class="w-full h-full object-cover rounded"
                />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex flex-col gap-5 sm:gap-6 lg:gap-7">
            <!-- Category Pill Badge + Flash Sale -->
            <div class="flex items-center gap-2">
              <span class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm font-semibold">
                {{ product.category }}
              </span>
              <span v-if="product.isFlashSale" class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-600 rounded-full text-xs sm:text-sm font-semibold">
                Flash Sale
              </span>
            </div>

            <!-- Title -->
            <div>
              <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ product.name }}</h1>
            </div>

            <!-- Rating -->
            <div v-if="product.rating" class="flex items-center gap-2">
              <div class="flex gap-0.5">
                <span v-for="i in 5" :key="i" class="text-xs sm:text-sm">
                  {{ i <= Math.floor(product.rating) ? '⭐' : '☆' }}
                </span>
              </div>
              <span class="text-xs sm:text-sm text-gray-600 font-semibold">
                {{ (product.rating || 0).toFixed(1) }} (234)
              </span>
            </div>

            <!-- Price -->
            <div class="py-4 sm:py-5 lg:py-6 border-b border-gray-200 pb-4 sm:pb-5 lg:pb-6">
              <p class="text-xl sm:text-2xl lg:text-2xl font-bold text-black">
                Rp {{ formatPrice(product.price) }}
              </p>
              <p v-if="product.isFlashSale && product.discountPercentage" class="text-xs sm:text-sm text-red-600 font-semibold mt-3">
                Hemat {{ product.discountPercentage }}% Flash Sale
              </p>
            </div>

            <!-- Stock Status -->
            <div class="flex items-center gap-2">
              <div 
                class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                :class="product.stock > 0 ? 'bg-green-600' : 'bg-gray-400'"
              ></div>
              <p class="text-xs sm:text-sm font-semibold" :class="product.stock > 0 ? 'text-green-600' : 'text-gray-600'">
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
              </p>
            </div>

            <!-- Quantity Selector -->
            <div v-if="product.stock > 0" class="flex items-center gap-4 py-4 sm:py-5 border-b border-gray-200 pb-4 sm:pb-5">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  −
                </button>
                <span class="px-4 sm:px-6 py-2 border-l border-r border-gray-300 text-sm sm:text-base font-semibold">
                  {{ quantity }}
                </span>
                <button
                  @click="quantity = Math.min(product.stock, quantity + 1)"
                  class="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  +
                </button>
              </div>
              <span class="text-sm font-semibold text-gray-700">Item</span>
            </div>

            <!-- Add to Cart & Buy Now Buttons -->
            <div class="flex gap-4 sm:gap-5 pt-4 sm:pt-5">
              <button
                @click="addToCart"
                :disabled="product.stock === 0"
                class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-black text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                Add to Cart
              </button>
              <button
                @click="buyNow"
                :disabled="product.stock === 0"
                class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-black text-black text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-100 disabled:border-gray-400 disabled:text-gray-400 transition-colors"
              >
                Buy Now
              </button>
            </div>

            <!-- Description -->
            <div v-if="product.description" class="pt-6 sm:pt-7 lg:pt-8 mt-4 sm:mt-5 lg:mt-6 border-t border-gray-200 flex-grow flex flex-col">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Description</h3>
              <div class="bg-gray-100 rounded-lg lg:rounded-xl p-4 sm:p-5 lg:p-6 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto flex-grow">
                <p class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {{ product.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p class="text-gray-600">Loading product details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center py-12">
        <div class="text-center">
          <p class="text-red-600 font-semibold mb-4">{{ error }}</p>
          <button
            @click="loadProduct"
            class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Product } from '@/modules/landing/types'
import { apiClient } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import { useUIStore } from '@/stores/ui.store'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const uiStore = useUIStore()

const product = ref<Product | null>(null)
const selectedImage = ref<string>('')
const productImages = ref<string[]>([])
const quantity = ref<number>(1)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Zoom state
const isImageHovered = ref(false)
const zoomX = ref(0)
const zoomY = ref(0)

const mapProductFromAPI = (apiProduct: any): Product => {
  // Get main image from product - gunakan hanya yang ada di DB
  const imageUrl = apiProduct.imageUrl || apiProduct.image || ''
  
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

const loadProduct = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Reset images saat mulai load produk baru
    productImages.value = []
    selectedImage.value = ''
    
    const productId = route.params.id as string
    const apiProduct = await apiClient.getProductById(productId)
    product.value = mapProductFromAPI(apiProduct)
    
    // Extract semua image URLs hanya untuk main product ini (dari DB)
    let allImages: string[] = []
    const images = (apiProduct as any).images
    if (images && Array.isArray(images) && images.length > 0) {
      allImages = images
        .map((img: any) => img.imageUrl || img)
        .filter((url: string) => url && url.trim())
    }
    
    // Add main product image ke awal list
    const mainImageUrl = apiProduct.imageUrl || apiProduct.image || ''
    if (mainImageUrl && mainImageUrl.trim() && !allImages.includes(mainImageUrl)) {
      allImages.unshift(mainImageUrl)
    }
    
    // Set productImages hanya dengan images produk ini
    productImages.value = allImages
    
    // Set selectedImage ke gambar pertama
    if (productImages.value.length > 0 && productImages.value[0]) {
      selectedImage.value = productImages.value[0]
    }
    

  } catch (err) {
    console.error('Failed to fetch product details:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load product'
  } finally {
    isLoading.value = false
  }
}

const goHome = () => {
  router.push('/')
}

const addToCart = () => {
  if (!product.value || product.value.stock === 0) return
  
  // Add to cart store
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    category: product.value.category,
    imageUrl: product.value.imageUrl,
    stock: product.value.stock,
    quantity: 1
  }, quantity.value)
  
  // Open cart sidebar
  uiStore.openCartSidebar()
  
  // Reset quantity after adding
  quantity.value = 1
}

const buyNow = () => {
  if (!product.value || product.value.stock === 0) return
  
  // Add to cart store
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    category: product.value.category,
    imageUrl: product.value.imageUrl,
    stock: product.value.stock,
    quantity: 1
  }, quantity.value)
  
  // Navigate to checkout directly
  router.push('/checkout')
  
  // Reset quantity
  quantity.value = 1
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('id-ID')
}

// Handle image zoom
const handleImageMouseMove = (event: MouseEvent) => {
  const imageContainer = event.currentTarget as HTMLElement
  const rect = imageContainer.getBoundingClientRect()
  
  // Calculate percentage position (0-100)
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  
  zoomX.value = x
  zoomY.value = y
  isImageHovered.value = true
}

const handleImageMouseLeave = () => {
  isImageHovered.value = false
}

onMounted(() => {
  loadProduct()
})
</script>
