<template>
  <section class="py-1 sm:py-2 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">View More For You</h2>
      
      <p class="text-lg sm:text-xl text-gray-600 mb-8">Jelajahi produk yang mungkin Anda sukai</p>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          v-for="product in displayedProducts" 
          :key="product.id" 
          @click="goToProductDetail(product.slug)"
          class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <!-- Product Image -->
          <div class="w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
            <img 
              v-if="product.imageUrl" 
              :src="product.imageUrl" 
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-gray-400 text-sm">No Image</span>
          </div>
          
          <!-- Product Name -->
          <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>
          
          <!-- Product Price -->
          <p class="text-lg font-bold text-gray-900 mb-3">Rp {{ formatPrice(product.price) }}</p>
          
          <!-- Product Details -->
          <div class="text-sm text-gray-600 mb-4">
            <p v-if="product.category" class="mb-1">{{ product.category.name }}</p>
            <p class="mb-2">Stock: {{ product.stock }}</p>
            <p v-if="product.rating" class="flex items-center">
              ⭐ {{ product.rating.toFixed(1) }}
            </p>
          </div>
          
          <!-- Add to Cart Button -->
          <button
            @click="addToCart(product)"
            class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <!-- Load More / View All Button -->
      <div class="flex justify-center">
        <button 
          v-if="displayedProducts.length < totalProducts && displayedProducts.length < MAX_PRODUCTS"
          @click="handleLoadMore"
          :disabled="isLoading"
          class="px-6 sm:px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Loading...' : 'Load More' }}
        </button>
        
        <button 
          v-else-if="displayedProducts.length >= MAX_PRODUCTS"
          @click="handleViewAllClick"
          class="px-6 sm:px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          View All Products
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'
import { useLandingStore } from '@/modules/landing/stores/landing.store'
import { useRouter } from 'vue-router'
import { apiClient } from '@/lib/api'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: number
  createdAt: string
  updatedAt: string
}

interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  image?: string
  imageUrl?: string
  rating: number
  categoryId: number
  isPromoted: boolean
  createdAt: string
  updatedAt: string
  category: Category
}

const authStore = useAuthStore()
const cartStore = useCartStore()
const landingStore = useLandingStore()
const router = useRouter()

// Constants
const DEFAULT_DISPLAY_COUNT = 2
const LOAD_MORE_INCREMENT = 2
const MAX_PRODUCTS = 24

// State
const allProducts = ref<Product[]>([])
const displayCount = ref(DEFAULT_DISPLAY_COUNT)
const isLoading = ref(false)
const totalProducts = ref(0)

// Computed
const displayedProducts = computed(() => {
  return allProducts.value.slice(0, displayCount.value)
})

// Methods
const formatPrice = (price: number): string => {
  return price.toLocaleString('id-ID')
}

const addToCart = (product: any) => {
  const cartProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    stock: product.stock,
    slug: product.slug,
    category: product.category?.name || 'Other',
    quantity: 1, // Default quantity from product sections
  }
  cartStore.addToCart(cartProduct)
  console.log(`${product.name} added to cart`)
}

const goToProductDetail = (slug?: string) => {
  if (slug) {
    router.push({ name: 'product-detail', params: { slug } })
  }
}

const fetchProducts = async () => {
  try {
    isLoading.value = true
    // Fetch max products up to MAX_PRODUCTS or more to have total
    const response = await apiClient.getProducts(0, Math.max(MAX_PRODUCTS, 50))
    allProducts.value = response.data
    totalProducts.value = response.total
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    isLoading.value = false
  }
}

const handleLoadMore = () => {
  const nextCount = displayCount.value + LOAD_MORE_INCREMENT
  
  // Check if user wants to load more beyond MAX_PRODUCTS
  if (nextCount > MAX_PRODUCTS && !authStore.isAuthenticated) {
    // Show auth modal
    landingStore.openAuthModal('login')
    return
  }
  
  // Update display count (cap at MAX_PRODUCTS)
  displayCount.value = Math.min(nextCount, MAX_PRODUCTS)
}

const handleViewAllClick = () => {
  if (authStore.isAuthenticated) {
    router.push('/products')
  } else {
    landingStore.openAuthModal('login')
  }
}

// Lifecycle
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>
