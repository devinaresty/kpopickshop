<template>
  <!-- Landing Layout -->
  <div v-if="!isAdminRoute" class="min-h-screen bg-gray-100 flex flex-col">
    <nav class="w-full sticky top-0 z-40 py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 md:px-5 lg:px-8">
      <div class="flex items-center justify-center">
        <div class="rounded-lg sm:rounded-xl border border-gray-300/50 backdrop-blur-sm bg-gray-300/40 px-3.5 sm:px-4 md:px-5 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-3.5 md:gap-4 max-w-max">
          <!-- Logo -->
          <div class="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center">
            <img src="/logo (3).png" alt="K Logo" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain" />
          </div>

          <div class="hidden sm:block w-px h-5 sm:h-5 md:h-6 bg-gray-300"></div>

          <!-- Kategori Dropdown -->
          <div class="relative">
            <button
              @focus="isCategoryFocused = true"
              @blur="handleCategoryBlur"
              class="text-xs sm:text-sm md:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-md whitespace-nowrap"
            >
              Kategori
            </button>

            <!-- Category Dropdown -->
            <div v-if="isCategoryFocused && categories.length > 0" class="absolute top-full left-0 mt-1 backdrop-blur-sm bg-gray-300/40 border border-gray-300/50 rounded-lg shadow-lg z-50 min-w-48 max-h-96 overflow-y-auto">
              <div class="px-3 py-2">
                <p class="text-xs font-semibold text-gray-600 mb-2">All Categories</p>
                <div class="space-y-1">
                  <button
                    v-for="category in categories"
                    :key="category.id"
                    @mousedown.prevent="selectCategory(category.name)"
                    class="w-full text-left px-2 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden sm:block w-px h-4 sm:h-4 md:h-5 bg-gray-300"></div>

          <!-- Search Bar -->
          <div class="relative hidden sm:block transition-all duration-300" :class="isSearchFocused ? 'w-56 md:w-64' : 'w-32 md:w-40'">
            <input
              v-model="searchInput"
              @keydown.enter="performSearch"
              @focus="isSearchFocused = true"
              @blur="handleSearchBlur"
              @input="handleSearchInput"
              type="text"
              placeholder="Search..."
              class="w-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gray-100/50 rounded-md text-xs sm:text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder-gray-400 transition-all"
            />
            <svg class="absolute right-2 sm:right-2.5 md:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <!-- Search Dropdown -->
            <div v-if="isSearchFocused && (searchRecommendations.length > 0 || searchInput)" class="absolute top-full left-0 right-0 mt-1 backdrop-blur-sm bg-gray-300/40 border border-gray-300/50 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <!-- Recent Searches -->
              <div v-if="!searchInput && searchHistory.length > 0" class="px-3 py-2">
                <p class="text-xs font-semibold text-gray-600 mb-2">Recent Searches</p>
                <div class="space-y-1">
                  <button
                    v-for="(history, idx) in searchHistory.slice(0, 5)"
                    :key="idx"
                    @mousedown.prevent="selectSearchItem(history)"
                    class="w-full text-left px-2 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ history }}
                    <svg class="w-3 h-3 text-gray-400 ml-auto hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" @click.stop="removeSearchHistory(idx)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Product Recommendations -->
              <div v-if="searchInput && searchRecommendations.length > 0" class="px-3 py-2">
                <p class="text-xs font-semibold text-gray-600 mb-2">Product Suggestions</p>
                <div class="space-y-1">
                  <button
                    v-for="product in searchRecommendations.slice(0, 5)"
                    :key="product.id"
                    @mousedown.prevent="selectSearchItem(product.name)"
                    class="w-full text-left px-2 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {{ product.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden sm:block w-px h-4 sm:h-4 md:h-5 bg-gray-300"></div>

          <!-- Cart Button -->
          <button
            @click="uiStore.toggleCartSidebar()"
            class="relative p-1 sm:p-1.5 md:p-2 hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-md transition-all duration-300 flex-shrink-0"
          >
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 sm:top-0 sm:right-0 bg-black text-white text-xs font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs">
              {{ cartStore.itemCount }}
            </span>
          </button>

          <div class="hidden sm:block w-px h-5 sm:h-5 md:h-6 bg-gray-300"></div>

          <!-- Login Button -->
          <button
            @click="landingStore.openAuthModal('login')"
            class="text-xs sm:text-sm md:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-md whitespace-nowrap"
          >
            Login
          </button>

          <!-- Divider -->
          <div class="hidden sm:block w-px h-5 sm:h-5 md:h-6 bg-gray-300"></div>

          <!-- Register Button -->
          <button
            @click="landingStore.openAuthModal('register')"
            class="text-xs sm:text-sm md:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-md whitespace-nowrap"
          >
            Register
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 w-full relative z-0 overflow-x-hidden">
      <router-view />
    </main>

    <!-- Auth Modal -->
    <AuthModal />

    <!-- Cart Sidebar -->
    <CartSidebar :isOpen="uiStore.isCartSidebarOpen" @close="uiStore.closeCartSidebar" />
  </div>

  <!-- Admin Layout -->
  <div v-else>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useLandingStore } from '@/modules/landing/stores/landing.store'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { useCartStore } from '@/stores/cart.store'
