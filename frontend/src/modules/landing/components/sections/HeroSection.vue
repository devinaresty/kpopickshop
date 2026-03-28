<template>
  <section class="w-full bg-gray-100 py-0 sm:py-0 md:py-0 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
  
    <div class="flex items-center justify-center px-2 sm:px-3 md:px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div 
        class="relative w-full max-w-6xl h-72 sm:h-96 md:h-[420px] lg:h-[500px] overflow-hidden rounded-lg"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- Hero Banner Image Carousel Container -->
        <button
          @click="handleBannerClick"
          class="relative w-full h-full overflow-hidden hover:opacity-90 transition-opacity duration-300 cursor-pointer"
        >
          <!-- Slides Wrapper with smooth horizontal scroll -->
          <div 
            class="flex h-full transition-transform duration-700 ease-in-out select-none"
            :style="{ transform: `translateX(${-currentBannerIndex * 100}%)` }"
          >
            <img
              v-for="(image, index) in bannerImages"
              :key="index"
              :src="image"
              :alt="`Banner ${index + 1}`"
              class="w-full h-full flex-shrink-0 object-contain"
            />
          </div>
        </button>

        <!-- Left Chevron -->
        <button
          @click="previousBanner"
          class="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-gray-300/70 hover:bg-gray-400/80 text-gray-600 p-2 sm:p-2.5 rounded-full transition-all duration-300 transform hover:scale-105"
          :aria-label="'Previous banner'"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Right Chevron -->
        <button
          @click="nextBanner"
          class="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-300/70 hover:bg-gray-400/80 text-gray-600 p-2 sm:p-2.5 rounded-full transition-all duration-300 transform hover:scale-105"
          :aria-label="'Next banner'"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Dynamic Pill/Dot Indicators -->
        <div class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          <button
            v-for="(_, index) in bannerImages"
            :key="index"
            @click="currentBannerIndex = index"
            class="transition-all duration-300 cursor-pointer rounded-full"
            :class="currentBannerIndex === index ? 'bg-white w-8 h-2.5 sm:w-9 sm:h-3 shadow-lg' : 'bg-white/60 w-2 h-2 sm:w-2.5 sm:h-2.5 hover:bg-white'"
            :aria-label="`Go to banner ${index + 1}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const bannerImages = [
  '/images/bannerh2h.png',
  '/images/bannerillit.png'
]

// Map each banner to its navigation destination
const bannerLinks: { [key: number]: { name: string; params?: Record<string, string>; query?: Record<string, string> } } = {
  0: { name: 'product-detail', params: { id: '7' } }, // H2H banner - direct to product detail page (Hearts2Hearts lightstick)
  1: { name: 'search', query: { artist: 'illit' } } // ILLIT banner - to search page
}

const currentBannerIndex = ref(0)
let autoSlideInterval: ReturnType<typeof setInterval> | null = null
let touchStartX = 0

const nextBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % bannerImages.length
  resetAutoSlide()
}

const previousBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value - 1 + bannerImages.length) % bannerImages.length
  resetAutoSlide()
}

const handleBannerClick = () => {
  const linkConfig = bannerLinks[currentBannerIndex.value]
  if (linkConfig) {
    router.push({
      name: linkConfig.name,
      params: linkConfig.params,
      query: linkConfig.query
    })
  }
}

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0]?.clientX ?? 0
}

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0]?.clientX ?? 0
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextBanner()
    } else {
      previousBanner()
    }
  }
}

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % bannerImages.length
  }, 5000)
}

const resetAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
  startAutoSlide()
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>