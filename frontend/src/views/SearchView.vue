<template>
  <section class="py-4 sm:py-6 lg:py-8 bg-gray-100">
    <div class="mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
      <!-- Filters & Products Layout -->
      <div class="flex gap-3 sm:gap-4 lg:gap-6">
        <!-- Sidebar Filters Container - Separate white container -->
        <aside class="hidden md:block w-40 lg:w-48 flex-shrink-0">
          <div class="sticky top-20 bg-white rounded-lg py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-6 space-y-6 lg:space-y-8">
            <!-- Kategori Filter -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Kategori</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    v-model="categoryFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Semua Kategori</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="albums"
                    v-model="categoryFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Albums</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="lightstick"
                    v-model="categoryFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Lightstick</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="photobook"
                    v-model="categoryFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Photobook</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="accessories"
                    v-model="categoryFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Accessories</span>
                </label>
              </div>
            </div>

            <!-- Urutkan Filter -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Urutkan</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value=""
                    v-model="sortFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Paling Sesuai</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="newest"
                    v-model="sortFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Terbaru</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="price-low"
                    v-model="sortFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Harga Terendah</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="price-high"
                    v-model="sortFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Harga Tertinggi</span>
                </label>
              </div>
            </div>

            <!-- Ketersediaan Filter -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Ketersediaan</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="stock"
                    value=""
                    v-model="stockFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Paling Sesuai</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="stock"
                    value="instock"
                    v-model="stockFilter"
                    @change="updateQuery"
                    class="w-4 h-4"
                  />
                  <span class="text-xs lg:text-sm text-gray-700">Ready Stock Saja</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Products Container - Separate white container -->
        <main class="flex-1 min-w-0">
          <!-- Header - Aligned with products, outside the white container -->
          <div class="mb-2 sm:mb-3 lg:mb-4">
            <h1 class="text-xs sm:text-sm lg:text-base font-bold text-black mb-0.5">
              {{ headerTitle }}
            </h1>
            <p class="text-[10px] sm:text-xs text-gray-600">{{ headerSubtitle }}</p>
          </div>

          <!-- Products Container - White background -->
          <div class="bg-white rounded-lg py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p class="text-gray-600">Loading search results...</p>
            </div>
          </div>

          <!-- Results Grid - Matching Landing Page Design -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-0.5 sm:gap-1 lg:gap-1.5">
            <div
              v-for="(product, index) in filteredProducts"
              :key="product.id"
              class="cursor-pointer"
              @click="goToProductDetail(product.id)"
              :style="{ animation: `fadeInUp 0.5s ease-out forwards`, animationDelay: `${index * 50}ms` }"
            >
              <!-- Entire Card Container -->
              <div class="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full relative">
                <!-- Product Image Section - Fixed Aspect Ratio Square -->
                <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative flex-shrink-0 overflow-hidden">
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
                    class="absolute top-0.5 left-0.5 bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-bold"
                  >
                    -{{ product.discountPercentage }}%
                  </div>
                </div>

                <!-- Product Info Section - Flexible Growth -->
                <div class="px-2 py-2 sm:py-2.5 flex flex-col flex-grow gap-1">
                  <p class="text-xs text-gray-500 mb-0.5 leading-tight">{{ product.category || 'Uncategorized' }}</p>
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

          <!-- Debug Info -->
          <div v-else-if="!isLoading && products.length === 0" class="flex justify-center items-center py-12">
            <div class="text-center">
              <p class="text-gray-600 text-lg font-semibold mb-4">❌ No products loaded from server</p>
              <p class="text-gray-500 text-sm mb-4">Total products: {{ products.length }}</p>
              <button @click="fetchProducts()" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                Retry Load
              </button>
            </div>
          </div>

          <!-- No Results after filtering -->
          <div v-else-if="!isLoading && products.length > 0 && filteredProducts.length === 0" class="flex justify-center items-center py-12">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p class="text-gray-600 text-lg font-semibold">No products match your filters</p>
              <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiClient } from '@/lib/api'
import type { Product } from '@/modules/landing/types'

// Extended Product interface to include search-specific fields
interface SearchProduct extends Product {
  imageUrl: string
  discountPercentage?: number
}

const route = useRoute()
const router = useRouter()

// State
const products = ref<SearchProduct[]>([])
const searchQuery = ref('')
const categoryFilter = ref('')
const sortFilter = ref('')
const stockFilter = ref('')
const artistFilter = ref('')
const isLoading = ref(false)

// Navigate to product detail page
const goToProductDetail = (productId: string | number) => {
  console.log('[SearchView] Navigating to product:', productId)
  router.push({
    name: 'product-detail',
    params: { id: productId }
  })
}

