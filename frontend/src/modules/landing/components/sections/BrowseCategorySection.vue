<template>
  <section class="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-8 sm:mb-12">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Browse by Category</h2>
        <p class="text-base sm:text-lg text-gray-600">Jelajahi koleksi lengkap kami</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          @click="navigateToCategory(category)"
          class="group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <!-- Category Card -->
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-40 sm:h-48 lg:h-56 flex items-center justify-center overflow-hidden relative">
            <!-- Background Image (if available) -->
            <img
              :src="getCategoryImage(category)"
              :alt="category.name"
              class="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-300"
            />
            <!-- Fallback Icon if error -->
            <div class="absolute inset-0 items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 hidden">
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4m0 0L4 7m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0L12 3m0 0L4 7m0 0v10a2 2 0 002 2h12a2 2 0 002-2V7" />
              </svg>
            </div>
            <!-- Dark Overlay -->
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
            
            <!-- Category Name -->
            <div class="relative z-10 text-center">
              <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-gray-50 transition-colors">
                {{ category.name }}
              </h3>
              <p v-if="category.description" class="text-xs sm:text-sm text-gray-200 mt-1">
                {{ category.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Categories Button -->
      <div class="mt-8 sm:mt-12 text-center">
        <router-link
          to="/categories"
          class="inline-block px-6 sm:px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          View All Categories
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '@/lib/api'

const router = useRouter()

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
}

const categories = ref<Category[]>([])
const isLoading = ref(true)

const loadCategories = async () => {
  try {
    isLoading.value = true
    const data = await apiClient.getCategories()
    categories.value = data.slice(0, 8) // Show first 8 categories
  } catch (err) {
    console.error('Failed to load categories:', err)
  } finally {
    isLoading.value = false
  }
}

const getCategoryImage = (category: Category): string => {
  if (category.image) return category.image
  
  // Fallback images based on category name
  const fallbackImages: Record<string, string> = {
    'Accessories': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    'Albums': 'https://images.unsplash.com/photo-1611339555312-e607c25352ca?w=500&h=500&fit=crop',
    'Lightstick': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    'Photobook': 'https://images.unsplash.com/photo-1532012197267-da84d127e637?w=500&h=500&fit=crop',
  }
  
  return fallbackImages[category.name] || 'https://images.unsplash.com/photo-1557804506-669214b2b9ba?w=500&h=500&fit=crop'
}

const navigateToCategory = (category: Category) => {
  router.push({
    name: 'search',
    query: { category: category.slug }
  })
}

onMounted(() => {
  loadCategories()
})
</script>
