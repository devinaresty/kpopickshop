<template>
  <section class="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-full px-3 sm:px-4 lg:px-8">
      <!-- Section Header -->
      <div class="mb-8 sm:mb-12">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-2">Popular Artists</h2>
        <p class="text-xs sm:text-sm lg:text-base text-gray-600">Discover amazing K-pop artists and groups</p>
      </div>

      <!-- First Carousel - Scroll Left -->
      <div class="mb-8 sm:mb-12 overflow-hidden">
        <div class="flex gap-4 sm:gap-6 animate-scroll-left">
          <div
            v-for="artist in [...artists, ...artists]"
            :key="`left-${artist.id}`"
            class="flex-shrink-0 w-32 sm:w-40 md:w-48 group"
          >
            <div
              class="bg-gradient-to-br from-gray-300 to-gray-400 aspect-square rounded-lg overflow-hidden mb-4 cursor-pointer relative"
            >
              <!-- Artist Image Placeholder -->
              <div
                class="w-full h-full flex items-center justify-center text-white text-6xl font-black opacity-50"
              >
                {{ artist.name.charAt(0) }}
              </div>

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
              >
                <button
                  class="w-full px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>

            <!-- Artist Info -->
            <h3 class="font-bold text-black mb-1 truncate text-xs sm:text-sm">{{ artist.name }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 truncate">K-pop Artist</p>
          </div>
        </div>
      </div>

      <!-- Second Carousel - Scroll Right -->
      <div class="overflow-hidden">
        <div class="flex gap-4 sm:gap-6 animate-scroll-right">
          <div
            v-for="artist in [...artists.slice().reverse(), ...artists.slice().reverse()]"
            :key="`right-${artist.id}`"
            class="flex-shrink-0 w-32 sm:w-40 md:w-48 group"
          >
            <div
              class="bg-gradient-to-br from-gray-300 to-gray-400 aspect-square rounded-lg overflow-hidden mb-4 cursor-pointer relative"
            >
              <!-- Artist Image Placeholder -->
              <div
                class="w-full h-full flex items-center justify-center text-white text-6xl font-black opacity-50"
              >
                {{ artist.name.charAt(0) }}
              </div>

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
              >
                <button
                  class="w-full px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>

            <!-- Artist Info -->
            <h3 class="font-bold text-black mb-1 truncate text-xs sm:text-sm">{{ artist.name }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 truncate">K-pop Artist</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Artist } from '@/modules/landing/domain/landing.types'

const artists = ref<Artist[]>([
  { id: '1', name: 'TWICE' },
  { id: '2', name: 'BTS' },
  { id: '3', name: 'BLACKPINK' },
  { id: '4', name: 'Stray Kids' },
  { id: '5', name: 'NewJeans' },
  { id: '6', name: 'IVE' }
])
</script>

<style scoped>
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 12px));
  }
}

@keyframes scroll-right {
  0% {
    transform: translateX(calc(-50% - 12px));
  }
  100% {
    transform: translateX(0);
  }
}

.animate-scroll-left {
  animation: scroll-left 30s linear infinite;
}

.animate-scroll-right {
  animation: scroll-right 30s linear infinite;
}
</style>
