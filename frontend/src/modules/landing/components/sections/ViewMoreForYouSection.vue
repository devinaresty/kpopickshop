<template>
  <section class="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <!-- Section Title -->
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">View More For You</h2>
      
      <!-- Section Description -->
      <p class="text-lg sm:text-xl text-gray-600 mb-8">Jelajahi produk yang mungkin Anda sukai</p>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="product in products" :key="product.id" class="bg-white rounded-lg p-4">
          <!-- Product card content -->
        </div>
      </div>

      <!-- View All Button -->
      <div class="flex justify-center">
        <button 
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
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useLandingStore } from '@/modules/landing/stores/landing.store'
import { useRouter } from 'vue-router'

// Define Product Type
interface ProductType {
  id: number
  name: string
  image: string
  price: number
}

// Initialize stores dan router
const authStore = useAuthStore()
const landingStore = useLandingStore()
const router = useRouter()

// Sample products data - untuk testing
const products = ref<ProductType[]>([
  { id: 1, name: 'Product 1', image: '/product1.jpg', price: 100000 },
  { id: 2, name: 'Product 2', image: '/product2.jpg', price: 150000 },
  { id: 3, name: 'Product 3', image: '/product3.jpg', price: 120000 },
])

// Handle View All Click
const handleViewAllClick = () => {
  if (authStore.isAuthenticated) {
    // User sudah login - navigate ke products page
    router.push('/products')
  } else {
    // User belum login - show auth modal
    landingStore.openAuthModal('login')
  }
}
</script>

<style scoped>
/* TODO 10: Tambahkan CSS jika perlu */
/* Instruksi: Anda bisa tambahkan hover effects, transitions, dll */
</style>
