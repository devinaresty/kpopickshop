<template>
  <section class="bg-gray-100 min-h-screen">
    <div class="mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl bg-gray-100">
      <div class="relative w-full min-h-screen flex flex-col items-center justify-start pt-4 sm:pt-6 lg:pt-8 bg-gray-100">
        <div class="absolute inset-0 pointer-events-auto z-10">

          <FeaturedProductCard
            v-if="featuredProducts[0]"
            :product="featuredProducts[0]"
            :position="{ class: 'top-20 sm:top-28 md:top-36 left-6 sm:left-8 md:left-12 w-28 sm:w-36 md:w-44', delay: 0 }"
          />

          <FeaturedProductCard
            v-if="featuredProducts[1]"
            :product="featuredProducts[1]"
            :position="{ class: 'top-40 sm:top-48 md:top-56 left-1/3 -translate-x-1/2 w-20 sm:w-24 md:w-28', delay: 100 }"
          />

          <FeaturedProductCard
            v-if="featuredProducts[2]"
            :product="featuredProducts[2]"
            :position="{ class: 'top-16 sm:top-24 md:top-32 right-1/3 translate-x-1/2 w-20 sm:w-24 md:w-28', delay: 150 }"
          />

          <FeaturedProductCard
            v-if="featuredProducts[3]"
            :product="featuredProducts[3]"
            :position="{ class: 'top-36 sm:top-44 md:top-52 right-6 sm:right-8 md:right-12 w-28 sm:w-36 md:w-44', delay: 200 }"
          />
        </div>

        <div class="relative z-30 w-full max-w-6xl px-3 sm:px-4 md:px-5 lg:px-6 text-center py-12 sm:py-14 lg:py-16 bg-gray-100">
          <h1 class="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-black mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight px-1 sm:px-0">
            Discover Your
            <span class="inline-block relative mt-1 sm:mt-2">
              Bias
              <span
                class="absolute bottom-0 sm:bottom-0.5 lg:bottom-1 left-0 right-0 h-0.5 sm:h-0.5 lg:h-1 bg-black opacity-30 w-full rounded-full"
                style="animation: expand 1s ease-out forwards"
              />
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-xs sm:text-sm md:text-base lg:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6 lg:mb-8 max-w-xl mx-auto leading-relaxed px-1 sm:px-2">
            Experience the ultimate K-pop collection. Premium albums, exclusive merchandise, and rare collectibles all in one place.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center px-1 sm:px-0">
            <button
              class="px-6 py-2.5 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm whitespace-nowrap w-fit mx-auto sm:mx-0"
            >
              Shop Now
            </button>
            <button
              class="px-6 py-2.5 border-2 border-black text-black rounded-md font-semibold hover:bg-black/5 transition-all duration-300 text-sm whitespace-nowrap w-fit mx-auto sm:mx-0"
            >
              View Collection
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-1.5 sm:gap-2.5 md:gap-4 lg:gap-6 mt-6 sm:mt-7 md:mt-8 lg:mt-10 max-w-lg mx-auto px-1 sm:px-2">
            <div class="text-center">
              <p class="text-lg sm:text-xl md:text-2xl lg:text-2xl font-black text-black mb-0.5 sm:mb-1">500+</p>
              <p class="text-xs sm:text-xs md:text-sm lg:text-sm text-gray-600">Products</p>
            </div>
            <div class="text-center">
              <p class="text-lg sm:text-xl md:text-2xl lg:text-2xl font-black text-black mb-0.5 sm:mb-1">50+</p>
              <p class="text-xs sm:text-xs md:text-sm lg:text-sm text-gray-600">Artists</p>
            </div>
            <div class="text-center">
              <p class="text-lg sm:text-xl md:text-2xl lg:text-2xl font-black text-black mb-0.5 sm:mb-1">10K+</p>
              <p class="text-xs sm:text-xs md:text-sm lg:text-sm text-gray-600">Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FeaturedProductCard from '@/modules/landing/components/shared/FeaturedProductCard.vue'
import type { FeaturedProduct } from '@/modules/landing/types'  // ← IMPORT dari types

// Gunakan interface yang unified
const featuredProducts = ref<FeaturedProduct[]>([
  {
    id: 1,
    name: 'Premium K-pop Album',
    price: 299000,
    stock: 50,
    imageUrl: '/images/album-1.jpg',  // ← Consistent naming
    badge: 'Hot',
    artist: 'BLACKPINK'
  },
  {
    id: 2,
    name: 'Limited Edition Merchandise',
    price: 199000,
    stock: 30,
    imageUrl: '/images/merch-1.jpg',
    badge: 'New',
    artist: 'BTS'
  },
  {
    id: 3,
    name: 'Exclusive Collectible',
    price: 449000,
    stock: 15,
    imageUrl: '/images/collectible-1.jpg',
    badge: 'Sale',
    artist: 'TWICE'
  },
  {
    id: 4,
    name: 'Artist Signed Item',
    price: 599000,
    stock: 5,
    imageUrl: '/images/signed-1.jpg',
    badge: 'Rare',
    artist: 'STRAY KIDS'
  },
])
</script>

// ...rest of template stays the same...