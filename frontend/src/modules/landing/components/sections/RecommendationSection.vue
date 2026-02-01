<template>
  <section class="py-16 sm:py-20 bg-white">
    <div class="max-w-full px-3 sm:px-4 lg:px-8">
      <!-- Tabs -->
      <div class="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-300"
          :class="
            activeTab === tab
              ? 'text-black border-b-2 border-black'
              : 'text-gray-600 hover:text-gray-900'
          "
        >
          {{ tab }}
        </button>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div
          v-for="(product, index) in displayedProducts"
          :key="product.id"
          class="group"
          :style="{ animation: `fadeInUp 0.5s ease-out forwards`, animationDelay: `${index * 50}ms` }"
        >
          <div
            class="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
            @mouseenter="hoveredProduct = product.id"
            @mouseleave="hoveredProduct = null"
          >
            <!-- Product Image -->
            <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>

              <!-- Flash Sale Badge -->
              <div
                v-if="activeTab === 'Flash Sale'"
                class="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
              >
                -30%
              </div>
            </div>

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300"
              :class="{ 'opacity-100': hoveredProduct === product.id }"
            >
              <button
                class="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="mt-4">
            <p class="text-sm text-gray-500 mb-1">{{ product.category }}</p>
            <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
              {{ product.title }}
            </h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-bold text-black">
                  ${{ product.price.toFixed(2) }}
                </p>
                <p
                  v-if="activeTab === 'Flash Sale'"
                  class="text-xs text-gray-500 line-through"
                >
                  ${{ (product.price * 1.43).toFixed(2) }}
                </p>
              </div>
              <span class="text-xs text-gray-500">
                {{ product.sold }} sold
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- View All -->
      <div class="mt-8 sm:mt-12 text-center">
        <button
          class="px-6 sm:px-8 py-3 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base"
        >
          View More {{ activeTab }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '../../domain/landing.types'

const activeTab = ref('For You')
const hoveredProduct = ref<string | null>(null)
const tabs = ['For You', 'Flash Sale']

const forYouProducts = ref<Product[]>([
  {
    id: '5',
    title: 'Seventeen "God\'s Menu" CD',
    price: 22.99,
    image: '',
    sold: 142,
    category: 'Albums'
  },
  {
    id: '6',
    title: 'LOONA Official Merch Set',
    price: 55.00,
    image: '',
    sold: 76,
    category: 'Merchandise'
  },
  {
    id: '7',
    title: 'Aespa Lightstick Bundles',
    price: 50.00,
    image: '',
    sold: 98,
    category: 'Merchandise'
  },
  {
    id: '8',
    title: 'Red Velvet Poster Collection',
    price: 15.99,
    image: '',
    sold: 64,
    category: 'Posters'
  }
])

const flashSaleProducts = ref<Product[]>([
  {
    id: '9',
    title: 'TXT "Minisode" Vinyl Record',
    price: 20.99,
    image: '',
    sold: 195,
    category: 'Albums'
  },
  {
    id: '10',
    title: 'Seventeen Official Lightstick',
    price: 35.00,
    image: '',
    sold: 143,
    category: 'Merchandise'
  },
  {
    id: '11',
    title: 'ENHYPEN Concert Merchandise',
    price: 40.00,
    image: '',
    sold: 112,
    category: 'Merchandise'
  },
  {
    id: '12',
    title: 'itzy Album Set Complete',
    price: 24.99,
    image: '',
    sold: 187,
    category: 'Albums'
  }
])

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
