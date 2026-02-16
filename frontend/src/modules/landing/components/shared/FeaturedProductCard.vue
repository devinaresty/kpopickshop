<template>
  <div
    class="group absolute cursor-pointer pointer-events-auto"
    :class="position.class"
    :style="animationStyle"
    @click="handleProductClick"
  >
    <div
      class="relative bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >

      <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
        <svg v-else class="w-1/3 h-1/3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div
        class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300"
        :class="{ 'opacity-100': isHovered }"
      >
        <p class="text-white text-xs sm:text-sm font-semibold mb-2 text-center px-2">{{ product.name }}</p>
        <button
          class="px-3 sm:px-4 py-1 sm:py-1.5 bg-white text-black rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          View Details
        </button>
      </div>

      <div
        v-if="product.badge"
        class="absolute top-2 right-2 bg-black text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold"
      >
        {{ product.badge }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Product {
  id: string | number
  name: string
  imageUrl?: string
  badge?: string
}

interface Position {
  class: string
  delay: number
}

const props = defineProps<{
  product: Product
  position: Position
}>()

const isHovered = ref(false)
const isAnimating = ref(true)

const animationStyle = computed(() => {
  return {
    animation: `scaleInProduct 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, floatProduct 4s ease-in-out ${props.position.delay + 700}ms infinite`,
    animationDelay: `${props.position.delay}ms`,
  }
})

const handleProductClick = () => {

  console.log(`Product clicked: ${props.product.id}`)
}

onMounted(() => {
  setTimeout(() => {
    isAnimating.value = false
  }, 600)
})
</script>

<style scoped>
@keyframes scaleInProduct {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes floatProduct {
  0%, 100% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(-12px);
  }
  50% {
    transform: translateY(-20px);
  }
  75% {
    transform: translateY(-12px);
  }
}
</style>
