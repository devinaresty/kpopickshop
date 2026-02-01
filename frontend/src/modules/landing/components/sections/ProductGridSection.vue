<template>
  <section class="py-16 sm:py-20 bg-white">
    <div class="max-w-full px-3 sm:px-4 lg:px-8">
      <!-- Section Header -->
      <div class="mb-6 sm:mb-8 lg:mb-12">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-2">Featured Products</h2>
        <p class="text-xs sm:text-sm lg:text-base text-gray-600">Trending items from your favorite artists</p>
      </div>

      <!-- Product Grid with Stagger Animation -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="group"
          :style="{ animation: `scaleInStagger 0.6s ease-out forwards`, animationDelay: `${index * 100}ms` }"
        >
          <div
            class="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-transform duration-500"
            @mouseenter="hoveredProduct = product.id"
            @mouseleave="hoveredProduct = null"
          >
            <!-- Product Image -->
            <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300"
              :class="{ 'opacity-100': hoveredProduct === product.id }"
            >
              <button
                class="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Details
              </button>
            </div>

            <!-- Sale Badge -->
            <div
              v-if="product.sold > 50"
              class="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold"
            >
              Popular
            </div>
          </div>

          <!-- Product Info -->
          <div class="mt-4">
            <p class="text-sm text-gray-500 mb-1">{{ product.category }}</p>
            <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
              {{ product.title }}
            </h3>
            <div class="flex items-center justify-between">
              <p class="text-lg font-bold text-black">
                ${{ product.price.toFixed(2) }}
              </p>
              <span class="text-xs text-gray-500">
                {{ product.sold }} sold
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="mt-8 sm:mt-12 text-center">
        <button
          class="px-6 sm:px-8 py-3 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base"
        >
          View All Products
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '../../domain/landing.types'

const hoveredProduct = ref<string | null>(null)

const products = ref<Product[]>([
  {
    id: '1',
    title: 'TWICE "Set Me Free" Album',
    price: 25.99,
    image: '',
    sold: 156,
    category: 'Albums'
  },
  {
    id: '2',
    title: 'BTS Official Lightstick',
    price: 45.00,
    image: '',
    sold: 203,
    category: 'Merchandise'
  },
  {
    id: '3',
    title: 'Stray Kids Concert Poster',
    price: 12.99,
    image: '',
    sold: 89,
    category: 'Posters'
  },
  {
    id: '4',
    title: 'BLACKPINK Pink Album Deluxe',
    price: 35.50,
    image: '',
    sold: 178,
    category: 'Albums'
  }
])
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