// Map API response to Product type with complete fields
const mapProductFromAPI = (apiProduct: any): SearchProduct => {
  console.log('[SearchView] Mapping product:', {
    id: apiProduct.id,
    name: apiProduct.name,
    category: apiProduct.category,
    price: apiProduct.price,
    stock: apiProduct.stock
  })
  
  const imageUrl = apiProduct.imageUrl || apiProduct.image || '/images/produk1.webp'
  
  return {
    id: apiProduct.id,
    name: apiProduct.name || 'Unknown Product',
    description: apiProduct.description || '',
    price: apiProduct.price || 0,
    stock: apiProduct.stock || 0,
    imageUrl: imageUrl,
    category: (apiProduct.category?.name || apiProduct.category || 'Uncategorized') as string,
    artist: apiProduct.artist || '',
    badge: apiProduct.isPromoted ? 'Flash Sale' : 'New',
    rating: apiProduct.rating || 0,
    discountPercentage: apiProduct.discountPercentage || 0,
    isFlashSale: apiProduct.isPromoted || false,
  }
}

// Load filters from route query and fetch products
onMounted(async () => {
  console.log('[SearchView] Mounted, route:', route)
  
  // Set filter values from route query
  searchQuery.value = (route.query.q as string) || ''
  categoryFilter.value = (route.query.category as string) || ''
  sortFilter.value = (route.query.sort as string) || ''
  stockFilter.value = (route.query.stock as string) || ''
  artistFilter.value = (route.query.artist as string) || ''

  console.log('[SearchView] Initial filters:', {
    searchQuery: searchQuery.value,
    categoryFilter: categoryFilter.value,
    sortFilter: sortFilter.value,
    stockFilter: stockFilter.value,
    artistFilter: artistFilter.value
  })

  // Fetch products
  await fetchProducts()
})

// Fetch products from API
const fetchProducts = async () => {
  try {
    isLoading.value = true
    console.log('[SearchView] Starting fetch...')
    
    const response = await apiClient.getProducts(0, 50)
    console.log('[SearchView] API Response:', response)
    
    if (response && response.data && Array.isArray(response.data)) {
      console.log(`[SearchView] Mapping ${response.data.length} products`)
      products.value = response.data.map(mapProductFromAPI)
      console.log('[SearchView] Mapped products:', products.value.length, 'items')
      console.log('[SearchView] First product sample:', products.value[0])
    } else {
      console.warn('[SearchView] Invalid response structure:', response)
      products.value = []
    }
  } catch (error) {
    console.error('[SearchView] Error fetching products:', error)
    products.value = []
  } finally {
    isLoading.value = false
    console.log('[SearchView] Loading complete. Products:', products.value.length)
  }
}

// Watch for route query changes
watch(() => route.query, () => {
  searchQuery.value = (route.query.q as string) || ''
  categoryFilter.value = (route.query.category as string) || ''
  sortFilter.value = (route.query.sort as string) || ''
  stockFilter.value = (route.query.stock as string) || ''
  artistFilter.value = (route.query.artist as string) || ''
})

// Update query when filters change
const updateQuery = () => {
  const query: Record<string, string> = {}
  if (searchQuery.value) query.q = searchQuery.value
  if (categoryFilter.value) query.category = categoryFilter.value
  if (sortFilter.value) query.sort = sortFilter.value
  if (stockFilter.value) query.stock = stockFilter.value
  if (artistFilter.value) query.artist = artistFilter.value

  router.push({ name: 'search', query })
}

// Computed filtered products
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.category?.toLowerCase().includes(query) ?? false)
    )
    console.log(`[SearchView] After search filter: ${result.length} products`)
  }

  // Filter by category
  if (categoryFilter.value) {
    result = result.filter(p => 
      p.category?.toLowerCase() === categoryFilter.value.toLowerCase()
    )
    console.log(`[SearchView] After category filter: ${result.length} products`)
  }

  // Filter by artist
  if (artistFilter.value) {
    result = result.filter(p => 
      p.name.toLowerCase().includes(artistFilter.value.toLowerCase())
    )
    console.log(`[SearchView] After artist filter: ${result.length} products`)
  }

  // Filter by stock
  if (stockFilter.value === 'instock') {
    result = result.filter(p => p.stock > 0)
    console.log(`[SearchView] After stock filter: ${result.length} products`)
  }

  // Apply sorting
  if (sortFilter.value === 'price-low') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortFilter.value === 'price-high') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortFilter.value === 'newest') {
    result.sort((a, b) => (b.id as number) - (a.id as number))
  }

  console.log(`[SearchView] Final filtered products: ${result.length}`)
  return result
})

// Header text
const headerTitle = computed(() => {
  if (artistFilter.value) {
    return `Results for: ${artistFilter.value}`
  }
  if (categoryFilter.value) {
    return `Results for: ${categoryFilter.value}`
  }
  if (searchQuery.value) {
    return `Search results for "${searchQuery.value}"`
  }
  return 'Search Results'
})

const headerSubtitle = computed(() => {
  return `Found ${filteredProducts.value.length} product${filteredProducts.value.length !== 1 ? 's' : ''}`
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