import AuthModal from '@/modules/landing/components/modals/AuthModal.vue'
import CartSidebar from '@/components/CartSidebar.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { apiClient } from '@/lib/api'

interface Product {
  id: number
  name: string
  price: number
  category: string
}

const landingStore = useLandingStore()
const authStore = useAuthStore()
const uiStore = useUIStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()

const searchInput = ref('')
const isSearchFocused = ref(false)
const searchRecommendations = ref<Product[]>([])
const searchHistory = ref<string[]>([])
const isLoading = ref(false)
const isCategoryFocused = ref(false)
const categories = ref<any[]>([])

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

// Load search history and categories on mount
onMounted(async () => {
  // Load search history from localStorage
  const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
  searchHistory.value = history

  // Load categories from API
  try {
    const categoryResponse = await apiClient.getCategories()
    categories.value = categoryResponse
  } catch (err) {
    console.error('Failed to load categories:', err)
  }

  // Load user data if authenticated
  if (authStore.token && !authStore.user) {
    try {
      await authStore.getCurrentUser()
      console.log('User data loaded from backend')
    } catch (err) {
      console.error('Failed to initialize user data:', err)
    }
  }
})

// Handle real-time search input
const handleSearchInput = async () => {
  const query = searchInput.value.trim()

  // Clear recommendations if input is empty
  if (!query) {
    searchRecommendations.value = []
    return
  }

  // Fetch recommendations
  try {
    isLoading.value = true
    const response = await apiClient.getProducts(0, 10)
    
    // Filter products based on search query
    if (response && response.data && Array.isArray(response.data)) {
      searchRecommendations.value = response.data
        .filter((product: any) => 
          product.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: typeof product.category === 'object' ? product.category.name : product.category
        }))
        .slice(0, 5)
    } else {
      searchRecommendations.value = []
    }
  } catch (error) {
    console.error('Error fetching search recommendations:', error)
    searchRecommendations.value = []
  } finally {
    isLoading.value = false
  }
}

// Select a search item (from history or recommendations)
const selectSearchItem = (item: string) => {
  searchInput.value = item
  performSearch()
}

// Handle search blur with delay to allow click on dropdown items
const handleSearchBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false
  }, 200)
}

// Handle category blur with delay to allow click on dropdown items
const handleCategoryBlur = () => {
  setTimeout(() => {
    isCategoryFocused.value = false
  }, 200)
}

// Select a category and navigate to search page
const selectCategory = (categoryName: string) => {
  isCategoryFocused.value = false

  // Navigate to search page with category filter
  router.push({
    name: 'search',
    query: { category: categoryName }
  })
}

// Remove search history item
const removeSearchHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// Perform search and navigate to search page
const performSearch = () => {
  if (!searchInput.value.trim()) return

  // Save to search history
  const newHistory = searchHistory.value.filter(h => h !== searchInput.value)
  newHistory.unshift(searchInput.value)
  searchHistory.value = newHistory.slice(0, 10)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))

  // Clear recommendations and blur
  searchRecommendations.value = []
  isSearchFocused.value = false

  // Navigate to search page
  router.push({
    name: 'search',
    query: { q: searchInput.value }
  })
}
</script>
