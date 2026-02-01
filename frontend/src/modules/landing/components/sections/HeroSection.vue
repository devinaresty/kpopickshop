<template>
  <section class="relative min-h-screen flex flex-col items-center justify-start pt-4 sm:pt-6 lg:pt-8 overflow-hidden bg-gradient-to-b from-white via-white to-gray-50">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
      />
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style="animation-delay: 2s"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-full px-3 sm:px-4 lg:px-8 text-center py-8 sm:py-10 lg:py-12">
      <!-- Main Title -->
      <h1 class="text-4xl sm:text-5xl lg:text-7xl font-black text-black mb-4 sm:mb-6 leading-tight">
        Discover Your
        <span class="inline-block relative">
          Bias
          <span
            class="absolute bottom-1 sm:bottom-2 left-0 right-0 h-1 bg-black opacity-30 w-full rounded-full"
            style="animation: expand 1s ease-out forwards"
          />
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
        Experience the ultimate K-pop collection. Premium albums, exclusive merchandise, and rare collectibles all in one place.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <button
          class="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
        >
          Shop Now
        </button>
        <button
          class="px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-black/5 transition-all duration-300 text-sm sm:text-base"
        >
          View Collection
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-10 lg:mt-12 max-w-xl mx-auto">
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-black mb-1">500+</p>
          <p class="text-xs sm:text-sm text-gray-600">Products</p>
        </div>
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-black mb-1">50+</p>
          <p class="text-xs sm:text-sm text-gray-600">Artists</p>
        </div>
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-black mb-1">10K+</p>
          <p class="text-xs sm:text-sm text-gray-600">Customers</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No logic needed for hero section
</script>

<style scoped>
@keyframes expand {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
